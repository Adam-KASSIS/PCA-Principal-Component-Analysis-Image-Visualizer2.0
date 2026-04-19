import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const WarningBanner = () => (
  <div className="warning-banner">
    <AlertTriangle className="warning-icon" />
    <span className="warning-text">
      <strong>Note:</strong> PCA works best with similar images. Random images may not show meaningful results. 
      We recommend using the provided datasets for clearer patterns.
    </span>

    <div className="note-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <RefreshCw style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
        <h3 style={{ margin: 0 }}>Cold Start: Server Initialization</h3>
      </div>
      <p>
        When you first load this application or if datasets don't appear immediately, the backend server 
        may be starting up (this is called a "cold start"). Simply <strong>refresh the page 1-2 times</strong>{' '}
        to allow the server to fully initialize. After a few seconds, all datasets should be available.
      </p>
      <p style={{ fontSize: '0.9rem', color: '#a0a0a0', marginTop: '0.5rem' }}>
        This happens because the backend runs on a free tier service that puts the server to sleep when not in use. 
        The first request wakes it up, which takes a few seconds to complete.
      </p>
    </div>

    <div className="note-section">
        <h3>Similar Images (same class, like faces or handwritten digits)</h3>
        <p>
          PCA works very well. It finds directions of maximum variance in the
          dataset, which often correspond to meaningful patterns (eigenfaces,
          common strokes, etc.). Compression or dimensionality reduction is
          effective because images share structure.
        </p>
      </div>
      <div className="note-section">
        <h3>Random Images (very different content)</h3>
        <p>
          PCA still mathematically works, but the principal components will
          capture general variance across the whole dataset. The components
          might not be interpretable, and compression may be less meaningful
          because the images don't share patterns. You might need many more
          components to retain visual quality.
        </p>
      </div>
  </div>
);

export default WarningBanner;
