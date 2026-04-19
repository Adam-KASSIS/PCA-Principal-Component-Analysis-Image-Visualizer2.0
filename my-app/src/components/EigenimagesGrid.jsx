import React from 'react';
import { RefreshCw } from 'lucide-react';

const EigenimagesGrid = ({ eigenimages, nComponents }) => {
  const finalNComponents = nComponents === '' ? 10 : parseInt(nComponents);
  const displayCount = Math.min(eigenimages.length, finalNComponents);
  
  return (
    <section className="section-card">
      <div className="section-header">
        <div className="section-icon-wrapper">
          <RefreshCw className="section-icon" />
        </div>
        <div>
          <h2 className="section-title">Principal Components</h2>
          <p className="section-subtitle">Showing {displayCount} eigenimages representing main patterns of variation</p>
        </div>
      </div>
      <div className="eigenimage-grid-container">
        <div className="eigenimage-grid">
          {eigenimages.slice(0, displayCount).map((eigen) => (
            <div key={eigen.index} className="eigenimage-card">
              <img src={`data:image/png;base64,${eigen.image}`} alt={`PC${eigen.component}`} className="eigenimage" />
              <div className="eigenimage-info">
                <span className="eigenimage-label">PC{eigen.component}</span>
                <span className="eigenimage-variance">{(eigen.explained_variance * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EigenimagesGrid;
