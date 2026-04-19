import React from 'react';
import { Eye, X } from 'lucide-react';

const ImageComparison = ({ index, pcaData, nComponents, onClose }) => {
  console.log('ImageComparison render - index:', index, 'pcaData:', pcaData);
  
  if (index === null || index === undefined || !pcaData) {
    console.log('Early return: missing index or pcaData');
    return null;
  }
  if (!pcaData.original_images || !pcaData.reconstructed_images) {
    console.log('Early return: missing image arrays');
    return null;
  }
  if (index < 0 || index >= pcaData.original_images.length) {
    console.log('Early return: index out of bounds');
    return null;
  }

  const original = pcaData.original_images[index];
  const reconstructed = pcaData.reconstructed_images[index];

  console.log('Original:', original, 'Reconstructed:', reconstructed);

  if (!original || !reconstructed) {
    console.log('Early return: missing original or reconstructed');
    return null;
  }

  return (
    <section className="section-card" style={{ 
      marginTop: '2rem', 
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', 
      border: '2px solid rgba(139, 92, 246, 0.3)' 
    }}>
      <div className="section-header-with-action">
        <div className="section-header">
          <div className="section-icon-wrapper">
            <Eye className="section-icon" />
          </div>
          <div>
            <h2 className="section-title">Image Comparison - Image {index + 1}</h2>
            <p className="section-subtitle">{original.filename}</p>
          </div>
        </div>
        <button onClick={onClose} className="export-btn" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
          <X className="btn-icon" />
          Close
        </button>
      </div>
      {pcaData.metadata.dataset_note && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem 1.5rem', 
          background: 'rgba(59, 130, 246, 0.15)', 
          borderRadius: '8px', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          color: '#d0d0e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}></span>
            <div>
              <strong style={{ color: '#a0c0ff', display: 'block', marginBottom: '0.25rem' }}>
                {pcaData.metadata.visualization_dimensions}D PCA Visualization
              </strong>
              {pcaData.metadata.dataset_note}
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
        <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}></span>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#e0e0e0' }}>Original</h3>
          </div>
          <img 
            src={`data:image/png;base64,${original.image}`} 
            alt={`Original ${original.filename}`}
            style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}
          />
        </div>
        <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}></span>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#e0e0e0' }}>Reconstructed ({nComponents} components)</h3>
          </div>
          <img 
            src={`data:image/png;base64,${reconstructed.image}`} 
            alt={`Reconstructed ${reconstructed.filename}`}
            style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}
          />
        </div>
      </div>
    </section>
  );
};

export default ImageComparison;
