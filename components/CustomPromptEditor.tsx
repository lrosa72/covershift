import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface CustomPromptEditorProps {
    defaultPrompt: string;
    onChange: (prompt: string) => void;
    onReset: () => void;
}

const CustomPromptEditor: React.FC<CustomPromptEditorProps> = ({
    defaultPrompt,
    onChange,
    onReset
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [customPrompt, setCustomPrompt] = useState(defaultPrompt);

    const handleApply = () => {
        onChange(customPrompt);
        setIsExpanded(false);
    };

    const handleResetClick = () => {
        setCustomPrompt(defaultPrompt);
        onReset();
        setIsExpanded(false);
    };

    return (
        <div className="w-full max-w-2xl">
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm font-sans uppercase tracking-wider flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Customize Prompt
                </button>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-playfair text-white text-sm">Edit Generation Prompt</h3>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-neutral-400 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="w-full h-32 bg-black/30 border border-white/20 rounded px-3 py-2 text-neutral-200 text-sm font-sans placeholder-neutral-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                        placeholder="Enter your custom prompt..."
                    />
                    <p className="text-neutral-500 text-xs mt-2">
                        Tip: Use {'{decade}'} as a placeholder for the decade (e.g., 1970s)
                    </p>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleResetClick}
                            className="flex-1 py-2 px-4 text-neutral-400 hover:text-white text-sm font-sans uppercase tracking-wider transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 py-2 px-4 bg-yellow-400 text-black text-sm font-sans uppercase tracking-wider hover:bg-yellow-300 transition-colors rounded"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomPromptEditor;
