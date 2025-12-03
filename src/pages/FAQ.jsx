import React, { useEffect, useState } from 'react';

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
      answer: 'Go to the "Add Chemical" page from the sidebar. Fill in at least the Chemical Name and CAS Number (recommended), then click "Save Chemical". It will appear in your database immediately.'
    },
    {
      question: 'Where is my data stored?',
      answer: 'Your additions, settings, and preferences are saved locally in your browser\'s storage (localStorage). No external servers or accounts are required.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes. On the Chemicals page, you can use the "Export" feature to download your entire chemical inventory as a JSON file, which can be used for backup or transfer.'
    },
    {
      question: 'Why don\'t some chemical images load?',
      answer: 'The system attempts to load images from the public library based on the chemical name. If an image isn\'t found, a placeholder structure image is displayed instead.'
    },
    {
      question: 'Is this a replacement for official Safety Data Sheets (SDS)?',
      answer: 'No. ChemRef Hub is a quick reference tool. Always consult official Safety Data Sheets (SDS) and your institution\'s safety policies before handling any chemicals.'
    },
    {
      question: 'How do I report a bug or suggest a feature?',
      answer: 'This is an open-source project. You can report issues or suggest features on the project repository or contact the administrator.'
    }
  ];

  return (
    <div className="faq-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Answers to common questions about using ChemRef Hub.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => toggleAccordion(index)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              {faq.question}
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform var(--transition-fast)',
                  color: 'var(--text-tertiary)'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openIndex === index && (
              <div style={{
                padding: '0 1.25rem 1.25rem 1.25rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                borderTop: '1px solid var(--border-light)'
              }}>
                <div style={{ paddingTop: '1rem' }}>
                  {faq.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
