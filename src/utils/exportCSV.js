/**
 * CSV Export Utility
 * Exports array of objects to CSV format
 */

/**
 * Converts array of objects to CSV string
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Optional array of column definitions {key, header}
 * @returns {string} CSV formatted string
 */
export function arrayToCSV(data, columns = null) {
    if (!data || data.length === 0) {
        return '';
    }

    // If columns not specified, use all keys from first object
    const cols = columns || Object.keys(data[0]).map(key => ({ key, header: key }));

    // Create header row
    const headers = cols.map(col => col.header || col.key);
    const headerRow = headers.map(escapeCSVValue).join(',');

    // Create data rows
    const dataRows = data.map(item => {
        const values = cols.map(col => {
            const value = item[col.key];
            return escapeCSVValue(value);
        });
        return values.join(',');
    });

    return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape CSV value (handle quotes, commas, newlines)
 */
function escapeCSVValue(value) {
    if (value === null || value === undefined) {
        return '';
    }

    const stringValue = String(value);

    // If contains comma, quote, or newline, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of file to download
 */
export function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

/**
 * Export chemicals to CSV
 * @param {Array} chemicals - Array of chemical objects
 * @param {string} filename - Optional filename (default: chemicals_YYYY-MM-DD.csv)
 */
export function exportChemicalsToCSV(chemicals, filename = null) {
    const columns = [
        { key: 'name', header: 'Chemical Name' },
        { key: 'formula', header: 'Formula' },
        { key: 'casNumber', header: 'CAS Number' },
        { key: 'molecularWeight', header: 'Molecular Weight' },
        { key: 'density', header: 'Density (g/mL)' },
        { key: 'meltingPoint', header: 'Melting Point (°C)' },
        { key: 'boilingPoint', header: 'Boiling Point (°C)' },
        { key: 'solubility', header: 'Solubility' },
        { key: 'hazards', header: 'Hazards' },
        { key: 'tags', header: 'Tags' },
        { key: 'storageLocation', header: 'Storage Location' },
        { key: 'notes', header: 'Notes' }
    ];

    // Transform data for export
    const exportData = chemicals.map(chem => ({
        ...chem,
        hazards: Array.isArray(chem.hazards) ? chem.hazards.join('; ') : chem.hazards,
        tags: Array.isArray(chem.tags) ? chem.tags.join('; ') : chem.tags
    }));

    const csv = arrayToCSV(exportData, columns);
    const name = filename || `chemicals_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, name);
}

/**
 * Export logbook entries to CSV
 * @param {Array} entries - Array of logbook entry objects
 * @param {string} filename - Optional filename
 */
export function exportLogbookToCSV(entries, filename = null) {
    const columns = [
        { key: 'date', header: 'Date' },
        { key: 'chemicalName', header: 'Chemical' },
        { key: 'quantity', header: 'Quantity' },
        { key: 'unit', header: 'Unit' },
        { key: 'purpose', header: 'Purpose' },
        { key: 'userName', header: 'User' },
        { key: 'notes', header: 'Notes' }
    ];

    const csv = arrayToCSV(entries, columns);
    const name = filename || `logbook_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, name);
}

/**
 * Get current date range for logbook export
 */
export function getDateRangeFilename(startDate, endDate) {
    const start = startDate ? new Date(startDate).toISOString().split('T')[0] : 'all';
    const end = endDate ? new Date(endDate).toISOString().split('T')[0] : 'all';
    return `logbook_${start}_to_${end}.csv`;
}
