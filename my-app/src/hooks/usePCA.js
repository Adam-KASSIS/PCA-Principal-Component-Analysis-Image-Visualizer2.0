import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000';

// Warmup function to wake up the backend
const warmupBackend = async () => {
  try {
    // Make a lightweight ping request to wake up the server
    await fetch(`${API_BASE_URL}/api/datasets`, { signal: AbortSignal.timeout(5000) }).catch(() => {});
  } catch (err) {
    console.log('Warmup request sent');
  }
};

export const useFetchDatasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wake up the backend immediately
    warmupBackend();

    const fetchDatasets = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/datasets`);
        const data = await response.json();
        if (data.datasets) {
          setDatasets(data.datasets);
        }
      } catch (err) {
        console.error('Error fetching datasets:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch immediately
    fetchDatasets();

    // Also retry after 3 seconds in case backend was cold
    const retryTimeout = setTimeout(() => {
      fetchDatasets();
    }, 3000);

    return () => clearTimeout(retryTimeout);
  }, []);

  return { datasets, loading, error };
};

export const usePCAAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performPCA = async (mode, files, selectedDataset, nComponents, dimensions) => {
    setLoading(true);
    setError(null);

    const finalNComponents = nComponents === '' ? 10 : nComponents;
    const formData = new FormData();

    formData.append('mode', mode);
    formData.append('n_components', finalNComponents);
    formData.append('dimensions', dimensions);
    formData.append('grayscale', 'true');
    formData.append('return_images', 'true');

    if (mode === 'upload') {
      files.forEach(file => formData.append('files', file));
    } else {
      formData.append('dataset_name', selectedDataset);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/pca`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }

      console.log('PCA Response:', data);
      console.log('Has original_images?', !!data.original_images);
      console.log('Has reconstructed_images?', !!data.reconstructed_images);
      console.log('DEBUG - metadata:', data.metadata);
      console.log('DEBUG - dataset_note:', data.metadata?.dataset_note);

      return data;
    } catch (err) {
      const errorMsg = `Error processing images: ${err.message}`;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { performPCA, loading, error };
};

export const useFileHandling = () => {
  const handleFileChange = (e, setFiles, setPreviews, setPcaData, setError) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
    setPcaData(null);
    setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleDrop = (e, setFiles, setPreviews, setPcaData, setError) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    setError(null);
    setPcaData(null);
    setPreviews(droppedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return { handleFileChange, handleDrop, handleDragOver };
};

export const useCSVExport = () => {
  const downloadData = (pcaData) => {
    if (!pcaData) return;

    const { coordinates } = pcaData;
    const dims = pcaData.metadata.visualization_dimensions;
    const headers = ['Index', 'Filename', 'PC1'];

    if (dims >= 2) headers.push('PC2');
    if (dims >= 3) headers.push('PC3');

    const rows = coordinates.map(c => {
      const row = [c.index + 1, c.filename, c.x.toFixed(4)];
      if (dims >= 2) row.push(c.y.toFixed(4));
      if (dims >= 3) row.push(c.z.toFixed(4));
      return row;
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'pca_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return { downloadData };
};
