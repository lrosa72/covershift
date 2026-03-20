import React from 'react';
import { magazines, MagazineConfig } from '../src/config/magazines';
import { cn } from '../lib/utils';

interface MagazineSelectorProps {
    selectedMagazines: string[];
    onChange: (magazines: string[]) => void;
    maxSelection?: number;
}

const MagazineSelector: React.FC<MagazineSelectorProps> = ({
    selectedMagazines,
    onChange,
    maxSelection = 9
}) => {
    const toggleMagazine = (magazineId: string) => {
        if (selectedMagazines.includes(magazineId)) {
            onChange(selectedMagazines.filter(id => id !== magazineId));
        } else if (selectedMagazines.length < maxSelection) {
            onChange([...selectedMagazines, magazineId]);
        }
    };

    const selectDefault = () => {
        onChange(['bazaar']);
    };

    const selectAll = () => {
        const ids = magazines.slice(0, maxSelection).map(m => m.id);
        onChange(ids);
    };

    return (
        <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-white text-lg">
                    Select Magazine{selectedMagazines.length > 1 ? 's' : ''}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={selectDefault}
                        className="text-xs font-sans text-neutral-400 hover:text-white transition-colors"
                    >
                        Default
                    </button>
                    <span className="text-neutral-600">|</span>
                    <button
                        onClick={selectAll}
                        className="text-xs font-sans text-neutral-400 hover:text-white transition-colors"
                        disabled={selectedMagazines.length >= maxSelection}
                    >
                        Multi ({maxSelection})
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                {magazines.map((magazine) => {
                    const isSelected = selectedMagazines.includes(magazine.id);
                    const isDisabled = !isSelected && selectedMagazines.length >= maxSelection;
                    
                    return (
                        <button
                            key={magazine.id}
                            onClick={() => toggleMagazine(magazine.id)}
                            disabled={isDisabled}
                            className={cn(
                                "relative p-3 rounded-lg transition-all duration-200 text-left",
                                isSelected
                                    ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black"
                                    : isDisabled
                                    ? "bg-white/5 text-neutral-600 cursor-not-allowed border border-white/5"
                                    : "bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/20"
                            )}
                        >
                            <div className="font-medium text-sm">{magazine.name}</div>
                            <div className={cn(
                                "text-xs mt-0.5",
                                isSelected ? "text-black/70" : "text-neutral-500"
                            )}>
                                {magazine.nameCn}
                            </div>
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
            
            <p className="text-neutral-500 text-xs mt-3 text-center">
                {selectedMagazines.length === 0
                    ? "Select at least one magazine"
                    : `${selectedMagazines.length} magazine${selectedMagazines.length > 1 ? 's' : ''} selected`}
            </p>
        </div>
    );
};

export default MagazineSelector;
