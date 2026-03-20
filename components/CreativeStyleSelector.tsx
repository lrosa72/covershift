import React from 'react';
import { creativeStyles, CreativeStyleConfig } from '../src/config/creativeStyles';
import { cn } from '../lib/utils';

interface CreativeStyleSelectorProps {
    selectedStyles: string[];
    onChange: (styleIds: string[]) => void;
    maxSelection?: number;
}

const CreativeStyleSelector: React.FC<CreativeStyleSelectorProps> = ({
    selectedStyles,
    onChange,
    maxSelection = 20
}) => {
    const toggleStyle = (styleId: string) => {
        if (selectedStyles.includes(styleId)) {
            onChange(selectedStyles.filter(id => id !== styleId));
        } else if (selectedStyles.length < maxSelection) {
            onChange([...selectedStyles, styleId]);
        }
    };

    const selectNone = () => {
        onChange([]);
    };

    const selectDefault = () => {
        onChange(['none']);
    };

    const selectAll = () => {
        const allIds = creativeStyles.filter(s => s.id !== 'none').map(s => s.id);
        onChange(allIds.slice(0, maxSelection));
    };

    // Group styles by category
    const categories = [
        {
            name: 'Basic',
            styles: creativeStyles.filter(s => s.id === 'none')
        },
        {
            name: 'Retro & Vintage',
            styles: creativeStyles.filter(s =>
                ['vintage-retro', 'art-deco', 'film-noir'].includes(s.id)
            )
        },
        {
            name: 'Futuristic',
            styles: creativeStyles.filter(s =>
                ['cyberpunk', 'vaporwave', 'solarpunk', 'atompunk', 'dieselpunk', 'biopunk'].includes(s.id)
            )
        },
        {
            name: 'Artistic',
            styles: creativeStyles.filter(s =>
                ['neoclassical', 'renaissance', 'oil-painting', 'japanese-ink', 'glitch-art'].includes(s.id)
            )
        },
        {
            name: 'Modern',
            styles: creativeStyles.filter(s =>
                ['minimalism', 'streetwear', 'comic-book', 'pixel-art'].includes(s.id)
            )
        }
    ];

    return (
        <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-white text-lg">Creative Styles</h3>
                <div className="flex gap-2">
                    <button
                        onClick={selectDefault}
                        className="text-xs font-sans text-neutral-400 hover:text-white transition-colors"
                    >
                        Default
                    </button>
                    <span className="text-neutral-600">|</span>
                    <button
                        onClick={selectNone}
                        className="text-xs font-sans text-neutral-400 hover:text-white transition-colors"
                    >
                        Clear
                    </button>
                    <span className="text-neutral-600">|</span>
                    <button
                        onClick={selectAll}
                        className="text-xs font-sans text-neutral-400 hover:text-white transition-colors"
                        disabled={selectedStyles.length >= maxSelection}
                    >
                        Select All ({maxSelection})
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {categories.map((category) => (
                    <div key={category.name}>
                        <div className="text-xs font-sans text-neutral-500 uppercase tracking-wider mb-2">
                            {category.name}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {category.styles.map((style) => {
                                const isSelected = selectedStyles.includes(style.id);
                                const isDisabled = !isSelected && selectedStyles.length >= maxSelection && style.id !== 'none';

                                return (
                                    <button
                                        key={style.id}
                                        onClick={() => toggleStyle(style.id)}
                                        disabled={isDisabled}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm relative",
                                            isSelected
                                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                                : isDisabled
                                                ? "bg-white/5 text-neutral-600 cursor-not-allowed border border-white/5"
                                                : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
                                        )}
                                        title={style.descriptionCn}
                                    >
                                        <span>{style.icon}</span>
                                        <span>{style.nameCn}</span>
                                        {isSelected && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected styles summary */}
            {selectedStyles.length > 0 && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-neutral-300 text-sm">
                        <span className="font-medium text-white">
                            {selectedStyles.length} style{selectedStyles.length > 1 ? 's' : ''} selected
                        </span>
                        {selectedStyles.length > 0 && selectedStyles.length <= 5 && (
                            <span>
                                {' - '}
                                {selectedStyles.map(id => creativeStyles.find(s => s.id === id)?.nameCn).join(', ')}
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CreativeStyleSelector;
