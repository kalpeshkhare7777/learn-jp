import React from 'react';
import { Icons } from '../theme/ui';

const HomePage = ({ onNavigate }) => (
  <div className="app-container" style={{justifyContent: 'center'}}>
    <header style={{marginBottom: '50px'}}>
      <h1>Learn<span className="highlight">Japanese</span></h1>
      <p className="subtitle">Choose your learning path</p>
    </header>

    <div className="menu-grid">
      <div className="menu-card" onClick={() => onNavigate('scripts')}>
        <div className="menu-icon"><Icons.Book /></div>
        <div className="menu-title">Script Master</div>
        <div className="menu-desc">Hiragana, Katakana & Kanji Flashcards</div>
      </div>

      <div className="menu-card" onClick={() => onNavigate('minna')}>
        <div className="menu-icon"><Icons.Layers /></div>
        <div className="menu-title">Minna No Nihongo</div>
        <div className="menu-desc">Vocabulary & Grammar Flashcards</div>
      </div>

      <div className="menu-card" onClick={() => onNavigate('blank')}>
        <div className="menu-icon"><Icons.Ghost /></div>
        <div className="menu-title">Coming Soon</div>
        <div className="menu-desc">Extra resources and tools</div>
      </div>
    </div>
  </div>
);

export default HomePage;