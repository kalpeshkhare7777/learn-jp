import React, { useState } from 'react';
// Import the shared styles
import { globalStyles } from './theme/ui';

// Import the separate page components
import HomePage from './pages/HomePage';
import ScriptMaster from './pages/ScriptMaster';
import MinnaPage from './pages/MinnaPage';
import BlankPage from './pages/BlankPage';

export default function App() {
  // State to track which page is currently active
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'scripts', 'minna', 'blank'

  return (
    <>
      {/* Inject global CSS variables and basic resets */}
      <style>{globalStyles}</style>
      
      {/* Page Routing Logic */}
      {currentPage === 'home' && (
        <HomePage onNavigate={setCurrentPage} />
      )}
      
      {currentPage === 'scripts' && (
        <ScriptMaster onBack={() => setCurrentPage('home')} />
      )}
      
      {currentPage === 'minna' && (
        <MinnaPage onBack={() => setCurrentPage('home')} />
      )}
      
      {currentPage === 'blank' && (
        <BlankPage onBack={() => setCurrentPage('home')} />
      )}
    </>
  );
}