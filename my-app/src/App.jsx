import React, { useState, useRef, useEffect } from 'react';
import { Download, BarChart3, Database } from 'lucide-react';
import './App.css';

// Component imports
import Header from './components/Header';
import WarningBanner from './components/WarningBanner';
import DataSourceTabs from './components/DataSourceTabs';
import ControlPanel from './components/ControlPanel';
import ImagePreviewGrid from './components/ImagePreviewGrid';
import VarianceInfo from './components/VarianceInfo';
import ImageComparison from './components/ImageComparison';
import PCAVisualization from './components/PCAVisualization';
import EigenimagesGrid from './components/EigenimagesGrid';

// Custom hooks imports
import { useFetchDatasets, usePCAAnalysis, useFileHandling, useCSVExport } from './hooks/usePCA';

const App = () => {
  const [mode, setMode] = useState('dataset');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [pcaData, setPcaData] = useState(null);
  const [nComponents, setNComponents] = useState(10);
  const [dimensions, setDimensions] = useState(2);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const fileInputRef = useRef(null);
  const comparisonRef = useRef(null);

  // Custom hooks
  const { datasets: availableDatasets } = useFetchDatasets();
  const { performPCA: performPCARequest, loading } = usePCAAnalysis();
  const { handleFileChange: baseHandleFileChange, handleDrop: baseHandleDrop, handleDragOver } = useFileHandling();
  const { downloadData } = useCSVExport();

  // Scroll to comparison when image is selected
  useEffect(() => {
    if (selectedImageIndex !== null && comparisonRef.current) {
      comparisonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedImageIndex]);

  // File handling wrappers
  const handleFileChange = (e) => {
    baseHandleFileChange(e, setFiles, setPreviews, setPcaData, setError);
  };

  const handleDrop = (e) => {
    baseHandleDrop(e, setFiles, setPreviews, setPcaData, setError);
  };

  // PCA Analysis
  const performPCA = async () => {
    if (mode === 'upload' && files.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    if (mode === 'dataset' && !selectedDataset) {
      setError('Please select a dataset');
      return;
    }

    try {
      setSelectedImageIndex(null);
      const data = await performPCARequest(mode, files, selectedDataset, nComponents, dimensions);
      setPcaData(data);
      
      // Update previews to show grayscale images
      if (data.original_images) {
        setPreviews(data.original_images.map(img => `data:image/png;base64,${img.image}`));
      }
    } catch (err) {
      console.error('PCA error:', err);
    }
  };

  // CSV Export
  const handleDownloadData = () => {
    downloadData(pcaData);
  };

  const canAnalyze = (mode === 'upload' && files.length > 0) || (mode === 'dataset' && selectedDataset);

  const handlePointClick = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-container">
        <WarningBanner />
        <section className="section-card">
          <div className="section-header">
            <div className="section-icon-wrapper"><Database className="section-icon" /></div>
            <div>
              <h2 className="section-title">Data Source</h2>
              <p className="section-subtitle">Choose your image source</p>
            </div>
          </div>
          <DataSourceTabs
            mode={mode}
            setMode={setMode}
            selectedDataset={selectedDataset}
            setSelectedDataset={setSelectedDataset}
            availableDatasets={availableDatasets}
            fileInputRef={fileInputRef}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleFileChange={handleFileChange}
            files={files}
          />
          {canAnalyze && (
            <ControlPanel
              nComponents={nComponents}
              setNComponents={setNComponents}
              dimensions={dimensions}
              setDimensions={setDimensions}
              performPCA={performPCA}
              loading={loading}
              canAnalyze={canAnalyze}
            />
          )}
          {error && (
            <div className="error-message">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            </div>
          )}
        </section>

        {previews.length > 0 && <ImagePreviewGrid previews={previews} />}

        {pcaData && (
          <>
            <section className="section-card">
              <div className="section-header-with-action">
                <div className="section-header">
                  <div className="section-icon-wrapper"><BarChart3 className="section-icon" /></div>
                  <div>
                    <h2 className="section-title">PCA Projection</h2>
                    <p className="section-subtitle">
                      {dimensions === 1 ? '1D' : dimensions === 2 ? '2D' : '3D'} visualization of principal components
                    </p>
                  </div>
                </div>
                <button onClick={handleDownloadData} className="export-btn">
                  <Download className="btn-icon" />
                  Export CSV
                </button>
              </div>
              <VarianceInfo pcaData={pcaData} />
              <div className="visualization-wrapper">
                <PCAVisualization pcaData={pcaData} onPointClick={handlePointClick} />
              </div>
              <div className="tip-message">
                <div className="tip-content">
                  <span className="tip-icon">💡</span>
                  <span className="tip-text">Click any point to compare original and reconstructed images below</span>
                </div>
              </div>
            </section>

            <div ref={comparisonRef}>
              <ImageComparison 
                key={`comparison-${selectedImageIndex}-${pcaData?.coordinates?.length || 0}`}
                index={selectedImageIndex} 
                pcaData={pcaData} 
                nComponents={nComponents === '' ? 10 : nComponents}
                onClose={() => setSelectedImageIndex(null)}
              />
            </div>

            {pcaData.eigenimages && (
              <EigenimagesGrid eigenimages={pcaData.eigenimages} nComponents={nComponents === '' ? 10 : nComponents} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
