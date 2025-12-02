import { useState, useEffect } from 'react';

const MAX_RECENT_ITEMS = 5;
const STORAGE_KEY = 'chemref_recent_viewed';

export function useRecentlyViewed() {
    const [recentItems, setRecentItems] = useState([]);

    // Load from local storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setRecentItems(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Error loading recently viewed items:', err);
        }
    }, []);

    // Add an item to the recent list
    const addToRecent = (chemical) => {
        if (!chemical || !chemical.id) return;

        setRecentItems((prev) => {
            // Remove if already exists to move it to top
            const filtered = prev.filter((item) => item.id !== chemical.id);

            // Add to beginning
            const newItem = {
                id: chemical.id,
                name: chemical.name,
                formula: chemical.formula,
                timestamp: Date.now()
            };

            const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);

            // Save to local storage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (err) {
                console.error('Error saving recently viewed item:', err);
            }

            return updated;
        });
    };

    return { recentItems, addToRecent };
}
