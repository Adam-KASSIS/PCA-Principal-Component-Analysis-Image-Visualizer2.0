import React from 'react';

const VarianceInfo = ({ pcaData }) => {
  const dims = pcaData.metadata.visualization_dimensions;
  const total = pcaData.variance.explained_variance.slice(0, dims).reduce((a, b) => a + b, 0);
  
  return (
    <div className="variance-info">
      <div className="variance-title">Explained Variance</div>
      <div className="variance-chips">
        {pcaData.variance.explained_variance.slice(0, dims).map((v, i) => (
          <div key={i} className="variance-chip">
            <span className="variance-label">PC{i + 1}</span>
            <span className="variance-value">{(v * 100).toFixed(1)}%</span>
          </div>
        ))}
        <div className="variance-chip total">
          <span className="variance-label">Total</span>
          <span className="variance-value">{(total * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default VarianceInfo;
