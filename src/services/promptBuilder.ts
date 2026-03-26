/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { PersonModel, FacialFeatures } from '../types/personModel';
import type { EraConfig } from '../config/eras';
import type { TransformOption, TransformCategory, ConflictRule } from '../types';

/**
 * 增强的Prompt构建器
 *
 * 结合人物特征模型，构建能保持一致性的Prompt
 */

export interface PromptBuildOptions {
  enhanceSimilarity?: boolean;
  customModifiers?: string[];
  preserveExpression?: boolean;
  styleIntensity?: 'subtle' | 'moderate' | 'strong';
}

// ==================== TransformOption 相关函数 ====================

/**
 * 分类优先级映射
 * 用于排序：era → universe → role → artStyle
 */
const CATEGORY_PRIORITY: Record<TransformCategory, number> = {
  era: 1,
  universe: 2,
  role: 3,
  artStyle: 4,
};

/**
 * 默认冲突规则
 */
const DEFAULT_CONFLICT_RULES: ConflictRule[] = [
  {
    id: 'era-conflict',
    description: '不同年代风格互斥',
    mutuallyExclusiveIds: [],
    message: '不能同时选择多个年代风格',
  },
  {
    id: 'art-style-conflict',
    description: '某些艺术风格互斥',
    mutuallyExclusiveIds: ['realistic', 'cartoon', 'anime'],
    message: '写实、卡通和动漫风格不能同时选择',
  },
];

/**
 * 构建Prompt - 使用 TransformOption 接口
 *
 * 按 category 排序（era → universe → role → artStyle）并依次应用每个 option 的 promptModifier
 *
 * @param basePrompt - 基础Prompt
 * @param options - TransformOption 数组
 * @returns 构建后的Prompt
 */
export function buildPrompt(basePrompt: string, options: TransformOption[]): string {
  // 按 category 优先级排序
  const sortedOptions = [...options].sort((a, b) => {
    return CATEGORY_PRIORITY[a.category] - CATEGORY_PRIORITY[b.category];
  });

  // 依次应用每个 option 的 promptModifier
  return sortedOptions.reduce((currentPrompt, option) => {
    return option.promptModifier(currentPrompt);
  }, basePrompt);
}

/**
 * 检测选项冲突
 *
 * 检测互斥的风格组合，返回冲突描述数组
 *
 * @param options - TransformOption 数组
 * @param customRules - 自定义冲突规则（可选）
 * @returns 冲突描述数组，无冲突时返回空数组
 */
export function detectConflicts(
  options: TransformOption[],
  customRules: ConflictRule[] = []
): string[] {
  const conflicts: string[] = [];
  const rules = [...DEFAULT_CONFLICT_RULES, ...customRules];

  // 1. 检测同类别 era 的多选冲突（通常只能选择一个年代）
  const eraOptions = options.filter((opt) => opt.category === 'era');
  if (eraOptions.length > 1) {
    const eraRule = rules.find((r) => r.id === 'era-conflict');
    if (eraRule) {
      conflicts.push(
        `${eraRule.message}: ${eraOptions.map((e) => e.name).join(', ')}`
      );
    }
  }

  // 2. 检测互斥ID冲突
  const optionIds = new Set(options.map((opt) => opt.id));

  for (const rule of rules) {
    if (rule.mutuallyExclusiveIds.length === 0) continue;

    const conflictingIds = rule.mutuallyExclusiveIds.filter((id) => optionIds.has(id));
    if (conflictingIds.length > 1) {
      const conflictingOptions = options.filter((opt) =>
        conflictingIds.includes(opt.id)
      );
      conflicts.push(
        `${rule.message}: ${conflictingOptions.map((o) => o.name).join(', ')}`
      );
    }
  }

  // 3. 检测年代范围冲突（如果有多个 era 选项）
  if (eraOptions.length >= 2) {
    for (let i = 0; i < eraOptions.length; i++) {
      for (let j = i + 1; j < eraOptions.length; j++) {
        const era1 = eraOptions[i];
        const era2 = eraOptions[j];

        if (era1.eraRange && era2.eraRange) {
          const [start1, end1] = era1.eraRange;
          const [start2, end2] = era2.eraRange;

          // 检查年代范围是否有重叠
          const hasOverlap = start1 <= end2 && start2 <= end1;
          if (!hasOverlap) {
            conflicts.push(
              `年代范围不连续: ${era1.name} (${start1}-${end1}) 与 ${era2.name} (${start2}-${end2})`
            );
          }
        }
      }
    }
  }

  return conflicts;
}

