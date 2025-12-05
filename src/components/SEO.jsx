import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 * Manages document head metadata for search engines and social sharing
 * 
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} image - Social share image URL
 * @param {string} url - Canonical URL
 * @param {string} type - Content type (website, article, etc.)
 */
function SEO({
    title,
    description = "A searchable chemical reference with safety context, a simple lab logbook, and inventory management for labs.",
    image = "/assets/logo.svg",
    url,
    type = "website"
}) {
    const siteTitle = "ChemRef Hub";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const currentUrl = url || window.location.href;
    const fullImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
        </Helmet>
    );
}

export default SEO;
