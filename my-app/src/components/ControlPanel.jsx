import React from 'react';
import { Loader2, Zap, Maximize2, Sparkles } from 'lucide-react';

const ControlPanel = ({ nComponents, setNComponents, dimensions, setDimensions, performPCA, loading, canAnalyze }) => (
  <div className="control-panel">
    <div className="control-group">
      <label className="control-label">
        <Zap className="control-icon" />
        Reconstruction Components
      </label>
      <input
        type="number"
        min="1"
        max="100"
        value={nComponents}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '') {
            setNComponents('');
          } else {
            const num = parseInt(val);
            if (!isNaN(num) && num >= 1 && num <= 100) {
              setNComponents(num);
            }
          }
        }}
        onBlur={() => {
          if (nComponents === '' || nComponents < 1) {
            setNComponents(10);
          }
        }}
        className="control-input"
        placeholder="1-100"
      />
    </div>

    <div className="control-group">
      <label className="control-label">
        <Maximize2 className="control-icon" />
        Visualization Mode
      </label>
      <div className="dimension-buttons">
        <button
          onClick={() => setDimensions(1)}
          className={`dimension-btn ${dimensions === 1 ? 'active' : ''}`}
        >
          1D
        </button>
        <button
          onClick={() => setDimensions(2)}
          className={`dimension-btn ${dimensions === 2 ? 'active' : ''}`}
        >
          2D
        </button>
        <button
          onClick={() => setDimensions(3)}
          className={`dimension-btn ${dimensions === 3 ? 'active' : ''}`}
        >
          3D
        </button>
      </div>
    </div>

    <div className="control-group action-group">
      <button
        onClick={performPCA}
        disabled={loading || !canAnalyze}
        className={`analyze-btn ${loading || !canAnalyze ? 'disabled' : ''}`}
      >
        {loading ? (
          <>
            <Loader2 className="btn-icon spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="btn-icon" />
            Run PCA Analysis
          </>
        )}
      </button>
    </div>
  </div>
);

export default ControlPanel;
