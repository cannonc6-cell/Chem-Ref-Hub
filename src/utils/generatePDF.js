import jsPDF from 'jspdf';

/**
 * Sanitize text to remove unsupported characters for jsPDF standard fonts
 * Replaces common special characters with ASCII equivalents
 */
const sanitize = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/°/g, ' deg ')       // Replace degree symbol
        .replace(/℃/g, ' deg C')      // Replace celsius symbol
        .replace(/×/g, 'x')           // Replace multiplication sign
        .replace(/●/g, '-')           // Replace bullet
        .replace(/•/g, '-')           // Replace bullet
        .replace(/[^\x00-\x7F]/g, '') // Remove other non-ASCII characters
        .replace(/\s+/g, ' ')         // Normalize whitespace
        .trim();
};

/**
 * Generate PDF for a chemical showing ALL properties
 * @param {Object} chemical - Chemical data object
 */
export function generateChemicalPDF(chemical) {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper to add text line by line
    const addLines = (lines, size = 11, isBold = false, indent = 0) => {
        if (!lines || lines.length === 0) return;

        pdf.setFontSize(size);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');

        const lineHeight = size * 0.4; // mm approx

        lines.forEach(line => {
            if (yPosition + lineHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
            pdf.text(line, margin + indent, yPosition);
            yPosition += lineHeight + 2;
        });
    };

    const addText = (text, size = 11, isBold = false, indent = 0) => {
        if (!text) return;
        const cleanText = sanitize(text);
        if (!cleanText) return;

        const lines = pdf.splitTextToSize(cleanText, maxWidth - indent);
        addLines(lines, size, isBold, indent);
    };

    // Header
    pdf.setFillColor(3, 105, 161);
    pdf.rect(0, 0, pageWidth, 35, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Chemical Data Sheet', pageWidth / 2, 22, { align: 'center' });

    pdf.setTextColor(0, 0, 0);
    yPosition = 50;

    // Chemical Name
    const name = chemical.name || chemical['Chemical Name'] || 'Unnamed Chemical';
    addText(name, 16, true);
    yPosition += 5;

    // Divider
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Track processed keys to avoid duplicates
    const processed = new Set(['id', 'QR', 'timestamp', 'userId', 'name', 'Chemical Name', 'image']);

    // 1. Basic Info & Physical Properties
    const basicFields = [
        { key: 'CAS', label: 'CAS Number' },
        { key: 'casNumber', label: 'CAS Number' },
        { key: 'Formula', label: 'Formula' },
        { key: 'formula', label: 'Formula' },
        { key: 'Molecular Weight', label: 'Molecular Weight' },
        { key: 'molecularWeight', label: 'Molecular Weight' },
        { key: 'Density', label: 'Density' },
        { key: 'density', label: 'Density' },
        { key: 'Appearance', label: 'Appearance' },
        { key: 'appearance', label: 'Appearance' },
        { key: 'meltingPoint', label: 'Melting Point' },
        { key: 'Melting Point', label: 'Melting Point' },
        { key: 'boilingPoint', label: 'Boiling Point' },
        { key: 'Boiling Point', label: 'Boiling Point' },
        { key: 'Solubility', label: 'Solubility' },
        { key: 'solubility', label: 'Solubility' }
    ];

    basicFields.forEach(({ key, label }) => {
        if (chemical[key] && !processed.has(key)) {
            addText(`${label}: ${chemical[key]}`, 11, false);
            processed.add(key);
            yPosition += 2;
        }
    });

    yPosition += 5;

    // 2. Categories / Tags
    if (chemical.tags && Array.isArray(chemical.tags) && chemical.tags.length > 0) {
        addText(`Categories: ${chemical.tags.join(', ')}`, 11, false);
        processed.add('tags');
        yPosition += 5;
    }

    // 3. Detailed Sections
    const sections = [
        { keys: ['description', 'Description', 'Properties'], title: 'PROPERTIES & DESCRIPTION' },
        { keys: ['Hazard Information', 'hazards', 'Hazard Statements'], title: 'HAZARDS & SAFETY' },
        { keys: ['Handling & Storage', 'handling'], title: 'HANDLING & STORAGE' },
        { keys: ['Safety Notes', 'safety'], title: 'EMERGENCY & FIRST AID' },
        { keys: ['Lab Use Notes', 'lab_use'], title: 'LABORATORY USE' },
        { keys: ['SDS Link'], title: 'SDS REFERENCE' }
    ];

    sections.forEach(({ keys, title }) => {
        let contentFound = false;
        keys.forEach(key => {
            if (chemical[key] && !processed.has(key)) {
                if (!contentFound) {
                    if (yPosition + 15 > pageHeight - margin) {
                        pdf.addPage();
                        yPosition = margin;
                    }
                    addText(title, 12, true);
                    yPosition += 2;
                    contentFound = true;
                }

                // Handle arrays (like hazards list)
                if (Array.isArray(chemical[key])) {
                    addText(chemical[key].join(', '), 10, false, 5);
                } else {
                    addText(chemical[key], 10, false, 5);
                }

                processed.add(key);
                yPosition += 3;
            }
        });
        if (contentFound) yPosition += 5;
    });

    // 4. Inventory
    if (chemical.inventory) {
        if (yPosition + 20 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }
        addText('INVENTORY STATUS', 12, true);
        yPosition += 2;

        const inv = chemical.inventory;
        if (inv.quantity !== undefined) addText(`Quantity: ${inv.quantity} ${inv.unit || ''}`, 10, false, 5);
        if (inv.location) addText(`Location: ${inv.location}`, 10, false, 5);

        processed.add('inventory');
        yPosition += 5;
    }

    // 5. Remaining Fields (Catch-all)
    Object.keys(chemical).forEach(key => {
        if (processed.has(key)) return;

        const value = chemical[key];
        if (value === null || value === undefined || value === '') return;

        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();

        if (yPosition + 10 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        addText(label, 11, true);

        if (Array.isArray(value)) {
            value.forEach(item => addText(`- ${item}`, 10, false, 5));
        } else if (typeof value === 'object') {
            Object.entries(value).forEach(([k, v]) => {
                if (v) addText(`${k}: ${v}`, 10, false, 5);
            });
        } else {
            addText(String(value), 10, false, 5);
        }

        yPosition += 4;
    });

    // Footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(`Page ${i} of ${totalPages} - Generated ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    const filename = `${sanitize(name).replace(/[^a-z0-9]/gi, '_')}.pdf`;

    // Use output with blob and explicit download  
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Generate PDF for multiple chemicals
 * Reuses the detailed logic from generateChemicalPDF for each item
 */
export function generateBatchPDF(chemicals) {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    chemicals.forEach((chemical, index) => {
        if (index > 0) pdf.addPage();

        let yPosition = margin;

        // Helper to add text line by line (Scoped to this function instance)
        const addLines = (lines, size = 11, isBold = false, indent = 0) => {
            if (!lines || lines.length === 0) return;
            pdf.setFontSize(size);
            pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
            const lineHeight = size * 0.4;
            lines.forEach(line => {
                if (yPosition + lineHeight > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }
                pdf.text(line, margin + indent, yPosition);
                yPosition += lineHeight + 2;
            });
        };

        const addText = (text, size = 11, isBold = false, indent = 0) => {
            if (!text) return;
            const cleanText = sanitize(text);
            if (!cleanText) return;
            const lines = pdf.splitTextToSize(cleanText, maxWidth - indent);
            addLines(lines, size, isBold, indent);
        };

        // Header
        pdf.setFillColor(3, 105, 161);
        pdf.rect(0, 0, pageWidth, 35, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Chemical Data Sheet', pageWidth / 2, 22, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
        yPosition = 50;

        // Chemical Name
        const name = chemical.name || chemical['Chemical Name'] || 'Unnamed Chemical';
        addText(name, 16, true);
        yPosition += 5;

        // Divider
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Track processed keys
        const processed = new Set(['id', 'QR', 'timestamp', 'userId', 'name', 'Chemical Name', 'image']);

        // 1. Basic Info
        const basicFields = [
            { key: 'CAS', label: 'CAS Number' },
            { key: 'casNumber', label: 'CAS Number' },
            { key: 'Formula', label: 'Formula' },
            { key: 'formula', label: 'Formula' },
            { key: 'Molecular Weight', label: 'Molecular Weight' },
            { key: 'molecularWeight', label: 'Molecular Weight' },
            { key: 'Density', label: 'Density' },
            { key: 'density', label: 'Density' },
            { key: 'Appearance', label: 'Appearance' },
            { key: 'appearance', label: 'Appearance' },
            { key: 'meltingPoint', label: 'Melting Point' },
            { key: 'Melting Point', label: 'Melting Point' },
            { key: 'boilingPoint', label: 'Boiling Point' },
            { key: 'Boiling Point', label: 'Boiling Point' },
            { key: 'Solubility', label: 'Solubility' },
            { key: 'solubility', label: 'Solubility' }
        ];

        basicFields.forEach(({ key, label }) => {
            if (chemical[key] && !processed.has(key)) {
                addText(`${label}: ${chemical[key]}`, 11, false);
                processed.add(key);
                yPosition += 2;
            }
        });
        yPosition += 5;

        // 2. Categories
        if (chemical.tags && Array.isArray(chemical.tags) && chemical.tags.length > 0) {
            addText(`Categories: ${chemical.tags.join(', ')}`, 11, false);
            processed.add('tags');
            yPosition += 5;
        }

        // 3. Detailed Sections
        const sections = [
            { keys: ['description', 'Description', 'Properties'], title: 'PROPERTIES & DESCRIPTION' },
            { keys: ['Hazard Information', 'hazards', 'Hazard Statements'], title: 'HAZARDS & SAFETY' },
            { keys: ['Handling & Storage', 'handling'], title: 'HANDLING & STORAGE' },
            { keys: ['Safety Notes', 'safety'], title: 'EMERGENCY & FIRST AID' },
            { keys: ['Lab Use Notes', 'lab_use'], title: 'LABORATORY USE' },
            { keys: ['SDS Link'], title: 'SDS REFERENCE' }
        ];

        sections.forEach(({ keys, title }) => {
            let contentFound = false;
            keys.forEach(key => {
                if (chemical[key] && !processed.has(key)) {
                    if (!contentFound) {
                        if (yPosition + 15 > pageHeight - margin) {
                            pdf.addPage();
                            yPosition = margin;
                        }
                        addText(title, 12, true);
                        yPosition += 2;
                        contentFound = true;
                    }
                    if (Array.isArray(chemical[key])) {
                        addText(chemical[key].join(', '), 10, false, 5);
                    } else {
                        addText(chemical[key], 10, false, 5);
                    }
                    processed.add(key);
                    yPosition += 3;
                }
            });
            if (contentFound) yPosition += 5;
        });

        // 4. Inventory
        if (chemical.inventory) {
            if (yPosition + 20 > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
            addText('INVENTORY STATUS', 12, true);
            yPosition += 2;
            const inv = chemical.inventory;
            if (inv.quantity !== undefined) addText(`Quantity: ${inv.quantity} ${inv.unit || ''}`, 10, false, 5);
            if (inv.location) addText(`Location: ${inv.location}`, 10, false, 5);
            processed.add('inventory');
            yPosition += 5;
        }

        // 5. Remaining Fields
        Object.keys(chemical).forEach(key => {
            if (processed.has(key)) return;
            const value = chemical[key];
            if (value === null || value === undefined || value === '') return;
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
            if (yPosition + 10 > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
            addText(label, 11, true);
            if (Array.isArray(value)) {
                value.forEach(item => addText(`- ${item}`, 10, false, 5));
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([k, v]) => {
                    if (v) addText(`${k}: ${v}`, 10, false, 5);
                });
            } else {
                addText(String(value), 10, false, 5);
            }
            yPosition += 4;
        });

        // Footer for each chemical's last page
        const totalPages = pdf.internal.getNumberOfPages();
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        // This footer will be on the last page of the current chemical's report
        pdf.text(`Page ${index + 1} - Generated ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    });

    pdf.save('chemicals_batch_export.pdf');
}

/**
 * Generate PDF for comparing multiple chemicals side-by-side
 * @param {Array} chemicals - Array of chemical objects to compare
 */
export function generateComparisonPDF(chemicals) {
    if (!chemicals || chemicals.length === 0) {
        alert('No chemicals to compare');
        return;
    }

    const pdf = new jsPDF('landscape'); // Use landscape for side-by-side comparison
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Header
    pdf.setFillColor(3, 105, 161);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Chemical Comparison (${chemicals.length} items)`, pageWidth / 2, 20, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
    yPosition = 40;

    // Properties to compare
    const properties = [
        { label: 'Chemical Name', key: 'name' },
        { label: 'Formula', key: 'formula' },
        { label: 'CAS Number', keys: ['casNumber', 'CAS'] },
        { label: 'Molecular Weight', keys: ['molecularWeight', 'Molecular Weight'] },
        { label: 'Density', key: 'density' },
        { label: 'Melting Point', keys: ['meltingPoint', 'Melting Point'] },
        { label: 'Boiling Point', keys: ['boilingPoint', 'Boiling Point'] },
        { label: 'Appearance', key: 'appearance' },
        { label: 'Hazards', key: 'hazards', isArray: true },
        { label: 'Inventory', key: 'inventory', isObject: true }
    ];

    // Calculate column width
    const labelColWidth = 50;
    const dataColWidth = (pageWidth - margin * 2 - labelColWidth) / chemicals.length;

    // Table headers
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, labelColWidth, 12, 'F');
    pdf.text('Property', margin + 2, yPosition + 8);

    chemicals.forEach((chem, idx) => {
        const x = margin + labelColWidth + (idx * dataColWidth);
        pdf.rect(x, yPosition, dataColWidth, 12, 'F');
        const chemName = sanitize(chem.name || chem['Chemical Name'] || `Chemical ${idx + 1}`);
        pdf.text(pdf.splitTextToSize(chemName, dataColWidth - 4)[0], x + 2, yPosition + 8);
    });
    yPosition += 12;

    // Draw table rows
    pdf.setFont('helvetica', 'normal');
    properties.forEach((prop) => {
        const rowHeight = prop.isArray || prop.isObject ? 20 : 12;

        // Check for page break
        if (yPosition + rowHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // Property label
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPosition, labelColWidth, rowHeight, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.text(prop.label, margin + 2, yPosition + 8);

        // Data cells
        pdf.setFont('helvetica', 'normal');
        chemicals.forEach((chem, idx) => {
            const x = margin + labelColWidth + (idx * dataColWidth);
            pdf.rect(x, yPosition, dataColWidth, rowHeight);

            let value = '-';
            if (prop.keys) {
                for (const key of prop.keys) {
                    if (chem[key]) {
                        value = chem[key];
                        break;
                    }
                }
            } else if (chem[prop.key]) {
                value = chem[prop.key];
            }

            if (prop.isArray && Array.isArray(value)) {
                const hazardText = value.slice(0, 3).join(', ');
                pdf.setFontSize(7);
                const lines = pdf.splitTextToSize(sanitize(hazardText), dataColWidth - 4);
                pdf.text(lines.slice(0, 2), x + 2, yPosition + 6);
                pdf.setFontSize(9);
            } else if (prop.isObject && typeof value === 'object') {
                pdf.setFontSize(7);
                const invText = value.quantity ? `${value.quantity} ${value.unit || ''}` : 'Not tracked';
                pdf.text(sanitize(invText), x + 2, yPosition + 6);
                if (value.location) {
                    pdf.text(sanitize(value.location), x + 2, yPosition + 11);
                }
                pdf.setFontSize(9);
            } else {
                const cellText = sanitize(String(value));
                const lines = pdf.splitTextToSize(cellText, dataColWidth - 4);
                pdf.text(lines[0], x + 2, yPosition + 8);
            }
        });

        yPosition += rowHeight;
    });

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    const filename = `chemical_comparison_${chemicals.length}_items.pdf`;
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