/**
 * 创建 TransformOption 辅助函数
 */
export function createTransformOption(
  id: string,
  name: string,
  description: string,
  category: TransformCategory,
  promptModifier: (basePrompt: string) => string,
  options: {
    previewImage?: string;
    eraRange?: [number, number];
  } = {}
): TransformOption {
  return {
    id,
    name,
    description,
    category,
    promptModifier,
    ...options,
  };
}

/**
 * 构建生成Prompt
 */
export function buildEnhancedPrompt(
  personModel: PersonModel,
  era: EraConfig,
  options: PromptBuildOptions = {}
): { prompt: string; negativePrompt: string } {
  const { features } = personModel;
  const { styleIntensity = 'moderate' } = options;

  // 构建身份保持部分
  const identityPrompt = buildIdentityPrompt(features);

  // 构建时代风格部分
  const eraPrompt = buildEraPrompt(era, styleIntensity);

  // 构建质量增强部分
  const qualityPrompt = buildQualityPrompt();

  // 组合完整Prompt
  const prompt = `${identityPrompt}, ${eraPrompt}, ${qualityPrompt}`;

  // 构建负面Prompt
  const negativePrompt = buildNegativePrompt();

  return { prompt, negativePrompt };
}

/**
 * 构建身份保持Prompt
 */
function buildIdentityPrompt(features: FacialFeatures): string {
  const { description, attributes } = features;

  const parts: string[] = [
    // 核心身份保持指令
    'Create a high-quality magazine cover photograph',
    'of the exact same person from the reference',

    // 面部特征描述
    `with ${description.faceShape} face shape`,
    `${description.eyeShape} eyes`,
    `${description.noseType} nose`,
    `${description.lipShape} lips`,
    `and ${description.eyebrowType} eyebrows`,

    // 年龄和性别
    attributes.age > 0 ? `approximately ${Math.round(attributes.age)} years old` : '',
    attributes.gender !== 'unknown' ? attributes.gender : '',

    // 身份保持强调
    'Preserve facial identity, bone structure, and unique features perfectly',
    'Maintain exact same eye color, skin tone, and facial proportions',
    'Keep the same facial structure and distinctive characteristics',
  ];

  // 添加 distinctive 特征
  if (description.distinctiveFeatures.length > 0) {
    parts.push(`Notable features: ${description.distinctiveFeatures.join(', ')}`);
  }

  return parts.filter(Boolean).join(', ');
}

/**
 * 构建时代风格Prompt
 */
function buildEraPrompt(era: EraConfig, intensity: string): string {
  const intensityModifiers: Record<string, string> = {
    subtle: 'subtly styled in',
    moderate: 'authentically dressed in',
    strong: 'dramatically transformed into',
  };

  const parts: string[] = [
    // 时代背景
    `${intensityModifiers[intensity]} the ${era.decade} style`,
    era.eraName ? `(${era.eraName})` : '',

    // 时尚元素（限制数量避免过度描述）
    ...era.fashionKeywords.slice(0, 4),

    // 发型
    ...era.hairstyleKeywords.slice(0, 2),

    // 妆容
    ...era.makeupKeywords.slice(0, 2),

    // 光线和氛围
    era.lightingStyle,
    era.mood,

    // 杂志封面元素
    'professional magazine cover composition',
    'high fashion editorial style',
    era.coverElements?.headlines?.[0] || '',
  ];

  return parts.filter(Boolean).join(', ');
}

/**
 * 构建质量增强Prompt
 */
function buildQualityPrompt(): string {
  return [
    '8k resolution',
    'professional photography',
    'studio lighting',
    'sharp focus',
    'highly detailed',
    'photorealistic',
    'masterpiece',
    'best quality',
    'magazine quality',
    'editorial photography',
  ].join(', ');
}

/**
 * 构建负面Prompt
 */
