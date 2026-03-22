/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import MagazineCover from './MagazineCover';

interface UploadSectionProps {
  selectedMagazine: string;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Ghost polaroids 配置
const GHOST_POLAROIDS_CONFIG = [
  { initial: { x: "-150%", y: "-100%", rotate: -30 }, transition: { delay: 0.2 } },
  { initial: { x: "150%", y: "-80%", rotate: 25 }, transition: { delay: 0.4 } },
  { initial: { x: "-120%", y: "120%", rotate: 45 }, transition: { delay: 0.6 } },
  { initial: { x: "180%", y: "90%", rotate: -20 }, transition: { delay: 0.8 } },
  { initial: { x: "0%", y: "-200%", rotate: 0 }, transition: { delay: 0.5 } },
  { initial: { x: "100%", y: "150%", rotate: 10 }, transition: { delay: 0.3 } },
];

export default function UploadSection({ selectedMagazine, onImageUpload }: UploadSectionProps) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* Ghost polaroids 动画 */}
      {GHOST_POLAROIDS_CONFIG.map((config, index) => (
        <motion.div
          key={index}
          className="absolute w-80 h-[26rem] rounded-md p-4 bg-neutral-100/10 blur-sm"
          initial={config.initial}
          animate={{
            x: "0%",
            y: "0%",
            rotate: (Math.random() - 0.5) * 20,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            ...config.transition,
            ease: "circOut",
            duration: 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.8, type: 'spring' }}
        className="flex flex-col items-center"
      >
        <label htmlFor="file-upload" className="cursor-pointer group transform hover:scale-105 transition-transform duration-300">
          <MagazineCover
            caption="The Icon"
            status="done"
            magazineId={selectedMagazine}
          />
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={onImageUpload}
        />
        <p className="mt-6 font-playfair italic text-neutral-500 text-center max-w-xs text-base">
          Click the cover to upload your portrait and start your high-fashion journey.
        </p>
      </motion.div>
    </div>
  );
}
