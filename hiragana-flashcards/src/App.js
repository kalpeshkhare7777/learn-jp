import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- INLINE CSS STYLES ---
const styles = `
  :root {
    --primary: #f43f5e;
    --primary-hover: #e11d48;
    --secondary: #6366f1;
    --accent: #f59e0b;
    --combo: #10b981;
    --bg-color: #f8fafc;
    --card-bg: #ffffff;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-main);
  }

  .app-container {
    min-height: 100vh;
    padding: 20px;
    padding-bottom: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Typography */
  h1 { font-size: 2.5rem; margin-bottom: 0.5rem; text-align: center; }
  h2 { font-size: 1.2rem; display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
  .highlight { color: var(--primary); }
  .subtitle { text-align: center; color: var(--text-muted); margin-bottom: 40px; }
  
  /* Selection Grid */
  .section-container { max-width: 800px; width: 100%; margin-bottom: 40px; }
  .section-header { display: flex; justify-content: space-between; align-items: center; }
  .pill { width: 6px; height: 24px; border-radius: 4px; display: inline-block; }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  .selection-row {
    background: var(--card-bg);
    border: 1px solid var(--border);
    padding: 15px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .selection-row:hover { border-color: var(--primary); background: #fff1f2; }
  .selection-row.selected { background: #fff1f2; border-color: var(--primary); }
  .row-label { display: flex; align-items: center; gap: 10px; font-weight: 600; }
  .row-preview { color: var(--text-muted); font-size: 0.9rem; }

  /* Buttons */
  .btn-text { background: none; border: none; color: var(--primary); font-weight: bold; cursor: pointer; padding: 5px 10px; border-radius: 20px; }
  .btn-text:hover { background: #fff1f2; }

  .fab-bar {
    position: fixed; bottom: 0; left: 0; width: 100%;
    background: white; border-top: 1px solid var(--border);
    padding: 20px; display: flex; justify-content: center;
    box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
    z-index: 100;
  }

  .btn-primary {
    background: var(--primary); color: white;
    border: none; padding: 16px 40px;
    border-radius: 12px; font-size: 1.1rem; font-weight: bold;
    cursor: pointer; display: flex; align-items: center; gap: 10px;
    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
    transition: transform 0.2s;
    width: 100%; max-width: 400px; justify-content: center;
  }
  .btn-primary:disabled { background: var(--border); color: var(--text-muted); cursor: not-allowed; box-shadow: none; }
  .btn-primary:not(:disabled):hover { background: var(--primary-hover); transform: translateY(-2px); }

  .btn-secondary {
    background: var(--text-main); color: white;
    border: none; padding: 15px; border-radius: 12px;
    font-weight: bold; font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: transform 0.1s;
  }
  .btn-secondary:active { transform: scale(0.98); }

  /* Flashcard 3D Flip */
  .study-container { width: 100%; max-width: 400px; display: flex; flex-direction: column; align-items: center; }
  .top-nav { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  .nav-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 1rem; }
  .nav-btn:hover { color: var(--text-main); }
  
  .card-scene {
    width: 100%; aspect-ratio: 3/4;
    perspective: 1000px; cursor: pointer;
    margin-bottom: 30px;
  }

  .card-object {
    width: 100%; height: 100%;
    position: relative;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .card-object.flipped { transform: rotateY(180deg); }

  .card-face {
    position: absolute; width: 100%; height: 100%;
    backface-visibility: hidden;
    border-radius: 24px;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    background: white; border: 2px solid #f1f5f9;
  }

  .card-face.back {
    background: var(--primary);
    color: white;
    transform: rotateY(180deg);
    border-color: var(--primary-hover);
  }

  .kana-large { font-size: 8rem; font-weight: 800; line-height: 1; margin-bottom: 2rem; color: var(--text-main); }
  .romaji-large { font-size: 5rem; font-weight: 800; line-height: 1; margin-bottom: 1rem; }
  
  .card-label { text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: auto; margin-top: 2rem; opacity: 0.7; }
  .card-hint { margin-top: auto; margin-bottom: 2rem; font-size: 0.9rem; opacity: 0.6; display: flex; align-items: center; gap: 5px; }

  .controls { width: 100%; display: flex; gap: 10px; }
  .keyboard-hint { margin-top: 20px; font-size: 0.9rem; color: var(--text-muted); opacity: 0.8; }
  .key-badge { background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; color: var(--text-main); border-bottom: 2px solid #cbd5e1; }
`;

// --- ICONS (Inline SVGs) ---
const Icons = {
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Refresh: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  ArrowRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Square: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>,
};

