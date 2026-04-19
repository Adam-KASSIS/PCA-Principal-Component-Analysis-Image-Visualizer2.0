import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => (
  <header className="header">
    <div className="header-container">
      <div className="header-content">
        <Sparkles className="header-icon" />
        <div>
          <h1 className="header-title">PCA Visualizer</h1>
          <p className="header-subtitle">Discover The Hidden Structure In Your Data</p>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
