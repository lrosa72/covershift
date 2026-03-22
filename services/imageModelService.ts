/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STORAGE_KEY = 'COVERSHIFT_IMAGE_API_KEY';
const DEFAULT_IMAGE_ENDPOINT = 'https://api.openai.com/v1/images/edits';
const DEFAULT_IMAGE_MODEL = 'gpt-image-1';

function getApiKeyFromStorage(): string {
  if (typeof window === 'undefined') return '';
  return (localStorage.getItem(STORAGE_KEY) || '').trim();
}

function getConfiguredEndpoint(): string {
  return (import.meta as any).env?.VITE_IMAGE_API_ENDPOINT || DEFAULT_IMAGE_ENDPOINT;
}

function getConfiguredModel(): string {
  return (import.meta as any).env?.VITE_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
}

function getFallbackPrompt(decade: string): string {
  return `Create a high-fashion magazine cover photograph of the exact same person from this source image as if they were in the ${decade}. Preserve facial identity, bone structure, and unique features while matching the era's styling and editorial tone.`;
}

function extractDecade(prompt: string): string | null {
  const match = prompt.match(/(\d{4}s)/);
  return match ? match[1] : null;
}

function parseDataUrl(imageDataUrl: string): { mimeType: string; base64Data: string } {
  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data URL format. Expected 'data:image/...;base64,...'");
  }
  const [, mimeType, base64Data] = match;
  return { mimeType, base64Data };
}

function base64ToFile(base64Data: string, mimeType: string, fileName: string): File {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let index = 0; index < len; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }
  return new File([bytes], fileName, { type: mimeType });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read generated image blob.'));
    reader.readAsDataURL(blob);
  });
}

async function responseImageToDataUrl(payload: any): Promise<string> {
  const first = payload?.data?.[0];
  if (!first) {
    throw new Error('Image model did not return any image payload.');
  }

  if (first.b64_json) {
    return `data:image/png;base64,${first.b64_json}`;
  }

  if (first.url) {
    const remoteImage = await fetch(first.url);
    if (!remoteImage.ok) {
      throw new Error('Unable to fetch image URL returned by image model.');
    }
    const blob = await remoteImage.blob();
    return blobToDataUrl(blob);
  }

  throw new Error('Image model response format is not supported.');
}

async function callImageModelWithRetry(imageDataUrl: string, prompt: string): Promise<string> {
  const apiKey = getApiKeyFromStorage();
  if (!apiKey) {
    throw new Error('API Key is not configured. Please set it in app settings.');
  }

  const { mimeType, base64Data } = parseDataUrl(imageDataUrl);
  const sourceImage = base64ToFile(base64Data, mimeType, 'source-image.png');
  const endpoint = getConfiguredEndpoint();
  const model = getConfiguredModel();

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const formData = new FormData();
    formData.append('model', model);
    formData.append('prompt', prompt);
    formData.append('size', '1024x1024');
    formData.append('image', sourceImage);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (response.ok) {
      const payload = await response.json();
      return responseImageToDataUrl(payload);
    }

    const errorPayload = await response.text();
    const retriable = response.status >= 500 || response.status === 429;
    if (retriable && attempt < maxRetries) {
      const delay = 800 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    throw new Error(`Image model request failed (${response.status}): ${errorPayload || 'Unknown error'}`);
  }

  throw new Error('Image model request failed after retries.');
}

export async function generateDecadeImage(imageDataUrl: string, prompt: string): Promise<string> {
  try {
    return await callImageModelWithRetry(imageDataUrl, prompt);
  } catch (error) {
    const originalMessage = error instanceof Error ? error.message : String(error);
    const decade = extractDecade(prompt);
    if (!decade) {
      throw error;
    }

    const fallbackPrompt = getFallbackPrompt(decade);
    try {
      return await callImageModelWithRetry(imageDataUrl, fallbackPrompt);
    } catch (fallbackError) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      throw new Error(`Image generation failed. Original: ${originalMessage}. Fallback: ${fallbackMessage}`);
    }
  }
}