function buildNegativePrompt(): string {
  return [
    // 身份变化
    'different person',
    'changed face',
    'different identity',
    'altered facial features',
    'different bone structure',

    // 质量问题
    'distorted face',
    'blurry',
    'low quality',
    'worst quality',
    'bad anatomy',
    'disfigured',
    'poorly drawn face',

    // 身体问题
    'extra limbs',
    'deformed',
    'mutation',
    'mutated',
    'extra fingers',
    'fused fingers',
    'too many fingers',
    'long neck',
    'cross-eyed',
    'mutated hands',

    // 其他
    'polar lowres',
    'bad face',
    'duplicate',
    'morbid',
    'mutilated',
    'out of frame',
    'extra fingers',
    'mutated hands',
    'poorly drawn hands',
    'poorly drawn face',
    'mutation',
    'deformed',
    'ugly',
    'blurry',
    'bad anatomy',
    'bad proportions',
    'extra limbs',
    'cloned face',
    'disfigured',
    'gross proportions',
    'malformed limbs',
    'missing arms',
    'missing legs',
    'extra arms',
    'extra legs',
    'fused fingers',
    'too many fingers',
    'long neck',
    'Photoshop',
    'video game',
    'ugly',
    'duplicate',
    'morbid',
    'mutilated',
    'out of frame',
    'extra fingers',
    'mutated hands',
    'poorly drawn hands',
    'poorly drawn face',
    'mutation',
    'deformed',
    'blurry',
    'bad anatomy',
    'bad proportions',
    'extra limbs',
    'cloned face',
    'disfigured',
    'gross proportions',
    'malformed limbs',
    'missing arms',
    'missing legs',
    'extra arms',
    'extra legs',
    'fused fingers',
    'too many fingers',
    'long neck',
    'cross-eyed',
    'mutated hands',
    'polar lowres',
    'bad face',
  ].join(', ');
}

/**
 * 构建特征锁定参数
 *
 * 用于API调用时保持身份一致性
 */
export function buildIdentityLockParams(
  personModel: PersonModel
): {
  referenceImage: string;
  faceEmbedding: number[];
  identityStrength: number;
  faceLandmarks: number[][];
} {
  // 选择最佳质量的图片作为参考
  const bestImage = personModel.sourceImages.sort(
    (a, b) => b.quality.overall - a.quality.overall
  )[0];

  // 转换关键点格式
  const landmarks = personModel.features.landmarks;
  const flatLandmarks = [
    ...landmarks.jawline,
    ...landmarks.leftEyebrow,
    ...landmarks.rightEyebrow,
    ...landmarks.noseBridge,
    ...landmarks.noseTip,
    ...landmarks.leftEye,
    ...landmarks.rightEye,
    ...landmarks.outerLip,
    ...landmarks.innerLip,
  ].map((p) => [p.x, p.y]);

  return {
    referenceImage: bestImage.dataUrl,
    faceEmbedding: personModel.features.embedding,
    identityStrength: 0.85, // 身份保持强度 (0-1)
    faceLandmarks: flatLandmarks,
  };
}

/**
 * 构建ControlNet参数
 *
 * 用于更精确的姿态和面部控制
 */
export function buildControlNetParams(
  personModel: PersonModel
): {
  poseImage: string;
  depthImage?: string;
  cannyImage?: string;
} {
  // 选择正面照作为姿态参考
  const frontImage =
    personModel.sourceImages.find(
      (img) => img.category === 'front' || img.category === 'front-smile'
    ) || personModel.sourceImages[0];

  return {
    poseImage: frontImage.dataUrl,
    // 深度图和边缘图可以在前端生成
  };
}

/**
 * 构建LoRA触发词
 *
 * 如果使用LoRA模型训练
 */
export function buildLoRATriggerWords(personModel: PersonModel): string {
  const modelId = personModel.id.replace(/[^a-zA-Z0-9]/g, '_');
  return `person_${modelId}`;
}

/**
 * 验证Prompt质量
 */
export function validatePrompt(prompt: string): {
  valid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // 检查长度
  if (prompt.length < 50) {
    issues.push('Prompt太短，可能无法生成高质量图像');
  }
  if (prompt.length > 1000) {
    suggestions.push('Prompt较长，建议精简以提高生成效率');
  }

  // 检查关键元素
  const requiredElements = ['person', 'face', 'photograph', 'magazine'];
  const missingElements = requiredElements.filter(
    (el) => !prompt.toLowerCase().includes(el)
  );
  if (missingElements.length > 0) {
    suggestions.push(`建议添加关键词: ${missingElements.join(', ')}`);
  }

  // 检查重复
  const words = prompt.toLowerCase().split(/[\s,]+/);
  const duplicates = words.filter((item, index) => words.indexOf(item) !== index);
  if (duplicates.length > 0) {
    suggestions.push(`发现重复词汇，建议删除: ${[...new Set(duplicates)].join(', ')}`);
  }

  return {
    valid: issues.length === 0,
    issues,
    suggestions,
  };
}
