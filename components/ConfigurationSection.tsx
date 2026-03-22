/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import MagazineCover from './MagazineCover';
import MagazineSelector from './MagazineSelector';
import DecadeSelector from './DecadeSelector';
import CreativeStyleSelector from './CreativeStyleSelector';
import CustomPromptEditor from './CustomPromptEditor';

interface ConfigurationSectionProps {
  uploadedImage: string;
  selectedMagazines: string[];
  selectedDecades: string[];
  selectedCreativeStyles: string[];
  showAdvanced: boolean;
  enhanceFaceConsistency: boolean;
  promptTemplate: string;
  useCustomPrompt: boolean;
  hasApiKey: boolean;
  onMagazinesChange: (magazines: string[]) => void;
  onDecadesChange: (decades: string[]) => void;
  onStylesChange: (styles: string[]) => void;
  onShowAdvancedChange: (show: boolean) => void;
  onEnhanceFaceConsistencyChange: (enhance: boolean) => void;
  onPromptChange: (prompt: string) => void;
  onPromptReset: () => void;
  onDifferentPhoto: () => void;
  onGenerate: () => void;
}

const primaryButtonClasses = "font-permanent-marker text-xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:hover:rotate-2";
const primaryButtonClassesDisabled = "font-permanent-marker text-xl text-center text-black/50 bg-yellow-400/50 py-3 px-8 rounded-sm cursor-not-allowed";
const secondaryButtonClasses = "font-permanent-marker text-xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-3 px-8 rounded-sm transform transition-all duration-200 hover:scale-[1.02] hover:-rotate-1 hover:bg-white hover:text-black";

export default function ConfigurationSection({
  uploadedImage,
  selectedMagazines,
  selectedDecades,
  selectedCreativeStyles,
  showAdvanced,
  enhanceFaceConsistency,
  promptTemplate,
  useCustomPrompt,
  hasApiKey,
  onMagazinesChange,
  onDecadesChange,
  onStylesChange,
  onShowAdvancedChange,
  onEnhanceFaceConsistencyChange,
  onPromptChange,
  onPromptReset,
  onDifferentPhoto,
  onGenerate,
}: ConfigurationSectionProps) {
  const totalCovers = selectedDecades.length * selectedMagazines.length * selectedCreativeStyles.length;
  const isGenerateDisabled = selectedDecades.length === 0 || selectedMagazines.length === 0 || selectedCreativeStyles.length === 0 || !hasApiKey;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
      {/* 杂志选择 */}
      <div className="w-full">
        <MagazineSelector
          selectedMagazines={selectedMagazines}
          onChange={onMagazinesChange}
        />
      </div>

      {/* 年代选择 */}
      <div className="w-full">
        <DecadeSelector
          selectedDecades={selectedDecades}
          onChange={onDecadesChange}
        />
      </div>

      {/* 高级选项 */}
      <div className="w-full">
        <button
          onClick={() => onShowAdvancedChange(!showAdvanced)}
          className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm font-sans uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>{showAdvanced ? '▼' : '▶'}</span>
          Advanced Options
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
            {/* 人脸相似度开关 */}
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEnhanceFaceConsistencyChange(!enhanceFaceConsistency)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${enhanceFaceConsistency ? 'bg-yellow-500' : 'bg-neutral-600'}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${enhanceFaceConsistency ? 'translate-x-4' : 'translate-x-0'}`}
                  />
                </button>
                <div>
                  <p className="text-white text-sm font-medium">增强人脸相似度</p>
                  <p className="text-neutral-400 text-xs">优先保持面部特征一致</p>
                </div>
              </div>
            </div>

            {/* 创意风格 */}
            <CreativeStyleSelector
              selectedStyles={selectedCreativeStyles}
              onChange={onStylesChange}
            />

            {/* 自定义 Prompt */}
            <div className="border-t border-white/10 pt-4">
              <CustomPromptEditor
                defaultPrompt={promptTemplate}
                onChange={(prompt) => {
                  onPromptChange(prompt);
                }}
                onReset={onPromptReset}
              />
            </div>
          </div>
        )}
      </div>

      {/* 上传的图片预览 */}
      <MagazineCover
        imageUrl={uploadedImage}
        caption="The Original"
        status="done"
        magazineId={selectedMagazines[0] || 'bazaar'}
      />

      {/* 选择摘要 */}
      <div className="text-center text-sm text-neutral-500">
        Generating <span className="text-yellow-400 font-bold">{totalCovers}</span> covers
        <span> across <span className="text-cyan-400 font-bold">{selectedMagazines.length}</span> magazine{selectedMagazines.length > 1 ? 's' : ''}</span>
        {selectedCreativeStyles.length > 0 && !(selectedCreativeStyles.length === 1 && selectedCreativeStyles[0] === 'none') && (
          <span> in <span className="text-purple-400 font-bold">{selectedCreativeStyles.length}</span> style{selectedCreativeStyles.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-4 mt-2">
        <button onClick={onDifferentPhoto} className={secondaryButtonClasses}>
          Different Photo
        </button>
        <button
          onClick={onGenerate}
          disabled={isGenerateDisabled}
          className={isGenerateDisabled ? primaryButtonClassesDisabled : primaryButtonClasses}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
