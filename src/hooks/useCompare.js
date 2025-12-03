import { useState, useEffect } from 'react';

const MAX_COMPARE_ITEMS = 3;
const STORAGE_KEY = 'chemref_compare_list';

export function useCompare() {
    const [compareList, setCompareList] = useState([]);

    // Load from local storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setCompareList(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Error loading comparison list:', err);
        }
    }, []);

    // Add an item to the comparison list
    const addToCompare = (chemical) => {
        if (!chemical || !chemical.id) return;

        setCompareList((prev) => {
            // Check if already exists
            if (prev.some((item) => item.id === chemical.id)) {
                return prev;
            }

            // Limit to max items
            if (prev.length >= MAX_COMPARE_ITEMS) {
                alert(`You can compare up to ${MAX_COMPARE_ITEMS} chemicals at a time.`);
                return prev;
            }

            const newItem = {
                id: chemical.id || chemical.CAS || chemical["Chemical Name"] || chemical.name,
                name: chemical.name || chemical["Chemical Name"] || "",
                formula: chemical.formula || chemical["Formula"] || "",
                image: chemical.image || "",
                properties: chemical.properties || {},
                hazards: chemical.hazards || chemical["Hazard Information"] || {},
                CAS: chemical.CAS || chemical["CAS"] || ""
            };

            const updated = [...prev, newItem];

            // Save to local storage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (err) {
                console.error('Error saving comparison list:', err);
            }

            return updated;
        });
    };

    // Remove an item from the comparison list
    const removeFromCompare = (id) => {
        setCompareList((prev) => {
            const updated = prev.filter((item) => item.id !== id);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (err) {
                console.error('Error saving comparison list:', err);
            }
            return updated;
        });
    };

    // Clear comparison list
    const clearCompare = () => {
        setCompareList([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            console.error('Error clearing comparison list:', err);
        }
    };

    return { compareList, addToCompare, removeFromCompare, clearCompare };
}
