import React from 'react';
import { Icons } from '../theme/ui';

const BlankPage = ({ onBack }) => (
  <div className="app-container">
    <button onClick={onBack} className="btn-back"><Icons.ArrowLeft /> Back to Home</button>
    <div style={{marginTop: '50px', textAlign: 'center'}}>
      <h1>Extra Resources</h1>
      <p className="subtitle">This page is currently empty.</p>
    </div>
  </div>
);

export default BlankPage;