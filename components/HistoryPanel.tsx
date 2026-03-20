import React, { useState, useEffect } from 'react';
import { HistoryItem, getHistory, deleteHistoryItem, clearHistory } from '../lib/historyUtils';

interface HistoryPanelProps {
    onLoadHistory: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onLoadHistory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            setHistory(getHistory());
        }
    }, [isOpen]);

    const handleLoad = (item: HistoryItem) => {
        onLoadHistory(item);
        setIsOpen(false);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteHistoryItem(id);
        setHistory(getHistory());
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to clear all history?')) {
            clearHistory();
            setHistory([]);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            {/* History Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all"
                title="History"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* History Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="relative bg-neutral-900 border border-white/10 rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="font-playfair text-white text-xl">History</h2>
                            <div className="flex items-center gap-2">
                                {history.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-neutral-400 hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
                            {history.length === 0 ? (
                                <div className="p-8 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-neutral-500">No history yet</p>
                                    <p className="text-neutral-600 text-sm mt-1">Your generated collections will appear here</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {history.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleLoad(item)}
                                            className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className="w-16 h-20 flex-shrink-0 bg-neutral-800 rounded overflow-hidden">
                                                <img
                                                    src={item.originalImage}
                                                    alt="Original"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium">
                                                    {Object.keys(item.generatedImages).length} covers
                                                </p>
                                                <p className="text-neutral-500 text-xs">
                                                    {formatDate(item.timestamp)}
                                                </p>
                                                <p className="text-neutral-600 text-xs mt-1">
                                                    {item.selectedDecades.join(', ')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => handleDelete(e, item.id)}
                                                className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HistoryPanel;
