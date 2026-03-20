/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateDecadeImage, isGeminiConfigured, updateApiKey } from './services/geminiService';
import ApiKeyModal, { getStoredApiKey } from './components/ApiKeyModal';
import MagazineCover from './components/MagazineCover';
import { createAlbumPage } from './lib/albumUtils';
import Footer from './components/Footer';
import DecadeSelector from './components/DecadeSelector';
import ViewToggle from './components/ViewToggle';
import CustomPromptEditor from './components/CustomPromptEditor';
import HistoryPanel from './components/HistoryPanel';
import MagazineSelector from './components/MagazineSelector';
import CreativeStyleSelector from './components/CreativeStyleSelector';
import { saveToHistory, HistoryItem } from './lib/historyUtils';
import { DEFAULT_DECADES } from './src/config/eras';
import { creativeStyles } from './src/config/creativeStyles';
import JSZip from 'jszip';

type ImageStatus = 'pending' | 'done' | 'error';
interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
    magazineId?: string;
    creativeStyle?: string;
}

type ViewMode = 'scattered' | 'gallery';

// Build dynamic prompt based on selections (Enhanced for face consistency)
const buildPrompt = (
    magazineId: string,
    decade: string,
    creativeStyle: string,
    customPrompt?: string
): string => {
    // Get style-specific prompt additions
    const styleConfig = creativeStyles.find(s => s.id === creativeStyle);
    
    // Get magazine name
    const magazineNames: Record<string, string> = {
        'bazaar': "Harper's Bazaar",
        'vogue': 'Vogue',
        'elle': 'Elle',
        'gq': 'GQ',
        'vanity-fair': 'Vanity Fair',
        'lofficiel': "L'Officiel",
        'interview': 'Interview',
        'id-magazine': 'i-D',
        'w-magazine': 'W Magazine'
    };
    const magazineName = magazineNames[magazineId] || "Harper's Bazaar";
    
    // Build creative style addition
    let styleAddition = '';
    if (styleConfig && styleConfig.id !== 'none') {
        styleAddition = `
        ${styleConfig.descriptionCn}风格: ${styleConfig.promptAddon.visual}.
        光线风格: ${styleConfig.promptAddon.lighting}.
        色调: ${styleConfig.promptAddon.colorGrade}.
        氛围: ${styleConfig.promptAddon.mood}.`;
    }
    
    // Use custom prompt if provided
    if (customPrompt && customPrompt.trim()) {
        return customPrompt
            .replace(/\{decade\}/g, decade)
            .replace(/\{magazine\}/g, magazineName)
            + styleAddition;
    }
    
    // Default enhanced prompt with STRONG face consistency
    return `Transform the person in this photo into a ${decade} high-fashion editorial portrait for ${magazineName} magazine cover.${styleAddition}
  
=== CRITICAL IDENTITY PRESERVATION ===
This is the MOST IMPORTANT requirement. Study the source photo carefully and maintain EXACT facial identity:

1. **FACE IDENTITY**: The output MUST show the EXACT SAME PERSON from the source photo. Every facial feature must be identical - eye shape, nose bridge, lip shape, chin, cheekbones, brow line, overall face structure, skin tone.

2. **RECOGNIZABLE**: The person in the generated image must be immediately recognizable as the same individual in your source photo. The face must be IDENTICAL.

3. **ONLY TRANSFORM**: Change ONLY these elements:
   - Clothing and fashion (to match ${decade} ${magazineName} style)
   - Hairstyle and hair color (${decade} aesthetic)
   - Makeup and styling
   - Lighting (professional studio lighting)
   - Background and setting
   - Magazine typography and layout

4. **DO NOT CHANGE**: 
   - Face shape and bone structure
   - Eye color, shape, and size
   - Nose shape and size
   - Lip shape and fullness
   - Chin shape
   - Overall facial proportions
   - Skin tone and texture
   - Any unique identifying features

5. **QUALITY**: The output must be photorealistic, high-resolution, magazine-quality editorial photography.

Use the source photo as your ONLY reference for the person's identity. This is a fashion transformation, NOT a different person.`;
};