// --- DATA ---
const HIRAGANA_DATA = {
  basic: [
    { id: 'row-a', label: 'A (あ)', chars: [{ k: 'あ', r: 'a' }, { k: 'い', r: 'i' }, { k: 'う', r: 'u' }, { k: 'え', r: 'e' }, { k: 'お', r: 'o' }] },
    { id: 'row-ka', label: 'Ka (か)', chars: [{ k: 'か', r: 'ka' }, { k: 'き', r: 'ki' }, { k: 'く', r: 'ku' }, { k: 'け', r: 'ke' }, { k: 'こ', r: 'ko' }] },
    { id: 'row-sa', label: 'Sa (さ)', chars: [{ k: 'さ', r: 'sa' }, { k: 'し', r: 'shi' }, { k: 'す', r: 'su' }, { k: 'せ', r: 'se' }, { k: 'そ', r: 'so' }] },
    { id: 'row-ta', label: 'Ta (た)', chars: [{ k: 'た', r: 'ta' }, { k: 'ち', r: 'chi' }, { k: 'つ', r: 'tsu' }, { k: 'て', r: 'te' }, { k: 'と', r: 'to' }] },
    { id: 'row-na', label: 'Na (な)', chars: [{ k: 'な', r: 'na' }, { k: 'に', r: 'ni' }, { k: 'ぬ', r: 'nu' }, { k: 'ね', r: 'ne' }, { k: 'の', r: 'no' }] },
    { id: 'row-ha', label: 'Ha (は)', chars: [{ k: 'は', r: 'ha' }, { k: 'ひ', r: 'hi' }, { k: 'ふ', r: 'fu' }, { k: 'へ', r: 'he' }, { k: 'ほ', r: 'ho' }] },
    { id: 'row-ma', label: 'Ma (ま)', chars: [{ k: 'ま', r: 'ma' }, { k: 'み', r: 'mi' }, { k: 'む', r: 'mu' }, { k: 'め', r: 'me' }, { k: 'も', r: 'mo' }] },
    { id: 'row-ya', label: 'Ya (や)', chars: [{ k: 'や', r: 'ya' }, { k: 'ゆ', r: 'yu' }, { k: 'よ', r: 'yo' }] },
    { id: 'row-ra', label: 'Ra (ら)', chars: [{ k: 'ら', r: 'ra' }, { k: 'り', r: 'ri' }, { k: 'る', r: 'ru' }, { k: 'れ', r: 're' }, { k: 'ろ', r: 'ro' }] },
    { id: 'row-wa', label: 'Wa (わ)', chars: [{ k: 'わ', r: 'wa' }, { k: 'を', r: 'wo' }] },
    { id: 'row-n', label: 'N (ん)', chars: [{ k: 'ん', r: 'n' }] },
  ],
  dakuten: [
    { id: 'row-ga', label: 'Ga (が)', chars: [{ k: 'が', r: 'ga' }, { k: 'ぎ', r: 'gi' }, { k: 'ぐ', r: 'gu' }, { k: 'げ', r: 'ge' }, { k: 'ご', r: 'go' }] },
    { id: 'row-za', label: 'Za (ざ)', chars: [{ k: 'ざ', r: 'za' }, { k: 'じ', r: 'ji' }, { k: 'ず', r: 'zu' }, { k: 'ぜ', r: 'ze' }, { k: 'ぞ', r: 'zo' }] },
    { id: 'row-da', label: 'Da (だ)', chars: [{ k: 'だ', r: 'da' }, { k: 'ぢ', r: 'ji' }, { k: 'づ', r: 'zu' }, { k: 'で', r: 'de' }, { k: 'ど', r: 'do' }] },
    { id: 'row-ba', label: 'Ba (ば)', chars: [{ k: 'ば', r: 'ba' }, { k: 'び', r: 'bi' }, { k: 'ぶ', r: 'bu' }, { k: 'べ', r: 'be' }, { k: 'ぼ', r: 'bo' }] },
  ],
  handakuten: [
    { id: 'row-pa', label: 'Pa (ぱ)', chars: [{ k: 'ぱ', r: 'pa' }, { k: 'ぴ', r: 'pi' }, { k: 'ぷ', r: 'pu' }, { k: 'ぺ', r: 'pe' }, { k: 'ぽ', r: 'po' }] },
  ],
  combination: [
    { id: 'row-kya', label: 'Kya (きゃ)', chars: [{ k: 'きゃ', r: 'kya' }, { k: 'きゅ', r: 'kyu' }, { k: 'きょ', r: 'kyo' }] },
    { id: 'row-sha', label: 'Sha (しゃ)', chars: [{ k: 'しゃ', r: 'sha' }, { k: 'しゅ', r: 'shu' }, { k: 'しょ', r: 'sho' }] },
    { id: 'row-cha', label: 'Cha (ちゃ)', chars: [{ k: 'ちゃ', r: 'cha' }, { k: 'ちゅ', r: 'chu' }, { k: 'ちょ', r: 'cho' }] },
    { id: 'row-nya', label: 'Nya (にゃ)', chars: [{ k: 'にゃ', r: 'nya' }, { k: 'にゅ', r: 'nyu' }, { k: 'にょ', r: 'nyo' }] },
    { id: 'row-hya', label: 'Hya (ひゃ)', chars: [{ k: 'ひゃ', r: 'hya' }, { k: 'ひゅ', r: 'hyu' }, { k: 'ひょ', r: 'hyo' }] },
    { id: 'row-mya', label: 'Mya (みゃ)', chars: [{ k: 'みゃ', r: 'mya' }, { k: 'みゅ', r: 'myu' }, { k: 'みょ', r: 'myo' }] },
    { id: 'row-rya', label: 'Rya (りゃ)', chars: [{ k: 'りゃ', r: 'rya' }, { k: 'りゅ', r: 'ryu' }, { k: 'りょ', r: 'ryo' }] },
    { id: 'row-gya', label: 'Gya (ぎゃ)', chars: [{ k: 'ぎゃ', r: 'gya' }, { k: 'ぎゅ', r: 'gyu' }, { k: 'ぎょ', r: 'gyo' }] },
    { id: 'row-ja', label: 'Ja (じゃ)', chars: [{ k: 'じゃ', r: 'ja' }, { k: 'じゅ', r: 'ju' }, { k: 'じょ', r: 'jo' }] },
    { id: 'row-bya', label: 'Bya (びゃ)', chars: [{ k: 'びゃ', r: 'bya' }, { k: 'びゅ', r: 'byu' }, { k: 'びょ', r: 'byo' }] },
    { id: 'row-pya', label: 'Pya (ぴゃ)', chars: [{ k: 'ぴゃ', r: 'pya' }, { k: 'ぴゅ', r: 'pyu' }, { k: 'ぴょ', r: 'pyo' }] },
  ]
};

