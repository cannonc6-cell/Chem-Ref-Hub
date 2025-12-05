export const LOG_TYPES = {
    experiment: {
        id: 'experiment',
        icon: '📊',
        label: 'Experiment Log',
        color: '#8B5CF6',
        fields: [
            { name: 'title', type: 'text', required: true, label: 'Experiment Title', placeholder: 'e.g., Synthesis of Aspirin' },
            { name: 'date', type: 'date', required: true, label: 'Date' },
            { name: 'chemicals', type: 'multiselect', required: false, label: 'Chemicals Used', placeholder: 'Select chemicals...' },
            { name: 'procedure', type: 'textarea', required: false, label: 'Procedure/Method', placeholder: 'Describe the experimental procedure...', rows: 3 },
            { name: 'observations', type: 'textarea', required: false, label: 'Observations', placeholder: 'Observations during experiment...', rows: 3 },
            { name: 'results', type: 'textarea', required: false, label: 'Results', placeholder: 'Final results and measurements...', rows: 3 },
            { name: 'success', type: 'select', required: false, label: 'Success?', options: ['Yes', 'No', 'Partial'] },
            { name: 'reference', type: 'text', required: false, label: 'Reference/Protocol Link', placeholder: 'https://...' }
        ]
    },

    disposal: {
        id: 'disposal',
        icon: '🗑️',
        label: 'Disposal Log',
        color: '#EF4444',
        fields: [
            { name: 'date', type: 'date', required: true, label: 'Date' },
            { name: 'chemical', type: 'autocomplete', required: true, label: 'Chemical Name', placeholder: 'Select or type chemical name' },
            { name: 'quantity', type: 'text', required: true, label: 'Quantity Disposed', placeholder: 'e.g., 250 mL' },
            { name: 'method', type: 'select', required: true, label: 'Disposal Method', options: ['Waste Container', 'Neutralization', 'Incineration', 'Special Pickup', 'Other'] },
            { name: 'containerId', type: 'text', required: false, label: 'Container ID/Location', placeholder: 'e.g., Waste-B-12' },
            { name: 'reason', type: 'select', required: false, label: 'Reason for Disposal', options: ['Expired', 'Contaminated', 'Excess', 'Equipment Failure', 'Other'] },
            { name: 'safetyNotes', type: 'textarea', required: false, label: 'Safety Notes', placeholder: 'Any safety considerations...', rows: 2 }
        ]
    },

    inventory: {
        id: 'inventory',
        icon: '📦',
        label: 'Inventory Change',
        color: '#10B981',
        fields: [
            { name: 'date', type: 'date', required: true, label: 'Date' },
            { name: 'chemical', type: 'autocomplete', required: true, label: 'Chemical Name', placeholder: 'Select chemical' },
            { name: 'previousQuantity', type: 'text', required: false, label: 'Previous Quantity', placeholder: 'Auto-filled if available' },
            { name: 'newQuantity', type: 'text', required: true, label: 'New Quantity', placeholder: 'e.g., 500 g' },
            { name: 'location', type: 'text', required: false, label: 'Location/Storage', placeholder: 'e.g., Cabinet A-3' },
            { name: 'changeReason', type: 'select', required: true, label: 'Change Reason', options: ['Received Stock', 'Used in Experiment', 'Spilled/Lost', 'Inventory Correction', 'Transferred'] },
            { name: 'supplier', type: 'text', required: false, label: 'Supplier/Source', placeholder: 'If newly added' },
            { name: 'notes', type: 'textarea', required: false, label: 'Notes', placeholder: 'Additional details...', rows: 2 }
        ]
    },

    usage: {
        id: 'usage',
        icon: '🧪',
        label: 'General Usage',
        color: '#3B82F6',
        fields: [
            { name: 'date', type: 'date', required: true, label: 'Date' },
            { name: 'chemical', type: 'autocomplete', required: true, label: 'Chemical Name', placeholder: 'Select chemical' },
            { name: 'quantity', type: 'text', required: true, label: 'Quantity Used', placeholder: 'e.g., 50 mL' },
            { name: 'purpose', type: 'text', required: false, label: 'Purpose/Project', placeholder: 'e.g., Titration Lab' },
            { name: 'usedBy', type: 'text', required: false, label: 'Used By', placeholder: 'Optional' },
            { name: 'notes', type: 'textarea', required: false, label: 'Notes', placeholder: 'Any additional notes...', rows: 2 }
        ]
    },

    maintenance: {
        id: 'maintenance',
        icon: '🧹',
        label: 'Maintenance/Cleaning',
        color: '#F59E0B',
        fields: [
            { name: 'date', type: 'date', required: true, label: 'Date' },
            { name: 'equipment', type: 'text', required: true, label: 'Equipment/Area', placeholder: 'e.g., Fume Hood 2' },
            { name: 'cleaningAgents', type: 'text', required: false, label: 'Cleaning Agents Used', placeholder: 'e.g., Ethanol, Water' },
            { name: 'procedure', type: 'textarea', required: false, label: 'Procedure', placeholder: 'Cleaning steps performed...', rows: 2 },
            { name: 'performedBy', type: 'text', required: false, label: 'Performed By', placeholder: 'Your name' },
            { name: 'nextScheduled', type: 'date', required: false, label: 'Next Scheduled Date' },
            { name: 'notes', type: 'textarea', required: false, label: 'Notes', placeholder: 'Additional details...', rows: 2 }
        ]
    },

    incident: {
        id: 'incident',
        icon: '⚠️',
        label: 'Incident Report',
        color: '#DC2626',
        fields: [
            { name: 'date', type: 'date', required: true, label: 'Date' },
            { name: 'incidentType', type: 'select', required: true, label: 'Incident Type', options: ['Spill', 'Exposure', 'Equipment Failure', 'Fire', 'Other'] },
            { name: 'chemicals', type: 'multiselect', required: false, label: 'Chemical(s) Involved', placeholder: 'Select chemicals...' },
            { name: 'location', type: 'text', required: true, label: 'Location', placeholder: 'Where did this occur?' },
            { name: 'description', type: 'textarea', required: true, label: 'Description', placeholder: 'Detailed description of the incident...', rows: 3 },
            { name: 'responseActions', type: 'textarea', required: true, label: 'Response Actions Taken', placeholder: 'What actions were taken...', rows: 2 },
            { name: 'severity', type: 'select', required: true, label: 'Severity', options: ['Low', 'Medium', 'High'] },
            { name: 'reportedTo', type: 'text', required: false, label: 'Reported To', placeholder: 'Supervisor name' },
            { name: 'followUpRequired', type: 'checkbox', required: false, label: 'Follow-up Required?' }
        ]
    }
};

export const getLogTypeConfig = (typeId) => {
    return LOG_TYPES[typeId] || LOG_TYPES.usage;
};

export const getAllLogTypes = () => {
    return Object.values(LOG_TYPES);
};