// Pre-defined positions for a scattered look on desktop
const POSITIONS = [
    { top: '2%', left: '5%', rotate: -5 },
    { top: '5%', left: '35%', rotate: 2 },
    { top: '2%', left: '65%', rotate: -3 },
    { top: '35%', left: '2%', rotate: 4 },
    { top: '32%', left: '33%', rotate: -2 },
    { top: '35%', left: '68%', rotate: 6 },
    { top: '65%', left: '5%', rotate: -4 },
    { top: '68%', left: '35%', rotate: 3 },
    { top: '65%', left: '65%', rotate: -2 },
];

const GHOST_POLAROIDS_CONFIG = [
  { initial: { x: "-150%", y: "-100%", rotate: -30 }, transition: { delay: 0.2 } },
  { initial: { x: "150%", y: "-80%", rotate: 25 }, transition: { delay: 0.4 } },
  { initial: { x: "-120%", y: "120%", rotate: 45 }, transition: { delay: 0.6 } },
  { initial: { x: "180%", y: "90%", rotate: -20 }, transition: { delay: 0.8 } },
  { initial: { x: "0%", y: "-200%", rotate: 0 }, transition: { delay: 0.5 } },
  { initial: { x: "100%", y: "150%", rotate: 10 }, transition: { delay: 0.3 } },
];

// Helper to parse key format: decade-magazine-style
function parseKey(key: string): { decade: string; magazineId: string; creativeStyle: string } {
    const parts = key.split('-');

    // Try to find style part first
    let styleIndex = -1;
    for (let i = parts.length - 1; i >= 1; i--) {
        const potentialStyle = parts.slice(i).join('-');
        if (creativeStyles.some(s => s.id === potentialStyle)) {
            styleIndex = i;
            break;
        }
    }

    if (styleIndex !== -1) {
        return {
            decade: parts[0],
            magazineId: parts.slice(1, styleIndex).join('-') || 'bazaar',
            creativeStyle: parts.slice(styleIndex).join('-')
        };
    }

    // Fallback for old formats
    if (parts.length === 1) {
        return { decade: parts[0], magazineId: 'bazaar', creativeStyle: 'none' };
    } else if (parts.length === 2) {
        return { decade: parts[0], magazineId: parts[1], creativeStyle: 'none' };
    }

    // Last resort: assume last part is style
    return {
        decade: parts[0],
        magazineId: parts.slice(1, parts.length - 1).join('-') || 'bazaar',
        creativeStyle: parts[parts.length - 1]
    };
}

// Build caption for display
function buildCaption(decade: string, magazineId: string, creativeStyle: string): string {
    const style = creativeStyles.find(s => s.id === creativeStyle);
    const styleName = style && style.id !== 'none' ? ` · ${style.nameCn}` : '';
    return `${decade}${styleName}`;
}

const primaryButtonClasses = "font-permanent-marker text-xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[2px_2px_0px_2px_rgba(0,0,0,0.2)]";
const primaryButtonClassesDisabled = "font-permanent-marker text-xl text-center text-black/50 bg-yellow-400/50 py-3 px-8 rounded-sm cursor-not-allowed";
const secondaryButtonClasses = "font-permanent-marker text-xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black";

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);
    return matches;
};

