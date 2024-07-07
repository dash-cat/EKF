import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload.tsx';
import HierarchicalTable from './HierarchicalTable.tsx';
import '../css/UploadDrawing.css';

const UploadDrawing: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const handleFilesChange = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file); // Append each file to the FormData
    }

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadedData(data);
      setUploadProgress(100);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/mock_data');
      if (response.ok) {
        const data = await response.json();
        setUploadedData(data);
      } else {
        console.error('Error fetching mock data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching mock data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveChanges = (data: any[]) => {
    console.log("Saved data:", data);
    // You can also implement an API call to save the edited data if needed
  };

  return (
    <div className="load_schema">
      <h2>Загрузить схему</h2>
      <div className='upload_container'>
        <FileUpload handleFilesChange={handleFilesChange} selectedFiles={files} />
        <button className="upload-button" onClick={handleUpload}>Загрузить</button>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="progress-bar">
          <div className="progress-bar-inner" style={{ width: `${uploadProgress}%` }}>
            {Math.round(uploadProgress)}%
          </div>
        </div>
      )}

      {uploadedData.length > 0 && <HierarchicalTable data={uploadedData} onSave={handleSaveChanges} />}
    </div>
  );
}

export default UploadDrawing;
