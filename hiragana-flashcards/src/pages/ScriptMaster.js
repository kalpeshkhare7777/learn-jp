import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Icons } from '../theme/ui';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/scriptsData';

// --- HELPER: Fisher-Yates Shuffle ---
// Ensures a perfectly random shuffle of the deck
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Helper component for selection row
const SelectionRow = ({ label, isSelected, onToggle, preview }) => (
  <div 
    onClick={onToggle}
    className={`selection-row ${isSelected ? 'selected' : ''}`}
  >
    <div className="row-label">
      {isSelected ? (
        <span style={{color: '#f43f5e'}}><Icons.Check /></span>
      ) : (
        <span style={{color: '#cbd5e1'}}><Icons.Square /></span>
      )}
      <span>{label}</span>
    </div>
    <span className="row-preview">{preview}</span>
  </div>
);

const ScriptMaster = ({ onBack }) => {
  const [scriptType, setScriptType] = useState('hiragana'); 
  const [mode, setMode] = useState('selection'); 
  const [selectedRowIds, setSelectedRowIds] = useState(['row-a', 'row-ka']);
  
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // NEW: Deck state to track remaining cards in the cycle
  // eslint-disable-next-line
  const [deck, setDeck] = useState([]);

  // Get current dataset
  const currentData = useMemo(() => {
    if (scriptType === 'hiragana') return HIRAGANA_DATA;
    if (scriptType === 'katakana') return KATAKANA_DATA;
    return null; 
  }, [scriptType]);

  // Pool Logic (Source of Truth)
  const activePool = useMemo(() => {
    if (!currentData) return [];
    let pool = [];
    [...currentData.basic, ...currentData.dakuten, ...currentData.handakuten, ...currentData.combination].forEach(row => {
      if (selectedRowIds.includes(row.id)) pool = [...pool, ...row.chars];
    });
    return pool;
  }, [selectedRowIds, currentData]);

  // --- NEW: Smart Card Selection Logic ---
  const pickRandomCard = useCallback(() => {
    setDeck(prevDeck => {
      let currentDeck = [...prevDeck];

      // If deck is empty, regenerate it (2 copies of every selected card)
      if (currentDeck.length === 0) {
        if (activePool.length === 0) return [];
        // Create deck with 2 copies of each card
        currentDeck = shuffleArray([...activePool, ...activePool]);
        
        // UX: Try to prevent the new card from being the same as the last one shown
        if (currentCard && currentDeck.length > 1 && currentDeck[currentDeck.length - 1].k === currentCard.k) {
           // Swap the top card with the bottom card
           const lastIdx = currentDeck.length - 1;
           [currentDeck[0], currentDeck[lastIdx]] = [currentDeck[lastIdx], currentDeck[0]];
        }
      }

      // Draw the top card
      const nextCard = currentDeck.pop();

      setIsFlipped(false);
      setTimeout(() => setCurrentCard(nextCard), 150);
      
      return currentDeck; // Update state with remaining deck
    });
  }, [activePool, currentCard]);

  const handleMainAction = useCallback(() => {
    if (isFlipped) pickRandomCard();
    else setIsFlipped(true);
  }, [isFlipped, pickRandomCard]);

  // Start Session: Initialize the deck
  const startSession = () => {
    if (selectedRowIds.length === 0) return;
    
    // Generate fresh deck: 2x copies of active pool, shuffled
    const newDeck = shuffleArray([...activePool, ...activePool]);
    const firstCard = newDeck.pop(); // Draw first card
    
    setDeck(newDeck);
    setCurrentCard(firstCard);
    setIsFlipped(false);
    setMode('study');
  };

  // Handle Tab Switch
  const switchTab = (tab) => {
    setScriptType(tab);
    setMode('selection');
    setSelectedRowIds(['row-a', 'row-ka']); 
  };

  // Keyboard Listener
  useEffect(() => {
    if (mode !== 'study') return;
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleMainAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, handleMainAction]);

  const toggleRow = (id) => {
    setSelectedRowIds(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleCategory = (key) => {
    if (!currentData) return;
    const ids = currentData[key].map(r => r.id);
    const allSelected = ids.every(id => selectedRowIds.includes(id));
    setSelectedRowIds(prev => allSelected ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
  };

  // Render Kanji Placeholder
  if (scriptType === 'kanji') {
    return (
      <div className="app-container">
        <button onClick={onBack} className="btn-back"><Icons.ArrowLeft /> Back to Home</button>
        <div className="section-container">
          <div className="tab-container">
            <button className={`tab-btn ${scriptType === 'hiragana' ? 'active' : ''}`} onClick={() => switchTab('hiragana')}>Hiragana</button>
            <button className={`tab-btn ${scriptType === 'katakana' ? 'active' : ''}`} onClick={() => switchTab('katakana')}>Katakana</button>
            <button className={`tab-btn ${scriptType === 'kanji' ? 'active' : ''}`} onClick={() => switchTab('kanji')}>Kanji</button>
          </div>
          <div style={{textAlign: 'center', marginTop: '50px', color: '#64748b'}}>
            <h2>Kanji Mode Coming Soon!</h2>
            <p>We are working on adding Kanji flashcards.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Selection or Study Mode
  return (
    <div className="app-container">
      {mode === 'selection' ? (
        <div className="section-container">
          <button onClick={onBack} className="btn-back"><Icons.ArrowLeft /> Back to Home</button>
          
          <header style={{marginBottom: '20px'}}>
            <h1>Script<span className="highlight">Master</span></h1>
          </header>

          <div className="tab-container">
            <button className={`tab-btn ${scriptType === 'hiragana' ? 'active' : ''}`} onClick={() => switchTab('hiragana')}>Hiragana</button>
            <button className={`tab-btn ${scriptType === 'katakana' ? 'active' : ''}`} onClick={() => switchTab('katakana')}>Katakana</button>
            <button className={`tab-btn ${scriptType === 'kanji' ? 'active' : ''}`} onClick={() => switchTab('kanji')}>Kanji</button>
          </div>

          <p className="subtitle">Select {scriptType} rows to study</p>

          {/* Basic */}
          <div style={{marginBottom: '30px'}}>
            <div className="section-header" style={{marginBottom: '15px'}}>
              <h2><span className="pill" style={{background: '#f43f5e'}}></span>Basic</h2>
              <button onClick={() => toggleCategory('basic')} className="btn-text">Toggle All</button>
            </div>
            <div className="grid">
              {currentData.basic.map(row => (
                <SelectionRow 
                  key={row.id} label={row.label} preview={row.chars.map(c => c.k).join(' ')}
                  isSelected={selectedRowIds.includes(row.id)} onToggle={() => toggleRow(row.id)}
                />
              ))}
            </div>
          </div>

          {/* Dakuten */}
          <div style={{marginBottom: '30px'}}>
            <div className="section-header" style={{marginBottom: '15px'}}>
              <h2><span className="pill" style={{background: '#6366f1'}}></span>Voiced</h2>
              <button onClick={() => toggleCategory('dakuten')} className="btn-text" style={{color: '#6366f1'}}>Toggle All</button>
            </div>
            <div className="grid">
              {currentData.dakuten.map(row => (
                <SelectionRow 
                  key={row.id} label={row.label} preview={row.chars.map(c => c.k).join(' ')}
                  isSelected={selectedRowIds.includes(row.id)} onToggle={() => toggleRow(row.id)}
                />
              ))}
            </div>
          </div>

          {/* Handakuten */}
          <div style={{marginBottom: '30px'}}>
              <div className="section-header" style={{marginBottom: '15px'}}>
              <h2><span className="pill" style={{background: '#f59e0b'}}></span>Semi-Voiced</h2>
              <button onClick={() => toggleCategory('handakuten')} className="btn-text" style={{color: '#f59e0b'}}>Toggle All</button>
            </div>
            <div className="grid">
              {currentData.handakuten.map(row => (
                <SelectionRow 
                  key={row.id} label={row.label} preview={row.chars.map(c => c.k).join(' ')}
                  isSelected={selectedRowIds.includes(row.id)} onToggle={() => toggleRow(row.id)}
                />
              ))}
            </div>
          </div>

          {/* Combinations */}
          <div style={{marginBottom: '100px'}}>
              <div className="section-header" style={{marginBottom: '15px'}}>
              <h2><span className="pill" style={{background: '#10b981'}}></span>Combinations</h2>
              <button onClick={() => toggleCategory('combination')} className="btn-text" style={{color: '#10b981'}}>Toggle All</button>
            </div>
            <div className="grid">
              {currentData.combination.map(row => (
                <SelectionRow 
                  key={row.id} label={row.label} preview={row.chars.map(c => c.k).join(' ')}
                  isSelected={selectedRowIds.includes(row.id)} onToggle={() => toggleRow(row.id)}
                />
              ))}
            </div>
          </div>

          <div className="fab-bar">
            <button onClick={startSession} disabled={selectedRowIds.length === 0} className="btn-primary">
              Start Studying ({activePool.length}) <Icons.ArrowRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="study-container">
          <div className="top-nav">
            <button onClick={() => setMode('selection')} className="nav-btn">
              <Icons.Settings /> Configure
            </button>
            <span className="nav-btn" style={{cursor: 'default', fontWeight: 'bold'}}>
              {activePool.length} Cards
            </span>
          </div>

          <div className="card-scene" onClick={handleMainAction}>
            <div className={`card-object ${isFlipped ? 'flipped' : ''}`}>
              <div className="card-face front">
                <span className="card-label">{scriptType}</span>
                <div className="kana-large">{currentCard?.k}</div>
                <div className="card-hint">Tap / Space to flip <Icons.Refresh /></div>
              </div>
              <div className="card-face back">
                <span className="card-label" style={{color: 'rgba(255,255,255,0.8)'}}>Romaji</span>
                <div className="romaji-large">{currentCard?.r}</div>
                <div className="card-hint" style={{color: 'rgba(255,255,255,0.8)'}}>Tap / Space for Next Card <Icons.ArrowRight /></div>
              </div>
            </div>
          </div>

          <div className="controls">
            <button onClick={handleMainAction} className="btn-next btn-secondary" style={{width: '100%'}}>
              {isFlipped ? 'Next Card' : 'Flip'} <Icons.ArrowRight />
            </button>
          </div>
          
          <div className="keyboard-hint">
            Press <span className="key-badge">Space</span> to Flip / Next
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptMaster;