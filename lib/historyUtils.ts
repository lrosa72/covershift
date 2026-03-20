const STORAGE_KEY = 'bazaar-retrospect-history';
const MAX_HISTORY_ITEMS = 10;

export interface HistoryItem {
    id: string;
    timestamp: number;
    originalImage: string;
    generatedImages: Record<string, string>; // decade -> dataUrl
    selectedDecades: string[];
}

/**
 * Save a generation session to history
 */
export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
    try {
        const history = getHistory();
        const newItem: HistoryItem = {
            ...item,
            id: Date.now().toString(),
            timestamp: Date.now()
        };

        history.unshift(newItem);

        // Keep only the most recent items
        if (history.length > MAX_HISTORY_ITEMS) {
            history.splice(MAX_HISTORY_ITEMS);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save to history:', error);
    }
}

/**
 * Get all history items
 */
export function getHistory(): HistoryItem[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to load history:', error);
        return [];
    }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
}

/**
 * Delete a specific history item
 */
export function deleteHistoryItem(id: string): void {
    try {
        const history = getHistory();
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Failed to delete history item:', error);
    }
}
