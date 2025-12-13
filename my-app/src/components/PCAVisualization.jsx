import React from 'react';
import PCAVisualization1D from './PCAVisualization1D';
import PCAVisualization2D from './PCAVisualization2D';
import PCAVisualization3D from './PCAVisualization3D';

const PCAVisualization = React.memo(({ pcaData, onPointClick }) => {
  const dims = pcaData.metadata.visualization_dimensions;
  const coordinates = pcaData.coordinates;
  const showTextLabels = coordinates.length <= 20;

  if (dims === 1) {
    return <PCAVisualization1D pcaData={pcaData} onPointClick={onPointClick} showTextLabels={showTextLabels} />;
  }

  if (dims === 2) {
    return <PCAVisualization2D pcaData={pcaData} onPointClick={onPointClick} showTextLabels={showTextLabels} />;
  }

  if (dims === 3) {
    return <PCAVisualization3D pcaData={pcaData} onPointClick={onPointClick} />;
  }

  return null;
}, (prevProps, nextProps) => {
  // Only re-render if pcaData actually changes, not for other state updates
  return prevProps.pcaData === nextProps.pcaData;
});

export default PCAVisualization;
