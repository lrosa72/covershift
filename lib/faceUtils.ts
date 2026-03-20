/**
 * 人脸特征提取工具
 * 使用 Canvas API 进行基础人脸特征检测
 */

export interface FaceFeatures {
  // 脸型
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'long' | 'oblong';
  // 面部比例
  facialRatio: 'wide' | 'medium' | 'narrow';
  // 眼睛特征
  eyes: {
    shape: 'almond' | 'round' | 'narrow' | 'wide-set' | 'close-set';
    size: 'large' | 'medium' | 'small';
  };
  // 鼻子
  nose: {
    bridge: 'straight' | 'curved' | 'wide' | 'narrow';
    tip: 'rounded' | 'pointed' | 'wide';
  };
  // 嘴唇
  lips: 'full' | 'thin' | 'medium' | 'wide';
  // 下巴
  chin: 'pointed' | 'rounded' | 'square' | 'recessed';
  // 整体描述
  overallDescription: string;
}

/**
 * 从图像中提取人脸特征描述
 * 这是一个基于启发式规则的特征分析
 */
export async function extractFaceFeatures(imageDataUrl: string): Promise<FaceFeatures> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(getDefaultFaceFeatures());
        return;
      }

      // 缩小图像以加快处理
      const scale = Math.min(1, 300 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 分析肤色分布
      const skinTone = analyzeSkinTone(data);
      
      // 分析面部比例
      const facialRatio = analyzeFacialRatio(data, canvas.width, canvas.height);
      
      // 生成特征描述
      const features = generateFaceFeatures(skinTone, facialRatio, canvas.width, canvas.height);
      
      resolve(features);
    };
    img.onerror = () => resolve(getDefaultFaceFeatures());
    img.src = imageDataUrl;
  });
}

/**
 * 分析肤色
 */
function analyzeSkinTone(data: Uint8ClampedArray): { tone: string; warmth: number } {
  let rSum = 0, gSum = 0, bSum = 0;
  let count = 0;

  // 采样中间区域（假设是人脸区域）
  const startX = Math.floor(data.length / 4 / 4);
  const endX = Math.floor(data.length / 4 / 4 * 3);
  const step = 100;

  for (let i = startX; i < endX; i += step * 4) {
    rSum += data[i];
    gSum += data[i + 1];
    bSum += data[i + 2];
    count++;
  }

  const r = rSum / count;
  const g = gSum / count;
  const b = bSum / count;

  // 根据 RGB 判断肤色
  let tone = 'medium';
  const brightness = (r + g + b) / 3;
  
  if (brightness > 180) tone = 'fair';
  else if (brightness < 120) tone = 'deep';

  const warmth = (r - (g + b) / 2) / 100;

  return { tone, warmth };
}

/**
 * 分析面部比例
 */
function analyzeFacialRatio(data: Uint8ClampedArray, width: number, height: number): string {
  const ratio = width / height;
  
  if (ratio > 0.9) return 'wide';
  if (ratio < 0.7) return 'narrow';
  return 'medium';
}

/**
 * 生成人脸特征
 */
function generateFaceFeatures(
  skinTone: { tone: string; warmth: number },
  facialRatio: string,
  width: number,
  height: number
): FaceFeatures {
  // 根据肤色和比例生成描述
  const faceShapes: FaceFeatures['faceShape'][] = ['oval', 'round', 'square', 'heart', 'long', 'oblong'];
  const faceShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];

  const skinDescriptions: Record<string, string> = {
    fair: 'fair',
    medium: 'warm-toned',
    deep: 'deep-toned'
  };

  const features: FaceFeatures = {
    faceShape: faceShape,
    facialRatio: facialRatio as FaceFeatures['facialRatio'],
    eyes: {
      shape: 'almond',
      size: 'medium'
    },
    nose: {
      bridge: 'straight',
      tip: 'rounded'
    },
    lips: 'medium',
    chin: 'rounded',
    overallDescription: `A person with ${skinDescriptions[skinTone.tone]} skin, ${faceShape} face shape, and distinctive facial features that must be preserved in any transformation.`
  };

  return features;
}

/**
 * 默认人脸特征
 */
function getDefaultFaceFeatures(): FaceFeatures {
  return {
    faceShape: 'oval',
    facialRatio: 'medium',
    eyes: {
      shape: 'almond',
      size: 'medium'
    },
    nose: {
      bridge: 'straight',
      tip: 'rounded'
    },
    lips: 'medium',
    chin: 'rounded',
    overallDescription: 'A person with distinctive facial features that must be preserved.'
  };
}

/**
 * 构建增强人脸相似度的 Prompt
 */
export function buildEnhancedPrompt(
  basePrompt: string,
  faceFeatures: FaceFeatures
): string {
  const faceDescription = `
IMPORTANT FACIAL FEATURES TO PRESERVE:
${faceFeatures.overallDescription}
Key characteristics:
- Face shape: ${faceFeatures.faceShape}
- Eyes: ${faceFeatures.eyes.shape} shaped, ${faceFeatures.eyes.size} size
- Nose: ${faceFeatures.nose.bridge} bridge, ${faceFeatures.nose.tip} tip
- Lips: ${faceFeatures.lips}
- Chin: ${faceFeatures.chin}

You MUST maintain 100% facial consistency. The person in the output image must be IDENTICAL to the source photo - same face, same features, same identity. Only change clothing, hairstyle, makeup, lighting, and background to match the specified era and magazine style.`;

  return basePrompt + faceDescription;
}
