import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ArtisanProvider } from './contexts/ArtisanContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductInput from './pages/ProductInput';
import GeneratedContent from './pages/GeneratedContent';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <ArtisanProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<ProductInput />} />
              <Route path="/content/:id" element={<GeneratedContent />} />
            </Routes>
          </Layout>
        </Router>
      </ArtisanProvider>
    </LanguageProvider>
  );
}

export default App;