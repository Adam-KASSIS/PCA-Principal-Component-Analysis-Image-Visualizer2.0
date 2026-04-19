import React from 'react';
import { Eye } from 'lucide-react';

const ImagePreviewGrid = ({ previews }) => (
  <section className="section-card">
    <div className="section-header">
      <div className="section-icon-wrapper">
        <Eye className="section-icon" />
      </div>
      <div>
        <h2 className="section-title">Uploaded Images</h2>
        <p className="section-subtitle">{previews.length} images ready for analysis</p>
      </div>
    </div>

    <h3 className="pca-question">Why convert images to grayscale before PCA?</h3>

    <ul className="pca-info-list">
      <li>Reduces dimensionality before PCA: A color image has three channels (R, G, B). Turning it grayscale cuts the feature size by a factor of three, making PCA faster and easier.</li>
      <li>Avoids mixing color information with structural information: PCA captures shape, edges, and patterns. Keeping RGB mixes color variation with spatial variation, making components noisy.</li>
      <li>Different color channels are highly correlated: R, G, and B channels carry similar structure. Grayscale compresses this redundant information.</li>
      <li>Cleaner covariance matrix: Flattening RGB images creates huge samples. Grayscale produces a simpler covariance matrix, so components are cleaner and easier to compute.</li>
      <li>PCA is linear, human perception of color is not: Grayscale aligns better with PCA's assumptions. PCA on raw color sometimes gives poor results unless using color transforms like Lab or YCbCr.</li>
    </ul>
    <div className="preview-grid">
      {previews.map((url, idx) => (
        <div key={idx} className="preview-item">
          <img
            src={url}
            alt={`Preview ${idx + 1}`}
            className="preview-image"
          />
          <div className="preview-overlay">
            <span className="preview-label">
              {idx + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ImagePreviewGrid;
