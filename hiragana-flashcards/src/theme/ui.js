import React from 'react';

// --- SHARED CSS STYLES ---
export const globalStyles = `
  :root {
    --primary: #f43f5e;
    --primary-hover: #e11d48;
    --secondary: #6366f1;
    --accent: #f59e0b;
    --combo: #10b981;
    --minna: #0ea5e9;
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
    max-width: 100%;
    margin: 0 auto;
  }

  /* Typography */
  h1 { font-size: 2.5rem; margin-bottom: 0.5rem; text-align: center; }
  h2 { font-size: 1.2rem; display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
  .highlight { color: var(--primary); }
  .subtitle { text-align: center; color: var(--text-muted); margin-bottom: 40px; }
  
  /* Menu Grid */
  .menu-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    width: 100%;
    max-width: 600px;
  }
  
  .menu-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 30px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  
  .menu-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: var(--primary);
  }

  .menu-icon { margin-bottom: 15px; color: var(--primary); }
  .menu-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 8px; }
  .menu-desc { color: var(--text-muted); }

  /* Tab Navigation */
  .tab-container {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    background: white;
    padding: 5px;
    border-radius: 12px;
    border: 1px solid var(--border);
  }
  
  .tab-btn {
    padding: 10px 20px;
    border: none;
    background: none;
    border-radius: 8px;
    font-weight: bold;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tab-btn.active {
    background: var(--primary);
    color: white;
    shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  /* Selection Grid */
  .section-container { max-width: 800px; width: 100%; margin-bottom: 40px; }
  .section-header { display: flex; justify-content: space-between; align-items: center; }
  .pill { width: 6px; height: 24px; border-radius: 4px; display: inline-block; }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  .lesson-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
  }

  .lesson-btn {
    background: white;
    border: 1px solid var(--border);
    padding: 20px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-main);
  }
  .lesson-btn:hover { border-color: var(--minna); color: var(--minna); transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }

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
  .btn-back { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: bold; margin-bottom: 20px; align-self: flex-start; }
  .btn-back:hover { color: var(--text-main); }

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
    padding: 20px; text-align: center;
  }

  .card-face.back {
    background: var(--primary);
    color: white;
    transform: rotateY(180deg);
    border-color: var(--primary-hover);
  }

  .card-face.meaning-face {
    background: white;
    color: var(--text-main);
    border-color: var(--minna);
    transform: rotateY(0deg); /* Shows when flipped back to front */
  }

  .kana-large { font-size: 5rem; font-weight: 800; line-height: 1.2; margin-bottom: 2rem; color: var(--text-main); word-break: break-all;}
  .romaji-large { font-size: 3rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem; word-break: break-word;}
  
  .card-label { text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: auto; margin-top: 2rem; opacity: 0.7; }
  .card-hint { margin-top: auto; margin-bottom: 2rem; font-size: 0.9rem; opacity: 0.6; display: flex; align-items: center; gap: 5px; }

  .controls { width: 100%; display: flex; gap: 10px; }
  .keyboard-hint { margin-top: 20px; font-size: 0.9rem; color: var(--text-muted); opacity: 0.8; }
  .key-badge { background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; color: var(--text-main); border-bottom: 2px solid #cbd5e1; }
`;

// --- SHARED ICONS ---
export const Icons = {
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Refresh: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  ArrowRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Square: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>,
  ArrowLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  Layers: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
  Ghost: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 22v-3h6v3"></path><path d="M3 22v-3a9 9 0 0 1 18 0v3"></path><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle></svg>
};