// --- COMPONENTS ---
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

export default function App() {
  const [mode, setMode] = useState('selection'); 
  const [selectedRowIds, setSelectedRowIds] = useState(['row-a', 'row-ka']);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Pool Logic
  const activePool = useMemo(() => {
    let pool = [];
    [...HIRAGANA_DATA.basic, ...HIRAGANA_DATA.dakuten, ...HIRAGANA_DATA.handakuten, ...HIRAGANA_DATA.combination].forEach(row => {
      if (selectedRowIds.includes(row.id)) pool = [...pool, ...row.chars];
    });
    return pool;
  }, [selectedRowIds]);

  // Pick new card (Reset Flip)
  const pickRandomCard = useCallback(() => {
    if (activePool.length === 0) return;
    let nextCard;
    do {
      const randomIndex = Math.floor(Math.random() * activePool.length);
      nextCard = activePool[randomIndex];
    } while (activePool.length > 1 && nextCard === currentCard);

    setIsFlipped(false);
    setTimeout(() => setCurrentCard(nextCard), 150);
  }, [activePool, currentCard]);

  // Handle Main Action: Flip if front, Next if back
  const handleMainAction = useCallback(() => {
    if (isFlipped) {
      // If already flipped (showing answer), go to next
      pickRandomCard();
    } else {
      // If showing question, flip to answer
      setIsFlipped(true);
    }
  }, [isFlipped, pickRandomCard]);

  // Keyboard Listener (Spacebar)
  useEffect(() => {
    if (mode !== 'study') return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Stop scrolling
        handleMainAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, handleMainAction]);

  const startSession = () => {
    if (selectedRowIds.length === 0) return;
    pickRandomCard();
    setMode('study');
  };

  const toggleRow = (id) => {
    setSelectedRowIds(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleCategory = (key) => {
    const ids = HIRAGANA_DATA[key].map(r => r.id);
    const allSelected = ids.every(id => selectedRowIds.includes(id));
    setSelectedRowIds(prev => allSelected ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
  };

  // RENDER
  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        
        {mode === 'selection' ? (
          <div className="section-container">
            <header style={{marginBottom: '40px'}}>
              <h1>Hiragana<span className="highlight">Master</span></h1>
              <p className="subtitle">Select rows to study</p>
            </header>

            {/* Basic */}
            <div style={{marginBottom: '30px'}}>
              <div className="section-header" style={{marginBottom: '15px'}}>
                <h2><span className="pill" style={{background: '#f43f5e'}}></span>Basic</h2>
                <button onClick={() => toggleCategory('basic')} className="btn-text">Toggle All</button>
              </div>
              <div className="grid">
                {HIRAGANA_DATA.basic.map(row => (
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
                {HIRAGANA_DATA.dakuten.map(row => (
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
                {HIRAGANA_DATA.handakuten.map(row => (
                  <SelectionRow 
                    key={row.id} label={row.label} preview={row.chars.map(c => c.k).join(' ')}
                    isSelected={selectedRowIds.includes(row.id)} onToggle={() => toggleRow(row.id)}
                  />
                ))}
              </div>
            </div>

            {/* Combinations (Yoon) */}
            <div style={{marginBottom: '100px'}}>
               <div className="section-header" style={{marginBottom: '15px'}}>
                <h2><span className="pill" style={{background: '#10b981'}}></span>Combinations (Yoon)</h2>
                <button onClick={() => toggleCategory('combination')} className="btn-text" style={{color: '#10b981'}}>Toggle All</button>
              </div>
              <div className="grid">
                {HIRAGANA_DATA.combination.map(row => (
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
                  <span className="card-label">Hiragana</span>
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
    </>
  );
}