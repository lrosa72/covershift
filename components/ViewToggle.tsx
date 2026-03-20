import React from 'react';
import { cn } from '../lib/utils';

type ViewMode = 'scattered' | 'gallery';

interface ViewToggleProps {
    viewMode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
    return (
        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button
                onClick={() => onChange('scattered')}
                className={cn(
                    "px-4 py-2 text-sm font-sans uppercase tracking-wider transition-all duration-200 rounded-md flex items-center gap-2",
                    viewMode === 'scattered'
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:text-white"
                )}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Scattered
            </button>
            <button
                onClick={() => onChange('gallery')}
                className={cn(
                    "px-4 py-2 text-sm font-sans uppercase tracking-wider transition-all duration-200 rounded-md flex items-center gap-2",
                    viewMode === 'gallery'
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:text-white"
                )}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Gallery
            </button>
        </div>
    );
};

export default ViewToggle;
