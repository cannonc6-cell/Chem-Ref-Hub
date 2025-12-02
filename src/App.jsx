import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from './components/Footer.jsx';
import Nav from './components/Nav.jsx';
import BackToTop from './components/BackToTop.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import Chemicals from './pages/Chemicals.jsx';
import AddChemical from './pages/AddChemical.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Calculators from './pages/Calculators.jsx';
import Safety from './pages/Safety.jsx';
import Logbook from './pages/Logbook.jsx';
import ChemicalDetail from './pages/ChemicalDetail.jsx';
import About from './pages/About.jsx';
import FAQ from './pages/FAQ.jsx';
import Resources from './pages/Resources.jsx';
import Glossary from './pages/Glossary.jsx';
import NotFound from './pages/NotFound.jsx';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Search is now handled locally in Chemicals page
  const showSearch = false;

  // Global keyboard shortcuts: g+d/c/a/l for navigation
  useEffect(() => {
    let lastKey = null;

    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

      // Skip shortcuts while typing in form fields
      if (isTyping) return;

      // Sequence: g then another key within a short time window
      if (e.key.toLowerCase() === 'g') {
        lastKey = 'g';
        // reset after 1 second if no second key is pressed
        setTimeout(() => {
          if (lastKey === 'g') lastKey = null;
        }, 1000);
        return;
      }

      if (lastKey === 'g') {
        const key = e.key.toLowerCase();
        if (key === 'd') {
          e.preventDefault();
          navigate('/dashboard');
        } else if (key === 'c') {
          e.preventDefault();
          navigate('/chemicals');
        } else if (key === 'a') {
          e.preventDefault();
          navigate('/add-chemical');
        } else if (key === 'l') {
          e.preventDefault();
          navigate('/logbook');
        }
        lastKey = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav
        searchValue={search}
        onSearchChange={setSearch}
        showSearch={showSearch}
      />
      <main id="main-content" style={{ flex: 1, paddingTop: '70px' }}>
        <div className="container">
          <Breadcrumbs />
          {/* Lower nav bar removed as requested */}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chemicals" element={<Chemicals />} />
            <Route path="/chemicals/:id" element={<ChemicalDetail />} />
            <Route path="/add-chemical" element={<AddChemical />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/logbook" element={<Logbook />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
