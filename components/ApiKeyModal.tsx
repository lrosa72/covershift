import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    currentApiKey: string;
}

const STORAGE_KEY = 'COVERSHIFT_IMAGE_API_KEY';

export function getStoredApiKey(): string {
    return localStorage.getItem(STORAGE_KEY) || '';
}

export function saveApiKey(apiKey: string): void {
    if (apiKey.trim()) {
        localStorage.setItem(STORAGE_KEY, apiKey.trim());
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
}

export default function ApiKeyModal({ isOpen, onClose, onSave, currentApiKey }: ApiKeyModalProps) {
    const [inputKey, setInputKey] = useState(currentApiKey);
    const [showKey, setShowKey] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setInputKey(currentApiKey);
    }, [currentApiKey]);

    const handleSave = () => {
        const key = inputKey.trim();
        if (!key) {
            setError('请输入有效的 API Key');
            return;
        }
        if (key.length < 20) {
            setError('API Key 长度似乎不对，请检查');
            return;
        }
        setError('');
        saveApiKey(key);
        onSave(key);
        onClose();
    };

    const handleClear = () => {
        setInputKey('');
        setError('');
        localStorage.removeItem(STORAGE_KEY);
        onSave('');
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-yellow-500/30 rounded-2xl p-8 max-w-lg w-full pointer-events-auto shadow-2xl shadow-yellow-500/10">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-playfair font-bold text-white">配置 API Key</h2>
                                    <p className="text-neutral-400 text-sm">需要图像模型 API Key 才能生成图片</p>
                                </div>
                            </div>

                            {/* Input Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        图像模型 API Key
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showKey ? 'text' : 'password'}
                                            value={inputKey}
                                            onChange={(e) => {
                                                setInputKey(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="请粘贴你的 API Key"
                                            className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all font-mono text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowKey(!showKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            {showKey ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {error && (
                                        <p className="mt-2 text-red-400 text-sm">{error}</p>
                                    )}
                                </div>

                                {/* How to get API Key */}
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                    <h3 className="text-yellow-400 font-medium text-sm mb-2 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        如何获取 API Key
                                    </h3>
                                    <ol className="text-neutral-400 text-xs space-y-1 list-decimal list-inside">
                                        <li>在你使用的图像模型平台创建 API Key</li>
                                        <li>复制生成的密钥并粘贴到上方</li>
                                        <li>保存后返回主界面开始生成</li>
                                        <li>若你使用兼容接口，可在环境变量中配置 API Endpoint / Model</li>
                                    </ol>
                                </div>

                                {/* Security note */}
                                <div className="flex items-start gap-2 text-neutral-500 text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>你的 API Key 只存储在本地浏览器中，不会被上传到任何服务器</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                {currentApiKey && (
                                    <button
                                        onClick={handleClear}
                                        className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-all"
                                    >
                                        清除
                                    </button>
                                )}
                                <div className="flex-1" />
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-3 text-neutral-400 hover:text-white transition-colors text-sm"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg text-sm transition-all shadow-lg shadow-yellow-500/20"
                                >
                                    保存并使用
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
