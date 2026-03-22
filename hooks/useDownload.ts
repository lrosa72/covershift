/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { GeneratedImageState } from '../types';
import { useToast } from '../contexts/ToastContext';

export interface UseDownloadReturn {
  isDownloading: boolean;
  downloadSingle: (key: string, image: GeneratedImageState) => void;
  downloadAll: (generatedImages: Record<string, GeneratedImageState>) => Promise<void>;
  downloadAlbum: (generatedImages: Record<string, GeneratedImageState>) => Promise<void>;
}

export function useDownload(): UseDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  // 下载单张图片
  const downloadSingle = useCallback((key: string, image: GeneratedImageState) => {
    if (image?.status !== 'done' || !image.url) {
      toast.error('Download failed', 'Image not ready');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `covershift-${key}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Downloaded', `${key} saved`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed', 'Please try again');
    }
  }, [toast]);

  // 下载所有图片（ZIP）
  const downloadAll = useCallback(async (generatedImages: Record<string, GeneratedImageState>) => {
    setIsDownloading(true);

    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      let hasImages = false;

      (Object.entries(generatedImages) as [string, GeneratedImageState][]).forEach(([key, image]) => {
        if (image.status === 'done' && image.url) {
          const base64Data = image.url.split(',')[1];
          zip.file(`covershift-${key}.jpg`, base64Data, { base64: true });
          hasImages = true;
        }
      });

      if (!hasImages) {
        toast.warning('No images', 'Wait for generation to complete');
        return;
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'covershift-collection.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.success('Download complete', 'ZIP file saved');
    } catch (error) {
      console.error('ZIP creation error:', error);
      toast.error('Download failed', 'Failed to create ZIP file');
    } finally {
      setIsDownloading(false);
    }
  }, [toast]);

  // 下载相册
  const downloadAlbum = useCallback(async (generatedImages: Record<string, GeneratedImageState>) => {
    setIsDownloading(true);

    try {
      const { createAlbumPage } = await import('../lib/albumUtils');
      const imageData: Record<string, string> = {};

      (Object.entries(generatedImages) as [string, GeneratedImageState][])
        .filter(([, image]) => image.status === 'done' && image.url)
        .forEach(([key, image]) => {
          imageData[key] = image.url!;
        });

      const keys = Object.keys(imageData);
      if (keys.length === 0) {
        toast.warning('No images', 'Wait for generation to complete');
        return;
      }

      const albumDataUrl = await createAlbumPage(imageData);

      const link = document.createElement('a');
      link.href = albumDataUrl;
      link.download = 'covershift-collection-album.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Album created', 'Collection saved');
    } catch (error) {
      console.error('Album creation error:', error);
      toast.error('Album failed', 'Failed to create album');
    } finally {
      setIsDownloading(false);
    }
  }, [toast]);

  return {
    isDownloading,
    downloadSingle,
    downloadAll,
    downloadAlbum,
  };
}

export default useDownload;
