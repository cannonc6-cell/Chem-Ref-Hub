import React from 'react';
import toast from 'react-hot-toast';

const BackupRestore = ({ onDataRestore }) => {
    const handleBackup = () => {
        try {
            // Get all data from localStorage
            const data = {
                chemicals: JSON.parse(localStorage.getItem('chemicals') || '[]'),
                favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
                logbook: JSON.parse(localStorage.getItem('logbook_entries') || '[]'),
                timestamp: new Date().toISOString(),
                version: '1.3'
            };

            // Create download
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `chemref_backup_${new Date().toISOString().split('T')[0]}.json`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 100);

            toast.success('Backup created successfully!');
        } catch (error) {
            console.error('Backup error:', error);
            toast.error('Failed to create backup');
        }
    };

    const handleRestore = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Validate data structure
                if (!data.chemicals || !Array.isArray(data.chemicals)) {
                    throw new Error('Invalid backup file format');
                }

                // Confirm with user
                const confirmed = window.confirm(
                    `This will restore ${data.chemicals.length} chemicals, ${data.logbook?.length || 0} logbook entries, and ${data.favorites?.length || 0} favorites.\n\nCurrent data will be replaced. Continue?`
                );

                if (!confirmed) return;

                // Restore data
                localStorage.setItem('chemicals', JSON.stringify(data.chemicals));
                if (data.favorites) localStorage.setItem('favorites', JSON.stringify(data.favorites));
                if (data.logbook) localStorage.setItem('logbook_entries', JSON.stringify(data.logbook));

                toast.success('Data restored successfully! Reloading page...');
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                console.error('Restore error:', error);
                toast.error('Failed to restore data: ' + error.message);
            }
        };
        reader.readAsText(file);

        // Reset input
        event.target.value = '';
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                onClick={(e) => {
                    const dropdown = e.currentTarget.nextElementSibling;
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                💾 Backup
            </button>
            <div
                className="dropdown-menu"
                style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '0.5rem',
                    display: 'none',
                    zIndex: 1000,
                    minWidth: '200px'
                }}
            >
                <button
                    className="dropdown-item"
                    onClick={(e) => {
                        handleBackup();
                        e.target.closest('.dropdown-menu').style.display = 'none';
                    }}
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <span>📦</span> Backup Data
                </button>
                <label
                    className="dropdown-item"
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}
                >
                    <span>📥</span> Restore Data
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleRestore}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>
        </div>
    );
};

export default BackupRestore;
