import React, { useRef } from 'react';
import Plot from 'react-plotly.js';

const PCAVisualization2D = ({ pcaData, onPointClick, showTextLabels }) => {
  const plotRef = useRef(null);
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
          mode: showTextLabels ? 'markers+text' : 'markers',
          type: 'scatter',
          text: coordinates.map((_, i) => `${i + 1}`),
          customdata: coordinates.map((_, i) => i),
          textposition: 'top center',
          textfont: { size: 11, color: '#e0e0e0' },
          marker: {
            size: 14,
            color: coordinates.map((_, i) => i),
            colorscale: 'Viridis',
            showscale: false,
            line: { color: 'rgba(255, 255, 255, 0.5)', width: 2 }
          },
          hovertemplate: '<b>Image %{text}</b><br>PC1: %{x:.4f}<br>PC2: %{y:.4f}<br><i>Click to view details</i><extra></extra>'
        }]}
        layout={{
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#e0e0e0', family: 'Orbitron, sans-serif' },
          xaxis: {
            title: `PC1 — ${(variance.explained_variance[0] * 100).toFixed(1)}% variance`,
            gridcolor: 'rgba(139, 92, 246, 0.2)',
            zerolinecolor: 'rgba(139, 92, 246, 0.4)'
          },
          yaxis: {
            title: `PC2 — ${((variance.explained_variance[1] || 0) * 100).toFixed(1)}% variance`,
            gridcolor: 'rgba(139, 92, 246, 0.2)',
            zerolinecolor: 'rgba(139, 92, 246, 0.4)'
          },
          hovermode: 'closest',
          dragmode: 'pan',
          margin: { l: 60, r: 40, t: 40, b: 60 },
          height: 600,
          uirevision: 'pca-plot-state'
        }}
        config={{ 
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'], 
          responsive: true,
          displaylogo: false,
          scrollZoom: true
        }}
        onInitialized={attachClickHandler}
        onUpdate={attachClickHandler}
        style={{ width: '100%', height: '600px', cursor: 'pointer' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default PCAVisualization2D;
