/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REMIX_IDEAS = [
    "try different hairstyles",
    "turn your pet into a cartoon",
    "create a fantasy version",
    "design a superhero avatar",
    "place yourself in history",
    "generate a game character",
];

const Footer = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % REMIX_IDEAS.length);
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 z-50 text-neutral-300 text-xs sm:text-sm border-t border-white/10">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center gap-4 px-4">
                {/* Left Side - Simple credit */}
                <div className="flex items-center gap-3 text-neutral-500 whitespace-nowrap">
                    <span>Powered by Gemini 2.5 Flash</span>
                    <span className="text-neutral-700 hidden sm:inline">|</span>
                    <a
                        href="https://x.com/ammaar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-yellow-400 transition-colors hidden sm:inline"
                    >
                        @ammaar
                    </a>
                </div>

                {/* Right Side - Remix hint + buttons */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="hidden md:flex items-center gap-1.5 text-neutral-400">
                        <span className="text-neutral-600">Remix:</span>
                        <div className="relative w-36 h-4 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 text-neutral-200 text-xs"
                                >
                                    {REMIX_IDEAS[index]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>

                    <a
                        href="https://aistudio.google.com/apps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-permanent-marker text-xs sm:text-sm text-center text-black bg-yellow-400 py-1.5 px-3 rounded-sm hover:scale-105 hover:bg-yellow-300 transition-all whitespace-nowrap"
                    >
                        AI Studio
                    </a>
                    <a
                        href="https://gemini.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-permanent-marker text-xs sm:text-sm text-center text-white bg-white/10 border border-white/30 py-1.5 px-3 rounded-sm hover:scale-105 hover:bg-white hover:text-black transition-all whitespace-nowrap hidden sm:inline"
                    >
                        Gemini
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
