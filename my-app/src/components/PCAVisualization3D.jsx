import React, { useRef } from 'react';
import Plot from 'react-plotly.js';

const PCAVisualization3D = ({ pcaData, onPointClick }) => {
  const plotRef = useRef(null);
  const cameraRef = useRef(null);
  const { coordinates, variance } = pcaData;

  const attachClickHandler = (figure, graphDiv) => {
    if (!graphDiv) return;
    
    plotRef.current = graphDiv;
    
    if (graphDiv.removeAllListeners) {
      graphDiv.removeAllListeners('plotly_click');
    }
    
    graphDiv.on('plotly_click', (data) => {
      console.log('=== PLOTLY_CLICK FIRED ===');
      
      if (!data || !data.points || data.points.length === 0) {
        return;
      }
      
      const point = data.points[0];
      let pointIndex = null;
      
      if (point.customdata !== undefined && point.customdata !== null) {
        pointIndex = point.customdata;
      } else if (point.pointNumber !== undefined) {
        pointIndex = point.pointNumber;
      } else if (point.pointIndex !== undefined) {
        pointIndex = point.pointIndex;
      }
      
      console.log('Clicked point index:', pointIndex);
      
      if (pointIndex !== null && pointIndex !== undefined && pointIndex >= 0) {
        onPointClick(pointIndex);
      }
    });
  };

  return (
    <div className="plotly-container">
      <Plot
        data={[{
          x: coordinates.map(c => c.x),
          y: coordinates.map(c => c.y || 0),
          z: coordinates.map(c => c.z || 0),
          mode: 'markers',
          type: 'scatter3d',
          text: coordinates.map((_, i) => `Image ${i + 1}`),
          customdata: coordinates.map((_, i) => i),
          marker: {
            size: 8,
            color: coordinates.map((_, i) => i),
            colorscale: 'Viridis',
            showscale: false,
            line: { color: 'rgba(255, 255, 255, 0.5)', width: 1 }
          },
          hovertemplate: '<b>%{text}</b><br>PC1: %{x:.4f}<br>PC2: %{y:.4f}<br>PC3: %{z:.4f}<br><i>Click to view details</i><extra></extra>'
        }]}
        layout={{
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#e0e0e0', family: 'Orbitron, sans-serif' },
          scene: {
            xaxis: { title: `PC1 (${(variance.explained_variance[0] * 100).toFixed(1)}%)`, gridcolor: 'rgba(139, 92, 246, 0.2)', backgroundcolor: 'rgba(0,0,0,0)' },
            yaxis: { title: `PC2 (${((variance.explained_variance[1] || 0) * 100).toFixed(1)}%)`, gridcolor: 'rgba(139, 92, 246, 0.2)', backgroundcolor: 'rgba(0,0,0,0)' },
            zaxis: { title: `PC3 (${((variance.explained_variance[2] || 0) * 100).toFixed(1)}%)`, gridcolor: 'rgba(139, 92, 246, 0.2)', backgroundcolor: 'rgba(0,0,0,0)' },
            bgcolor: 'rgba(0,0,0,0)',
            camera: cameraRef.current || { eye: { x: 1.5, y: 1.5, z: 1.5 } }
          },
          hovermode: 'closest',
          margin: { l: 0, r: 0, t: 40, b: 0 },
          height: 700,
          uirevision: 'pca-plot-state'
        }}
        config={{ 
          displayModeBar: true,
          modeBarButtonsToRemove: ['select', 'lasso2d'], 
          responsive: true,
          displaylogo: false
        }}
        onInitialized={attachClickHandler}
        onUpdate={attachClickHandler}
        style={{ width: '100%', height: '700px', cursor: 'pointer' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default PCAVisualization3D;
