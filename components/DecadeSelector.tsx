import React, { useState } from 'react';
import { eras, EraConfig, DEFAULT_DECADES } from '../src/config/eras';
import { presets, PresetConfig } from '../src/config/presets';
import { cn } from '../lib/utils';

interface DecadeSelectorProps {
    selectedDecades: string[];
    onChange: (decades: string[]) => void;
}

// Group eras by category
const eraCategories = [
    { name: 'Historical', eras: eras.filter(e => ['1920s', '1930s', '1940s'].includes(e.id)) },
    { name: 'Classic', eras: eras.filter(e => ['1950s', '1960s', '1970s', '1980s', '1990s'].includes(e.id)) },
    { name: 'Modern', eras: eras.filter(e => ['2000s', '2010s', '2020s'].includes(e.id)) },
    { name: 'Future', eras: eras.filter(e => ['2030s', '2040s', '2050s', '2100s'].includes(e.id)) }
];

const DecadeSelector: React.FC<DecadeSelectorProps> = ({
    selectedDecades,
    onChange
}) => {
    const [mode, setMode] = useState<'custom' | 'random' | 'preset'>('custom');
    const [randomCount, setRandomCount] = useState(9);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

    const toggleDecade = (decade: string) => {
        if (selectedDecades.includes(decade)) {
            onChange(selectedDecades.filter(d => d !== decade));
        } else {
            onChange([...selectedDecades, decade]);
        }
    };

    const selectAll = () => {
        onChange([...DEFAULT_DECADES]);
    };

    const selectNone = () => {
        onChange([]);
    };

    const selectEraCategory = (categoryName: string) => {
        const categoryEras = eraCategories.find(c => c.name === categoryName)?.eras || [];
        const categoryDecadeIds = categoryEras.map(e => e.id);
        const newSelection = [...new Set([...selectedDecades, ...categoryDecadeIds])];
        onChange(newSelection);
    };

    const handleRandomSelect = () => {
        // Get all decade IDs
        const allDecadeIds = eras.map(e => e.id);
        
        // Shuffle and pick
        const shuffled = allDecadeIds.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, randomCount);
        
        // Sort by era order
        const ordered = selected.sort((a, b) => {
            return eras.findIndex(e => e.id === a) - eras.findIndex(e => e.id === b);
        });
        
        onChange(ordered);
        setMode('random');
    };

    const handlePresetSelect = (presetId: string) => {
        const preset = presets.find(p => p.id === presetId);
        if (preset) {
            onChange(preset.decades);
            setSelectedPreset(presetId);
            setMode('preset');
        }
    };

    return (
        <div className="w-full max-w-2xl">
            {/* Mode Selector */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-white text-lg">Select Decades</h3>
                <div className="flex gap-1 bg-white/10 rounded-lg p-1">
                    <button
                        onClick={() => setMode('custom')}
                        className={cn(
                            "px-3 py-1 text-xs rounded transition-all",
                            mode === 'custom' ? "bg-yellow-400 text-black" : "text-neutral-400 hover:text-white"
                        )}
                    >
                        Custom
                    </button>
                    <button
                        onClick={() => setMode('random')}
                        className={cn(
                            "px-3 py-1 text-xs rounded transition-all",
                            mode === 'random' ? "bg-yellow-400 text-black" : "text-neutral-400 hover:text-white"
                        )}
                    >
                        Random
                    </button>
                    <button
                        onClick={() => setMode('preset')}
                        className={cn(
                            "px-3 py-1 text-xs rounded transition-all",
                            mode === 'preset' ? "bg-yellow-400 text-black" : "text-neutral-400 hover:text-white"
                        )}
                    >
                        Presets
                    </button>
                </div>
            </div>

            {/* Custom Mode */}
            {mode === 'custom' && (
                <>
                    {/* Quick actions */}
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={selectAll}
                            className="text-xs font-sans text-neutral-400 hover:text-white transition-colors"
                        >
                            Select All (9)
                        </button>
                        <span className="text-neutral-600">|</span>
                        <button
                            onClick={selectNone}
                            className="text-xs font-sans text-neutral-400 hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                        <span className="text-neutral-600">|</span>
                        {eraCategories.map((cat) => (
                            <React.Fragment key={cat.name}>
                                <button
                                    onClick={() => selectEraCategory(cat.name)}
                                    className="text-xs font-sans text-neutral-500 hover:text-white transition-colors"
                                >
                                    {cat.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Era categories */}
                    <div className="space-y-3">
                        {eraCategories.map((category) => (
                            <div key={category.name}>
                                <div className="text-xs font-sans text-neutral-500 uppercase tracking-wider mb-2">
                                    {category.name}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {category.eras.map((era) => (
                                        <button
                                            key={era.id}
                                            onClick={() => toggleDecade(era.id)}
                                            className={cn(
                                                "px-3 py-2 text-sm font-sans uppercase tracking-wider transition-all duration-200 rounded",
                                                selectedDecades.includes(era.id)
                                                    ? "bg-yellow-400 text-black font-bold"
                                                    : "bg-white/10 text-neutral-400 hover:bg-white/20 hover:text-white border border-white/10"
                                            )}
                                            title={era.eraName}
                                        >
                                            {era.decade}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Random Mode */}
            {mode === 'random' && (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
                    <div className="text-center">
                        <div className="text-4xl mb-3">🎲</div>
                        <h4 className="font-playfair text-white text-xl mb-2">Random Era Generator</h4>
                        <p className="text-neutral-400 text-sm mb-6">
                            Let fate decide your fashion journey through time!
                        </p>
                        
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="text-neutral-400 text-sm">Generate</span>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={randomCount}
                                onChange={(e) => setRandomCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                                className="w-16 bg-white/10 border border-white/20 rounded px-3 py-2 text-center text-white text-lg font-bold"
                            />
                            <span className="text-neutral-400 text-sm">eras randomly</span>
                        </div>

                        <button
                            onClick={handleRandomSelect}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30"
                        >
                            🎲 Surprise Me!
                        </button>

                        {selectedDecades.length > 0 && mode === 'random' && (
                            <div className="mt-6">
                                <p className="text-neutral-500 text-xs mb-2">Selected randomly:</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {selectedDecades.map((decade) => (
                                        <span
                                            key={decade}
                                            className="px-2 py-1 bg-yellow-400/20 text-yellow-300 rounded text-xs"
                                        >
                                            {decade}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Preset Mode */}
            {mode === 'preset' && (
                <div className="grid grid-cols-2 gap-3">
                    {presets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset.id)}
                            className={cn(
                                "p-4 rounded-xl text-left transition-all duration-200 border",
                                selectedPreset === preset.id && mode === 'preset'
                                    ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                            )}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{preset.icon}</span>
                                <span className="font-playfair text-white font-medium">{preset.name}</span>
                            </div>
                            <p className="text-neutral-400 text-xs mb-2">{preset.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {preset.decades.slice(0, 4).map((decade) => (
                                    <span
                                        key={decade}
                                        className="px-1.5 py-0.5 bg-white/10 text-neutral-300 rounded text-[10px]"
                                    >
                                        {decade}
                                    </span>
                                ))}
                                {preset.decades.length > 4 && (
                                    <span className="px-1.5 py-0.5 text-neutral-500 text-[10px]">
                                        +{preset.decades.length - 4}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Status */}
            <p className="text-neutral-500 text-xs mt-4 text-center">
                {selectedDecades.length === 0
                    ? "Select at least one decade to continue"
                    : `${selectedDecades.length} decade${selectedDecades.length > 1 ? 's' : ''} selected`}
            </p>
        </div>
    );
};

export default DecadeSelector;
