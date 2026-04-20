import React from 'react';
import { AlertTriangle } from 'lucide-react';

const WarningBanner = () => (
  <div className="warning-banner">
    <AlertTriangle className="warning-icon" />
    <span className="warning-text">
      <strong>Note:</strong> PCA works best with similar images. Random images may not show meaningful results. 
      We recommend using the provided datasets for clearer patterns.
    </span>

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
