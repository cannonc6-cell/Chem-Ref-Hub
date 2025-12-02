import { useState, useEffect, useCallback } from 'react';
import bundledData from '../data/chemical_data.json';

const BASE = import.meta.env.BASE_URL || '/';

// Helper to normalize chemical data
function normalizeChemical(chem) {
    return {
        id: chem.id || chem["CAS"] || chem["Chemical Name"] || chem.name,
        name: chem["Chemical Name"] || chem.name || "",
        formula: chem["Formula"] || chem.formula || "",
        appearance: chem["Appearance"] || chem.appearance || "",
        image: chem.image || `${BASE}chemical-images/${(chem["Chemical Name"] || chem.name || '').replace(/\s+/g, '_')}.jpg`,
        tags: Array.isArray(chem.tags) ? chem.tags : [],
        ...chem
    };
}

// Helper to merge base data with user additions
function combineChemicals(base, additions) {
    const keyOf = (c) => String(c.CAS || c['CAS'] || c.id || c['Chemical Name'] || c.name || '').toLowerCase();
    const map = new Map();

    if (Array.isArray(base)) {
        base.forEach((c) => map.set(keyOf(c), c));
    }

    if (Array.isArray(additions)) {
        additions.forEach((c) => {
            const k = keyOf(c);
            if (map.has(k)) {
                map.set(k, { ...map.get(k), ...c });
            } else {
                map.set(k, c);
            }
        });
    }
    return Array.from(map.values());
}

export function useChemicals() {
    const [chemicals, setChemicals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // Load initial data
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setLoading(true);

                // 1. Load base data
                let baseData = bundledData;
                // Handle default export if it exists (common in some bundlers)
                if (baseData && typeof baseData === 'object' && 'default' in baseData) {
                    baseData = baseData.default;
                }

                try {
                    const res = await fetch(`${BASE}chemical_data.json`);
                    if (res.ok) {
                        const fetched = await res.json();
                        if (Array.isArray(fetched)) {
                            baseData = fetched;
                        }
                    } else {
                        console.warn("Fetch failed, using bundle", res.status);
                    }
                } catch (err) {
                    console.warn("Fetch error, using bundle", err);
                }

                // 2. Load user data
                let userData = [];
                try {
                    const localStr = localStorage.getItem('userChemicals');
                    userData = localStr ? JSON.parse(localStr) : [];
                } catch (e) {
                    console.error("Failed to parse localStorage", e);
                }

                // 3. Load Favorites
                let favData = [];
                try {
                    favData = JSON.parse(localStorage.getItem('favoriteChemicals') || '[]');
                } catch (e) {
                    console.error("Error reading favorites", e);
                }

                if (isMounted) {
                    const combined = combineChemicals(baseData, userData);
                    setChemicals(combined.map(normalizeChemical));
                    setFavorites(favData);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();

        return () => { isMounted = false; };
    }, []);

    const addChemical = useCallback((newChem) => {
        setChemicals(prev => {
            const updated = [...prev, normalizeChemical(newChem)];

            // Persist
            try {
                const currentLocal = JSON.parse(localStorage.getItem('userChemicals') || '[]');
                const nextLocal = [...currentLocal, newChem];
                localStorage.setItem('userChemicals', JSON.stringify(nextLocal));
            } catch (e) {
                console.error("Failed to save new chemical", e);
            }

            return updated;
        });
    }, []);

    const updateChemical = useCallback((updatedChem) => {
        setChemicals(prev => {
            const next = prev.map(c => c.id === updatedChem.id ? normalizeChemical(updatedChem) : c);

            // Persist
            try {
                const currentLocal = JSON.parse(localStorage.getItem('userChemicals') || '[]');
                // Remove the old version if it exists in local
                const filteredLocal = currentLocal.filter(c => {
                    const key = c.id || c.CAS || c["Chemical Name"];
                    const targetKey = updatedChem.id || updatedChem.CAS || updatedChem["Chemical Name"];
                    return key !== targetKey;
                });
                // Add the new version
                const nextLocal = [...filteredLocal, updatedChem];
                localStorage.setItem('userChemicals', JSON.stringify(nextLocal));
            } catch (e) {
                console.error("Failed to save updated chemical", e);
            }

            return next;
        });
    }, []);

    const deleteChemical = useCallback((id) => {
        setChemicals(prev => {
            const next = prev.filter(c => c.id !== id);

            // Persist deletion
            try {
                const currentLocal = JSON.parse(localStorage.getItem('userChemicals') || '[]');
                const nextLocal = currentLocal.filter(c => {
                    const key = c.id || c.CAS || c["Chemical Name"];
                    return key !== id;
                });
                localStorage.setItem('userChemicals', JSON.stringify(nextLocal));
            } catch (e) {
                console.error("Failed to delete chemical", e);
            }

            return next;
        });
    }, []);

    const toggleFavorite = useCallback((id) => {
        setFavorites(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            localStorage.setItem('favoriteChemicals', JSON.stringify(next));
            return next;
        });
    }, []);

    return {
        chemicals,
        loading,
        error,
        favorites,
        addChemical,
        updateChemical,
        deleteChemical,
        toggleFavorite
    };
}
