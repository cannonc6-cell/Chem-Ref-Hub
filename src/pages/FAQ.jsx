import React, { useEffect, useState } from 'react';
import '../styles/modern.css';

export default function FAQ() {
  useEffect(() => {
    document.title = 'FAQ – ChemRef Hub';
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I add a new chemical?',
      answer: 'Go to Add Chemical, fill in at least Name and CAS (recommended), then save. It appears in the database immediately.'
    },
    {
      question: 'Where is my data stored?',
      answer: 'Your additions and preferences are saved in your browser\'s localStorage under keys like userChemicals and favoriteChemicals.'
    },
    {
      question: 'Can I import/export?',
      answer: 'Yes. On the Chemicals page, use Export to download JSON. Use Import to merge or replace with another JSON file.'
    },
    {
      question: 'Why don\'t some images load?',
      answer: 'We try JPG then PNG in public/chemical-images. If both fail, a placeholder logo is shown. Ensure filenames match chemical names.'
    },
    {
      question: 'Does it work when hosted in a subfolder (e.g., GitHub Pages)?',
      answer: 'Yes. The app respects the configured base URL for assets and data, and the deploy workflow sets it automatically.'
    },
    {
      question: 'Is this a replacement for SDS?',
      answer: 'No. Always consult official Safety Data Sheets and institutional policies before handling chemicals.'
    }
  ];

  return (
    <div className="app-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="section-title">Frequently Asked Questions</h1>
        </div>
        <p className="lead mb-0" style={{ position: 'relative', zIndex: 1, marginTop: 'var(--space-2)' }}>
          Find answers to common questions about ChemRef Hub
        </p>
      </div>

      <div className="data-table-container">
        {faqs.map((faq, index) => (
          <div key={index} className="accordion-item">
            <button
              className={`accordion-header ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <span className="accordion-icon">{openIndex === index ? '▲' : '▼'}</span>
            </button>
            <div className={`accordion-content ${openIndex === index ? 'active' : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