function App() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');
    const [hasApiKey, setHasApiKey] = useState<boolean>(isGeminiConfigured());
    const [selectedDecades, setSelectedDecades] = useState<string[]>([...DEFAULT_DECADES]);
    const [selectedMagazines, setSelectedMagazines] = useState<string[]>(['bazaar']);
    const [selectedCreativeStyles, setSelectedCreativeStyles] = useState<string[]>(['none']);
    const [viewMode, setViewMode] = useState<ViewMode>('scattered');
    const [promptTemplate, setPromptTemplate] = useState<string>('');
    const [useCustomPrompt, setUseCustomPrompt] = useState<boolean>(false);
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [enhanceFaceConsistency, setEnhanceFaceConsistency] = useState<boolean>(true);
    const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
    const [currentApiKey, setCurrentApiKey] = useState<string>(getStoredApiKey());
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Check API key status on mount and show modal if needed
    useEffect(() => {
        const storedKey = getStoredApiKey();
        const envKey = (process.env.GEMINI_API_KEY || process.env.API_KEY);
        if (storedKey || envKey) {
            setHasApiKey(true);
        } else {
            // First time user - show modal after a short delay
            setTimeout(() => setShowApiKeyModal(true), 500);
        }
    }, []);

    const handleApiKeySave = (key: string) => {
        updateApiKey(key);
        setCurrentApiKey(key);
        setHasApiKey(!!key);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setAppState('image-uploaded');
                setGeneratedImages({});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateClick = async () => {
        if (!uploadedImage || selectedDecades.length === 0) return;

        setIsLoading(true);
        setAppState('generating');

        // Create generation tasks for each combination: decade × magazine × style
        const tasks: Array<{ key: string; decade: string; magazineId: string; creativeStyle: string }> = [];

        selectedDecades.forEach(decade => {
            selectedMagazines.forEach(magazineId => {
                selectedCreativeStyles.forEach(creativeStyle => {
                    const key = `${decade}-${magazineId}-${creativeStyle}`;
                    tasks.push({ key, decade, magazineId, creativeStyle });
                });
            });
        });

        const initialImages: Record<string, GeneratedImage> = {};
        tasks.forEach(task => {
            initialImages[task.key] = {
                status: 'pending',
                magazineId: task.magazineId,
                creativeStyle: task.creativeStyle
            };
        });
        setGeneratedImages(initialImages);

        const concurrencyLimit = 2;
        const tasksQueue = [...tasks];

        const processTask = async (task: { key: string; decade: string; magazineId: string; creativeStyle: string }) => {
            try {
                const prompt = buildPrompt(
                    task.magazineId,
                    task.decade,
                    useCustomPrompt ? 'none' : task.creativeStyle,
                    useCustomPrompt ? promptTemplate : undefined
                );
                const resultUrl = await generateDecadeImage(uploadedImage, prompt);
                setGeneratedImages(prev => ({
                    ...prev,
                    [task.key]: {
                        status: 'done',
                        url: resultUrl,
                        magazineId: task.magazineId,
                        creativeStyle: task.creativeStyle
                    },
                }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                setGeneratedImages(prev => ({
                    ...prev,
                    [task.key]: { status: 'error', error: errorMessage },
                }));
                console.error(`Failed to generate image for ${task.key}:`, err);
            }
        };

        const workers = Array(concurrencyLimit).fill(null).map(async () => {
            while (tasksQueue.length > 0) {
                const task = tasksQueue.shift();
                if (task) {
                    await processTask(task);
                }
            }
        });

        await Promise.all(workers);

        setIsLoading(false);
        setAppState('results-shown');
    };

    const handleRegenerateDecade = async (key: string) => {
        if (!uploadedImage) return;

        const image = generatedImages[key];
        if (image?.status === 'pending') return;

        console.log(`Regenerating image for ${key}...`);

        setGeneratedImages(prev => ({
            ...prev,
            [key]: { ...prev[key], status: 'pending' },
        }));

        try {
            // Parse the key (format: decade-magazine-style)
            const parts = key.split('-');
            let decade = parts[0];
            let magazineId = selectedMagazines[0];
            let creativeStyle = selectedCreativeStyles[0];

            if (parts.length >= 3) {
                // New format: decade-magazine-style (magazine could have hyphens)
                // Find where style starts
                const styleIndex = parts.findIndex((_, i) => {
                    if (i < 1) return false;
                    const potentialStyle = parts.slice(i).join('-');
                    return creativeStyles.some(s => s.id === potentialStyle);
                });

                if (styleIndex !== -1) {
                    magazineId = parts.slice(1, styleIndex).join('-');
                    creativeStyle = parts.slice(styleIndex).join('-');
                } else {
                    // Fallback: assume last part is style
                    creativeStyle = parts[parts.length - 1];
                    magazineId = parts.slice(1, parts.length - 1).join('-');
                }
            } else if (parts.length === 2) {
                // Old format: decade-magazine
                magazineId = parts[1];
            }
            // Use stored values if available
            if (image?.magazineId) magazineId = image.magazineId;
            if (image?.creativeStyle) creativeStyle = image.creativeStyle;

            const prompt = buildPrompt(
                magazineId,
                decade,
                useCustomPrompt ? 'none' : creativeStyle,
                useCustomPrompt ? promptTemplate : undefined
            );
            const resultUrl = await generateDecadeImage(uploadedImage, prompt);
            setGeneratedImages(prev => ({
                ...prev,
                [key]: {
                    status: 'done',
                    url: resultUrl,
                    magazineId,
                    creativeStyle
                },
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setGeneratedImages(prev => ({
                ...prev,
                [key]: { ...prev[key], status: 'error', error: errorMessage },
            }));
            console.error(`Failed to regenerate image for ${key}:`, err);
        }
    };

    const handleReset = () => {
        setUploadedImage(null);
        setGeneratedImages({});
        setAppState('idle');
        setSelectedDecades([...DEFAULT_DECADES]);
        setSelectedMagazines(['bazaar']);
        setSelectedCreativeStyles(['none']);
        setPromptTemplate('');
        setUseCustomPrompt(false);
    };

    const handleDownloadIndividualImage = (key: string) => {
        const image = generatedImages[key];
        if (image?.status === 'done' && image.url) {
            const link = document.createElement('a');
            link.href = image.url;
            link.download = `bazaar-${key}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDownloadAll = async () => {
        setIsDownloading(true);
        try {
            const zip = new JSZip();
            let hasImages = false;

            (Object.entries(generatedImages) as [string, GeneratedImage][]).forEach(([key, image]) => {
                if (image.status === 'done' && image.url) {
                    const base64Data = image.url.split(',')[1];
                    zip.file(`bazaar-${key}.jpg`, base64Data, { base64: true });
                    hasImages = true;
                }
            });

            if (!hasImages) {
                alert("No images available to download yet.");
                return;
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'bazaar-collection.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Failed to create ZIP:", error);
            alert("Sorry, there was an error creating your download. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadAlbum = async () => {
        setIsDownloading(true);
        try {
            const imageData: Record<string, string> = {};
            (Object.entries(generatedImages) as [string, GeneratedImage][])
                .filter(([, image]) => image.status === 'done' && image.url)
                .forEach(([key, image]) => {
                    imageData[key] = image.url!;
                });

            const keys = Object.keys(imageData);
            if (keys.length === 0) {
                alert("No images available to create an album yet.");
                return;
            }

            const albumDataUrl = await createAlbumPage(imageData);

            const link = document.createElement('a');
            link.href = albumDataUrl;
            link.download = 'bazaar-collection-album.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Failed to create or download album:", error);
            alert("Sorry, there was an error creating your album. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSaveToHistory = () => {
        if (!uploadedImage) return;

        const doneImages: Record<string, string> = {};
        (Object.entries(generatedImages) as [string, GeneratedImage][]).forEach(([key, image]) => {
            if (image.status === 'done' && image.url) {
                doneImages[key] = image.url;
            }
        });

        if (Object.keys(doneImages).length === 0) {
            alert("No completed images to save.");
            return;
        }

        saveToHistory({
            originalImage: uploadedImage,
            generatedImages: doneImages,
            selectedDecades: [...selectedDecades]
        });

        alert("Saved to history!");
    };

    const handleLoadHistory = (item: HistoryItem) => {
        setUploadedImage(item.originalImage);
        const newGeneratedImages: Record<string, GeneratedImage> = {};
        Object.entries(item.generatedImages).forEach(([key, url]) => {
            const parsed = parseKey(key);
            newGeneratedImages[key] = {
                status: 'done',
                url,
                magazineId: parsed.magazineId,
                creativeStyle: parsed.creativeStyle
            };
        });
        setGeneratedImages(newGeneratedImages);
        // Try to parse decades from history keys
        const decades = [...new Set(
            Object.keys(item.generatedImages)
                .map(k => k.includes('-') ? k.split('-')[0] : k)
        )];
        setSelectedDecades(decades.length > 0 ? decades : DEFAULT_DECADES);
        setAppState('results-shown');
    };

    const handleResetPrompt = () => {
        setPromptTemplate('');
        setUseCustomPrompt(false);
    };

    // Get keys to display (sorted)
    const displayKeys = Object.keys(generatedImages).sort((a, b) => {
        const orderA = DEFAULT_DECADES.indexOf(a.split('-')[0]);
        const orderB = DEFAULT_DECADES.indexOf(b.split('-')[0]);
        return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
    });

    return (
        <main className="bg-black text-neutral-200 min-h-screen w-full flex flex-col items-center justify-center p-4 pb-24 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05]"></div>

            <HistoryPanel onLoadHistory={handleLoadHistory} />

            {/* API Key Settings Button */}
            <button
                onClick={() => setShowApiKeyModal(true)}
                className="absolute top-4 left-4 z-20 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white/70 hover:text-white transition-all"
                title="API Key 设置"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            {/* API Key Status Badge */}
            {!hasApiKey && (
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={() => setShowApiKeyModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-full text-yellow-400 text-xs font-medium transition-all animate-pulse"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        配置 API Key
                    </button>
                </div>
            )}

            <div className="z-10 flex flex-col items-center justify-center w-full h-full flex-1 min-h-0">
                <div className="text-center mb-6">
                    <h1 className="text-5xl md:text-7xl font-playfair font-black text-neutral-100 uppercase tracking-tighter">CoverShift</h1>
                    <p className="font-playfair italic text-neutral-300 mt-1 text-lg tracking-wide">重新定义你，做人生的封面</p>
                </div>

                {appState === 'idle' && (
                     <div className="relative flex flex-col items-center justify-center w-full">
                        {/* Ghost polaroids for intro animation */}
                        {GHOST_POLAROIDS_CONFIG.map((config, index) => (
                             <motion.div
                                key={index}
                                className="absolute w-80 h-[26rem] rounded-md p-4 bg-neutral-100/10 blur-sm"
                                initial={config.initial}
                                animate={{
                                    x: "0%", y: "0%", rotate: (Math.random() - 0.5) * 20,
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
                                     magazineId={selectedMagazines[0]}
                                 />
                            </label>
                            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                            <p className="mt-6 font-playfair italic text-neutral-500 text-center max-w-xs text-base">
                                Click the cover to upload your portrait and start your high-fashion journey.
                            </p>
                        </motion.div>
                    </div>
                )}

                {appState === 'image-uploaded' && uploadedImage && (
                    <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
                         <div className="w-full">
                             <MagazineSelector
                                 selectedMagazines={selectedMagazines}
                                 onChange={setSelectedMagazines}
                             />
                         </div>
                         <div className="w-full">
                             <DecadeSelector
                                 selectedDecades={selectedDecades}
                                 onChange={setSelectedDecades}
                             />
                         </div>
                         
                         {/* Advanced options toggle */}
                         <div className="w-full">
                             <button
                                 onClick={() => setShowAdvanced(!showAdvanced)}
                                 className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm font-sans uppercase tracking-wider flex items-center justify-center gap-2"
                             >
                                 <span>{showAdvanced ? '▼' : '▶'}</span>
                                 Advanced Options
                             </button>
                             
                            {showAdvanced && (
                                <div className="mt-4 space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                                    {/* Face Consistency Toggle */}
                                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${enhanceFaceConsistency ? 'bg-yellow-500' : 'bg-neutral-600'}`}>
                                                <button
                                                    onClick={() => setEnhanceFaceConsistency(!enhanceFaceConsistency)}
                                                    className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${enhanceFaceConsistency ? 'translate-x-4' : 'translate-x-0'}`}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">增强人脸相似度</p>
                                                <p className="text-neutral-400 text-xs">优先保持面部特征一致</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Creative Style */}
                                    <CreativeStyleSelector
                                        selectedStyles={selectedCreativeStyles}
                                        onChange={setSelectedCreativeStyles}
                                    />
                                    
                                    <div className="border-t border-white/10 pt-4">
                                        {/* Custom Prompt */}
                                        <CustomPromptEditor
                                            defaultPrompt=""
                                            onChange={(prompt) => {
                                                setPromptTemplate(prompt);
                                                setUseCustomPrompt(true);
                                            }}
                                            onReset={handleResetPrompt}
                                        />
                                    </div>
                                </div>
                            )}
                         </div>
                         
                         <MagazineCover
                            imageUrl={uploadedImage}
                            caption="The Original"
                            status="done"
                            magazineId={selectedMagazines[0]}
                         />
                         
                         {/* Selection summary */}
                         <div className="text-center text-sm text-neutral-500">
                             Generating <span className="text-yellow-400 font-bold">{selectedDecades.length * selectedMagazines.length * selectedCreativeStyles.length}</span> covers
                             <span> across <span className="text-cyan-400 font-bold">{selectedMagazines.length}</span> magazine{selectedMagazines.length > 1 ? 's' : ''}</span>
                             {selectedCreativeStyles.length > 0 && !(selectedCreativeStyles.length === 1 && selectedCreativeStyles[0] === 'none') && (
                                 <span> in <span className="text-purple-400 font-bold">{selectedCreativeStyles.length}</span> style{selectedCreativeStyles.length > 1 ? 's' : ''}</span>
                             )}
                         </div>
                         
                         <div className="flex items-center gap-4 mt-2">
                            <button onClick={handleReset} className={secondaryButtonClasses}>
                                Different Photo
                            </button>
                            <button
                                onClick={handleGenerateClick}
                                disabled={selectedDecades.length === 0 || !hasApiKey}
                                className={selectedDecades.length === 0 || !hasApiKey ? primaryButtonClassesDisabled : primaryButtonClasses}
                            >
                                Generate
                            </button>
                         </div>
                    </div>
                )}

                {(appState === 'generating' || appState === 'results-shown') && (
                     <>
                        {/* View Toggle for desktop */}
                        {!isMobile && appState === 'results-shown' && (
                            <div className="mb-4 flex items-center gap-4">
                                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                                <button
                                    onClick={handleSaveToHistory}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-sans uppercase tracking-wider rounded-lg transition-all"
                                >
                                    Save to History
                                </button>
                            </div>
                        )}

                        {/* Progress indicator when generating */}
                        {appState === 'generating' && (
                            <div className="mb-4 text-center">
                                <p className="text-neutral-400 text-sm font-sans uppercase tracking-wider">
                                    Generating {displayKeys.length} covers...
                                </p>
                                <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                                    {displayKeys.map((key) => {
                                        const status = generatedImages[key]?.status;
                                        return (
                                            <div
                                                key={key}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    status === 'done' ? 'bg-green-400' :
                                                    status === 'error' ? 'bg-red-400' :
                                                    'bg-yellow-400 animate-pulse'
                                                }`}
                                                title={`${key}: ${status}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {isMobile ? (
                            <div className="w-full max-w-sm flex-1 overflow-y-auto mt-2 space-y-6 p-4">
                                {displayKeys.map((key) => {
                                    const parsed = parseKey(key);
                                    const magazineId = generatedImages[key]?.magazineId || parsed.magazineId;
                                    return (
                                        <div key={key} className="flex justify-center">
                                             <MagazineCover
                                                caption={buildCaption(parsed.decade, magazineId, parsed.creativeStyle)}
                                                status={generatedImages[key]?.status || 'pending'}
                                                imageUrl={generatedImages[key]?.url}
                                                error={generatedImages[key]?.error}
                                                onShake={() => handleRegenerateDecade(key)}
                                                onDownload={() => handleDownloadIndividualImage(key)}
                                                isMobile={isMobile}
                                                magazineId={magazineId}
                                                creativeStyle={generatedImages[key]?.creativeStyle}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : viewMode === 'gallery' ? (
                            <div className="w-full max-w-6xl flex-1 overflow-y-auto mt-2 p-4">
                                <div className="grid grid-cols-3 gap-6 justify-items-center">
                                    {displayKeys.map((key, index) => {
                                        const parsed = parseKey(key);
                                        const magazineId = generatedImages[key]?.magazineId || parsed.magazineId;
                                        return (
                                            <motion.div
                                                key={key}
                                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <MagazineCover
                                                    caption={buildCaption(parsed.decade, magazineId, parsed.creativeStyle)}
                                                    status={generatedImages[key]?.status || 'pending'}
                                                    imageUrl={generatedImages[key]?.url}
                                                    error={generatedImages[key]?.error}
                                                    onShake={() => handleRegenerateDecade(key)}
                                                    onDownload={() => handleDownloadIndividualImage(key)}
                                                    isMobile={isMobile}
                                                    magazineId={magazineId}
                                                    creativeStyle={generatedImages[key]?.creativeStyle}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div ref={dragAreaRef} className="relative w-full max-w-5xl h-[600px] mt-2">
                                {displayKeys.map((key, index) => {
                                    const parsed = parseKey(key);
                                    const magazineId = generatedImages[key]?.magazineId || parsed.magazineId;
                                    const originalIndex = DEFAULT_DECADES.indexOf(parsed.decade);
                                    const { top, left, rotate } = POSITIONS[originalIndex === -1 ? index % POSITIONS.length : originalIndex];
                                    return (
                                        <motion.div
                                            key={key}
                                            className="absolute cursor-grab active:cursor-grabbing"
                                            style={{ top, left }}
                                            initial={{ opacity: 0, scale: 0.5, y: 100, rotate: 0 }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                                rotate: `${rotate}deg`,
                                            }}
                                            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.15 }}
                                        >
                                            <MagazineCover
                                                caption={buildCaption(parsed.decade, magazineId, parsed.creativeStyle)}
                                                status={generatedImages[key]?.status || 'pending'}
                                                imageUrl={generatedImages[key]?.url}
                                                error={generatedImages[key]?.error}
                                                onShake={() => handleRegenerateDecade(key)}
                                                onDownload={() => handleDownloadIndividualImage(key)}
                                                isMobile={isMobile}
                                                magazineId={magazineId}
                                                creativeStyle={generatedImages[key]?.creativeStyle}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                         <div className="h-20 mt-2 flex items-center justify-center">
                            {appState === 'results-shown' && (
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <button
                                        onClick={handleDownloadAll}
                                        disabled={isDownloading}
                                        className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isDownloading ? 'Processing...' : 'Download All (ZIP)'}
                                    </button>
                                    <button
                                        onClick={handleDownloadAlbum}
                                        disabled={isDownloading}
                                        className={`${secondaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed !text-black !bg-white hover:!bg-neutral-200`}
                                    >
                                        {isDownloading ? 'Creating...' : 'Download Album'}
                                    </button>
                                    <button onClick={handleReset} className={secondaryButtonClasses}>
                                        Start Over
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer />

            {/* API Key Modal */}
            <ApiKeyModal
                isOpen={showApiKeyModal}
                onClose={() => setShowApiKeyModal(false)}
                onSave={handleApiKeySave}
                currentApiKey={currentApiKey}
            />
        </main>
    );
}

export default App;
