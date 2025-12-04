/**
 * Analytics Utilities
 * Calculate statistics and aggregations for data visualization
 */

/**
 * Calculate chemical usage statistics from logbook
 * @param {Array} logbook - Logbook entries
 * @returns {Array} Usage data grouped by date
 */
export function calculateUsageStats(logbook) {
    if (!Array.isArray(logbook) || logbook.length === 0) {
        return [];
    }

    // Group by date
    const usageByDate = {};

    logbook.forEach(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        if (!usageByDate[date]) {
            usageByDate[date] = {
                date,
                count: 0,
                totalQuantity: 0
            };
        }
        usageByDate[date].count++;
        usageByDate[date].totalQuantity += parseFloat(entry.quantity) || 0;
    });

    // Convert to array and sort by date
    return Object.values(usageByDate).sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );
}

/**
 * Get most viewed chemicals from recently viewed list
 * @param {Array} recentItems - Recently viewed items
 * @returns {Array} Top chemicals with view counts
 */
export function getMostViewedChemicals(recentItems) {
    if (!Array.isArray(recentItems) || recentItems.length === 0) {
        return [];
    }

    // Count views per chemical
    const viewCounts = {};

    recentItems.forEach(item => {
        if (!viewCounts[item.id]) {
            viewCounts[item.id] = {
                id: item.id,
                name: item.name,
                formula: item.formula,
                views: 0
            };
        }
        viewCounts[item.id].views++;
    });

    // Convert to array and sort by views
    return Object.values(viewCounts)
        .sort((a, b) => b.views - a.views)
        .slice(0, 10); // Top 10
}

/**
 * Get hazard distribution from chemicals
 * @param {Array} chemicals - Chemical data
 * @returns {Array} Hazard counts with colors
 */
export function getHazardDistribution(chemicals) {
    if (!Array.isArray(chemicals) || chemicals.length === 0) {
        return [];
    }

    const hazardCounts = {};
    const hazardColors = {
        'Flammable': '#F97316', // coral
        'Toxic': '#EF4444', // red
        'Corrosive': '#F59E0B', // amber
        'Oxidizer': '#3B82F6', // blue
        'Reactive': '#EC4899', // pink
        'Compressed Gas': '#14B8A6', // teal
        'Health Hazard': '#8B5CF6', // purple
        'Environmental': '#10B981', // emerald
        'Other': '#64748B' // slate
    };

    chemicals.forEach(chem => {
        if (Array.isArray(chem.hazards)) {
            chem.hazards.forEach(hazard => {
                if (!hazardCounts[hazard]) {
                    hazardCounts[hazard] = {
                        name: hazard,
                        value: 0,
                        color: hazardColors[hazard] || hazardColors['Other']
                    };
                }
                hazardCounts[hazard].value++;
            });
        }
    });

    return Object.values(hazardCounts).sort((a, b) => b.value - a.value);
}

/**
 * Get most used chemicals from logbook
 * @param {Array} logbook - Logbook entries
 * @param {Array} chemicals - Chemical data for names
 * @returns {Array} Top chemicals with usage counts
 */
export function getMostUsedChemicals(logbook, chemicals) {
    if (!Array.isArray(logbook) || logbook.length === 0) {
        return [];
    }

    const usageCounts = {};

    logbook.forEach(entry => {
        const chemId = entry.chemical || entry.chemicalId;
        if (!usageCounts[chemId]) {
            // Find chemical name
            const chem = chemicals?.find(c => c.id === chemId);
            usageCounts[chemId] = {
                id: chemId,
                name: chem?.name || entry.chemicalName || 'Unknown',
                formula: chem?.formula || '',
                count: 0,
                totalQuantity: 0
            };
        }
        usageCounts[chemId].count++;
        usageCounts[chemId].totalQuantity += parseFloat(entry.quantity) || 0;
    });

    return Object.values(usageCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Top 8
}

/**
 * Get activity timeline (last 30 days)
 * @param {Array} logbook - Logbook entries
 * @param {Array} recentViews - Recently viewed items
 * @returns {Array} Daily activity counts
 */
export function getActivityTimeline(logbook, recentViews) {
    const timeline = {};
    const now = new Date();

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        timeline[dateStr] = {
            date: dateStr,
            logbookEntries: 0,
            views: 0,
            total: 0
        };
    }

    // Count logbook entries
    if (Array.isArray(logbook)) {
        logbook.forEach(entry => {
            const dateStr = new Date(entry.date).toLocaleDateString();
            if (timeline[dateStr]) {
                timeline[dateStr].logbookEntries++;
                timeline[dateStr].total++;
            }
        });
    }

    // Count views
    if (Array.isArray(recentViews)) {
        recentViews.forEach(item => {
            const dateStr = new Date(item.timestamp).toLocaleDateString();
            if (timeline[dateStr]) {
                timeline[dateStr].views++;
                timeline[dateStr].total++;
            }
        });
    }

    return Object.values(timeline);
}

/**
 * Get summary statistics
 * @param {Object} data - All application data
 * @returns {Object} Summary stats
 */
export function getSummaryStats(data) {
    const { chemicals = [], logbook = [], favorites = [], recentItems = [] } = data;

    return {
        totalChemicals: chemicals.length,
        totalLogEntries: logbook.length,
        totalFavorites: favorites.length,
        totalViews: recentItems.length,
        avgUsagePerMonth: logbook.length > 0
            ? (logbook.length / 12).toFixed(1)
            : 0
    };
}
