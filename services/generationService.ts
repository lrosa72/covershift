import { creativeStyles } from '../src/config/creativeStyles';
import { RandomEvent, rollRandomEvent } from '../src/config/randomEvents';
import { buildGenerationPrompt } from './promptBuilder';

export interface GenerationTask {
  key: string;
  decade: string;
  magazineId: string;
  creativeStyle: string;
  randomEvent: RandomEvent | null;
}

export interface GeneratedImageState {
  status: 'pending' | 'done' | 'error';
  url?: string;
  error?: string;
  magazineId?: string;
  creativeStyle?: string;
  randomEvent?: RandomEvent | null;
}

export function createGenerationTasks(
  selectedDecades: string[],
  selectedMagazines: string[],
  selectedCreativeStyles: string[],
  randomEventChance: number = 0.15
): GenerationTask[] {
  const tasks: GenerationTask[] = [];

  selectedDecades.forEach((decade) => {
    selectedMagazines.forEach((magazineId) => {
      selectedCreativeStyles.forEach((creativeStyle) => {
        tasks.push({
          key: `${decade}-${magazineId}-${creativeStyle}`,
          decade,
          magazineId,
          creativeStyle,
          randomEvent: Math.random() < randomEventChance ? rollRandomEvent() : null,
        });
      });
    });
  });

  return tasks;
}

export function createInitialGeneratedImages(tasks: GenerationTask[]): Record<string, GeneratedImageState> {
  const initial: Record<string, GeneratedImageState> = {};
  tasks.forEach((task) => {
    initial[task.key] = {
      status: 'pending',
      magazineId: task.magazineId,
      creativeStyle: task.creativeStyle,
      randomEvent: task.randomEvent,
    };
  });
  return initial;
}

export async function generateTaskImage(
  uploadedImage: string,
  task: GenerationTask,
  options: {
    useCustomPrompt: boolean;
    promptTemplate: string;
    enhanceFaceConsistency: boolean;
  }
): Promise<GeneratedImageState> {
  const { useCustomPrompt, promptTemplate, enhanceFaceConsistency } = options;

  try {
    const { generateDecadeImage } = await import('./imageModelService');
    const prompt = buildGenerationPrompt({
      magazineId: task.magazineId,
      decade: task.decade,
      creativeStyle: useCustomPrompt ? 'none' : task.creativeStyle,
      customPrompt: useCustomPrompt ? promptTemplate : undefined,
      randomEvent: task.randomEvent,
      enhanceFaceConsistency,
    });

    const resultUrl = await generateDecadeImage(uploadedImage, prompt);
    return {
      status: 'done',
      url: resultUrl,
      magazineId: task.magazineId,
      creativeStyle: task.creativeStyle,
      randomEvent: task.randomEvent,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      status: 'error',
      error: errorMessage,
      magazineId: task.magazineId,
      creativeStyle: task.creativeStyle,
      randomEvent: task.randomEvent,
    };
  }
}

export async function runGenerationTasks(
  uploadedImage: string,
  tasks: GenerationTask[],
  options: {
    useCustomPrompt: boolean;
    promptTemplate: string;
    enhanceFaceConsistency: boolean;
    concurrencyLimit?: number;
    onTaskComplete: (task: GenerationTask, result: GeneratedImageState) => void;
  }
): Promise<void> {
  const {
    useCustomPrompt,
    promptTemplate,
    enhanceFaceConsistency,
    concurrencyLimit = 2,
    onTaskComplete,
  } = options;

  const queue = [...tasks];
  const workers = Array(concurrencyLimit).fill(null).map(async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) continue;

      const result = await generateTaskImage(uploadedImage, task, {
        useCustomPrompt,
        promptTemplate,
        enhanceFaceConsistency,
      });

      onTaskComplete(task, result);
    }
  });

  await Promise.all(workers);
}

export function parseGenerationKey(key: string): { decade: string; magazineId: string; creativeStyle: string } {
  const parts = key.split('-');

  let styleIndex = -1;
  for (let index = parts.length - 1; index >= 1; index -= 1) {
    const potentialStyle = parts.slice(index).join('-');
    if (creativeStyles.some((style) => style.id === potentialStyle)) {
      styleIndex = index;
      break;
    }
  }

  if (styleIndex !== -1) {
    return {
      decade: parts[0],
      magazineId: parts.slice(1, styleIndex).join('-') || 'bazaar',
      creativeStyle: parts.slice(styleIndex).join('-'),
    };
  }

  if (parts.length === 1) {
    return { decade: parts[0], magazineId: 'bazaar', creativeStyle: 'none' };
  }

  if (parts.length === 2) {
    return { decade: parts[0], magazineId: parts[1], creativeStyle: 'none' };
  }

  return {
    decade: parts[0],
    magazineId: parts.slice(1, parts.length - 1).join('-') || 'bazaar',
    creativeStyle: parts[parts.length - 1],
  };
}
