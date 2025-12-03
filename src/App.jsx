import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import BackToTop from './components/BackToTop.jsx';
import './styles/sidebar-navigation.css';
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
import UserProfile from './pages/UserProfile.jsx';
import { Toaster } from 'react-hot-toast';

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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100% - var(--sidebar-width))', // Ensure width is correct
        marginTop: 0 // Explicitly remove top margin
      }}>
        <Nav
          searchValue={search}
          onSearchChange={setSearch}
          showSearch={showSearch}
        />
        <main id="main-content" style={{ flex: 1, padding: '2rem' }}>
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
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
            },
            success: {
              iconTheme: {
                primary: 'var(--success-color, #10b981)',
                secondary: 'white',
              },
            },
          }}
        />
      </div>
    </div>
  );
}

function App() {
  // Main App Component
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
