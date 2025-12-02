import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Footer from './components/Footer.jsx';
import Nav from './components/Nav.jsx';
import Chemicals from './pages/Chemicals.jsx';
import AddChemical from './pages/AddChemical.jsx';
import Dashboard from './pages/Dashboard.jsx';
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
  const [search, setSearch] = useState("");

  // Show search in navbar only on Chemicals page
  const showSearch = location.pathname === '/chemicals';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav
        searchValue={search}
        onSearchChange={setSearch}
        showSearch={showSearch}
      />
      <main id="main-content" style={{ flex: 1, paddingTop: '70px' }}>
        <div className="container">
          {/* Lower nav bar removed as requested */}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chemicals" element={<Chemicals searchFromNav={search} />} />
            <Route path="/chemicals/:id" element={<ChemicalDetail />} />
            <Route path="/add-chemical" element={<AddChemical />} />
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
