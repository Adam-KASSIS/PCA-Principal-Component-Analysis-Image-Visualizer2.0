import React from 'react';
import { Upload, Database, Image } from 'lucide-react';

const DataSourceTabs = ({ 
  mode, 
  setMode, 
  selectedDataset, 
  setSelectedDataset, 
  availableDatasets,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleFileChange,
  files
}) => (
  <div className="data-source-container">
    <div className="tabs-wrapper">
      <div 
        className={`tab-card ${mode === 'dataset' ? 'active' : ''}`}
        onClick={() => setMode('dataset')}
      >
        <div className="tab-icon-wrapper">
          <Database className="tab-icon" />
        </div>
        <h3 className="tab-title">Built-in Datasets</h3>
        <p className="tab-description">Pre-loaded image collections for optimal PCA demonstration</p>
        {mode === 'dataset' && (
          <div className="tab-content">
            <label className="control-label">Select Dataset</label>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="control-select"
            >
              <option value="">Choose a dataset...</option>
              {availableDatasets.map((dataset) => (
                <option key={dataset} value={dataset}>
                  {dataset}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div 
        className={`tab-card ${mode === 'upload' ? 'active' : ''}`}
        onClick={() => setMode('upload')}
      >
        <div className="tab-icon-wrapper">
          <Upload className="tab-icon" />
        </div>
        <h3 className="tab-title">Upload Your Own Images</h3>
        <p className="tab-description">Use your custom image collection for analysis</p>
        {mode === 'upload' && (
          <div className="tab-content">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="upload-zone"
            >
              <div className="upload-content">
                <div className="upload-icon-wrapper">
                  <Image className="upload-icon" />
                </div>
                <h4 className="upload-title">Drop images here</h4>
                <p className="upload-subtitle">or click to browse your files</p>
                <div className="upload-formats">
                  <span className="format-badge">JPG</span>
                  <span className="format-badge">PNG</span>
                  <span className="format-badge">BMP</span>
                  <span className="format-badge">TIFF</span>
                </div>
                {files.length > 0 && (
                  <div className="files-count">{files.length} file(s) selected</div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="upload-input"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default DataSourceTabs;
