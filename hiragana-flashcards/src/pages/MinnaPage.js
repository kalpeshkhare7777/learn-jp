import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Icons } from '../theme/ui';
import { MINNA_VOCAB_DATA } from '../data/minnaData';

// --- HELPER: Fisher-Yates Shuffle ---
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const MinnaPage = ({ onBack }) => {
  const [subSection, setSubSection] = useState('menu'); // 'menu' | 'vocabulary' | 'grammar'
  const [lesson, setLesson] = useState(null); // 1-24
  
  // Flashcard States for Vocab
  const [vocabCard, setVocabCard] = useState(null);
  const [vocabState, setVocabState] = useState(0); // 0=Kana, 1=Romaji, 2=Meaning
  
  // NEW: Deck state
  const [deck, setDeck] = useState([]);

  const lessonPool = useMemo(() => {
    if (subSection === 'vocabulary' && lesson) {
      return MINNA_VOCAB_DATA[lesson] || [];
    }
    return [];
  }, [subSection, lesson]);

  // --- NEW: Initialize Deck when Lesson Changes ---
  useEffect(() => {
    if (lessonPool.length > 0) {
      // Create a shuffled deck with 2 copies of each word
      const newDeck = shuffleArray([...lessonPool, ...lessonPool]);
      // Draw the first card immediately
      const firstCard = newDeck.pop();
      
      setDeck(newDeck);
      setVocabCard(firstCard);
      setVocabState(0);
    }
  }, [lessonPool]);

  // --- NEW: Smart Random Logic ---
  const pickRandomCard = useCallback(() => {
    setDeck(prevDeck => {
      let currentDeck = [...prevDeck];

      // If deck empty, regenerate (2x copies)
      if (currentDeck.length === 0) {
         if (lessonPool.length === 0) return [];
         currentDeck = shuffleArray([...lessonPool, ...lessonPool]);
         
         // Prevent immediate repeat
         if (vocabCard && currentDeck.length > 1 && currentDeck[currentDeck.length - 1].k === vocabCard.k) {
            const lastIdx = currentDeck.length - 1;
            [currentDeck[0], currentDeck[lastIdx]] = [currentDeck[lastIdx], currentDeck[0]];
         }
      }
      
      const nextCard = currentDeck.pop();
      
      setVocabState(0);
      setVocabCard(nextCard);
      
      return currentDeck;
    });
  }, [lessonPool, vocabCard]);

  // Main Action Logic: 0(Front) -> 1(Back/Romaji) -> 2(Front/Meaning) -> 0(New Card)
  const handleVocabAction = useCallback(() => {
    if (vocabState === 0) {
      setVocabState(1); // Flip to Romaji
    } else if (vocabState === 1) {
      setVocabState(2); // Flip back to Front (Meaning)
    } else {
      pickRandomCard(); // Next Card
    }
  }, [vocabState, pickRandomCard]);

  // Keyboard Listener
  useEffect(() => {
    if (lesson) {
      const handleKeyDown = (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          handleVocabAction();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lesson, handleVocabAction]);

  // RENDER: Menu
  if (subSection === 'menu') {
    return (
      <div className="app-container">
        <button onClick={onBack} className="btn-back"><Icons.ArrowLeft /> Back to Home</button>
        <h1 style={{color: '#0ea5e9'}}>Minna No <span style={{color: '#0f172a'}}>Nihongo</span></h1>
        <p className="subtitle">Select a category</p>

        <div className="menu-grid">
          <div className="menu-card" onClick={() => setSubSection('vocabulary')} style={{borderColor: '#0ea5e9'}}>
            <div className="menu-icon" style={{color: '#0ea5e9'}}><Icons.Book /></div>
            <div className="menu-title">Vocabulary</div>
            <div className="menu-desc">Words for Lessons 1-24</div>
          </div>
          <div className="menu-card" onClick={() => setSubSection('grammar')} style={{borderColor: '#6366f1'}}>
            <div className="menu-icon" style={{color: '#6366f1'}}><Icons.Layers /></div>
            <div className="menu-title">Grammar</div>
            <div className="menu-desc">Rules for Lessons 1-24</div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Lesson Selector
  if (!lesson) {
    return (
      <div className="app-container">
        <button onClick={() => setSubSection('menu')} className="btn-back"><Icons.ArrowLeft /> Back to Minna</button>
        <h1 style={{textTransform: 'capitalize'}}>{subSection}</h1>
        <p className="subtitle">Select a Lesson</p>

        {subSection === 'grammar' ? (
           <div style={{textAlign: 'center', marginTop: '50px', color: '#64748b'}}>
            <h2>Grammar Lessons Coming Soon!</h2>
          </div>
        ) : (
          <div className="section-container">
            <div className="lesson-grid">
              {[...Array(25)].map((_, i) => (
                <button 
                  key={i} 
                  className="lesson-btn"
                  onClick={() => setLesson(i + 1)}
                  disabled={!MINNA_VOCAB_DATA[i+1] && subSection === 'vocabulary'}
                  style={{opacity: (!MINNA_VOCAB_DATA[i+1] && subSection === 'vocabulary') ? 0.5 : 1}}
                >
                  Lesson {i + 1}
                </button>
              ))}
            </div>
            <p style={{textAlign:'center', marginTop:'20px', color:'#94a3b8', fontSize:'0.9rem'}}>* Lessons without data are disabled</p>
          </div>
        )}
      </div>
    );
  }

  // RENDER: Vocab Flashcard
  return (
    <div className="app-container">
      <div className="study-container">
        <div className="top-nav">
          <button onClick={() => setLesson(null)} className="nav-btn">
            <Icons.ArrowLeft /> Lessons
          </button>
          <span className="nav-btn" style={{cursor: 'default', fontWeight: 'bold', color: '#0ea5e9'}}>
            Lesson {lesson} • {deck.length + (vocabCard ? 1 : 0)} Left
          </span>
        </div>

        <div className="card-scene" onClick={handleVocabAction}>
          <div className={`card-object ${vocabState === 1 ? 'flipped' : ''}`}>
            
            {/* FRONT FACE (Dynamic) */}
            <div className={`card-face ${vocabState === 2 ? 'meaning-face' : 'front'}`}>
              <span className="card-label">
                {vocabState === 2 ? 'Meaning' : 'Vocabulary'}
              </span>
              <div className="kana-large" style={{fontSize: vocabState === 2 ? '3rem' : '4rem'}}>
                {vocabState === 2 ? vocabCard?.m : vocabCard?.k}
              </div>
              <div className="card-hint">
                 {vocabState === 2 ? <span>Tap / Space for Next <Icons.ArrowRight /></span> : <span>Tap / Space to flip <Icons.Refresh /></span>}
              </div>
            </div>

            {/* BACK FACE (Romaji) */}
            <div className="card-face back" style={{background: '#0ea5e9', borderColor: '#0284c7'}}>
              <span className="card-label" style={{color: 'rgba(255,255,255,0.8)'}}>Romaji</span>
              <div className="romaji-large">{vocabCard?.r}</div>
              <div className="card-hint" style={{color: 'rgba(255,255,255,0.8)'}}>Tap / Space for Meaning <Icons.Refresh /></div>
            </div>
          
          </div>
        </div>

        <div className="controls">
          <button onClick={handleVocabAction} className="btn-next btn-secondary" style={{width: '100%', background: '#0f172a'}}>
            {vocabState === 2 ? 'Next Card' : 'Flip'} <Icons.ArrowRight />
          </button>
        </div>
        
        <div className="keyboard-hint">
          Press <span className="key-badge">Space</span> to Interact
        </div>
      </div>
    </div>
  );
};

export default MinnaPage;