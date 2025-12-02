import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/modern.css';

function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on dashboard or if no path
    if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
        return null;
    }

    // Map route names to readable labels
    const routeNameMap = {
        'chemicals': 'Chemicals',
        'add-chemical': 'Add Chemical',
        'safety': 'Safety',
        'logbook': 'Logbook',
        'about': 'About',
        'faq': 'FAQ',
        'resources': 'Resources',
        'glossary': 'Glossary'
    };

    return (
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/dashboard">Home</Link>
                </li>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const name = routeNameMap[value] || decodeURIComponent(value);

                    return last ? (
                        <li className="breadcrumb-item active" aria-current="page" key={to}>
                            {name}
                        </li>
                    ) : (
                        <li className="breadcrumb-item" key={to}>
                            <Link to={to}>{name}</Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;
