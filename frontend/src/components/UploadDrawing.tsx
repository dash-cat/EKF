import '../css/UploadDrawing.css';
import { readBoxes } from '../models/BoundingBoxDTO.ts';
import FileUpload from './FileUpload.tsx';
import HierarchicalTable from './HierarchicalTable.tsx';
import React, { useState, useEffect } from 'react';
import SchematicPreview from './SchematicPreview.tsx';
import { endpoints } from '../endpoints.ts';
import HierarchicalTableItem from '../models/HierarchicalTableItem.ts';

const UploadDrawing: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [activeBoxIndex, setActiveBoxIndex] = useState<number>(-1);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFilesChange = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setUploadStatus(''); // Reset upload status when files are changed
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const response = await fetch(endpoints.upload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
      }

      const data = await response.json();
      setUploadedData(data.filenames);
      setUploadProgress(100);
      setUploadStatus('Upload successful!');
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus(`Error uploading files: ${error.message}`);
    } finally {
      setIsLoading(false);
      setFiles([]); // Reset files state
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(endpoints.mockData);
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
  };

  const onSelectItem = (item: HierarchicalTableItem) => {
    setActiveBoxIndex(item.id);
  }

  return (
    <div className="load_schema">
      <h2>Загрузить схему</h2>
      <div className='upload_container'>
        <FileUpload handleFilesChange={handleFilesChange} selectedFiles={files} />
        <button
          className={`upload-button ${files.length === 0 ? 'disabled' : ''}`}
          onClick={handleUpload}
          disabled={files.length === 0 || isLoading}
        >
          {isLoading ? 'Uploading...' : 'Загрузить'}
        </button>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="progress-bar">
          <div className="progress-bar-inner" style={{ width: `${uploadProgress}%` }}>
            {Math.round(uploadProgress)}%
          </div>
        </div>
      )}

      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.includes('Error') ? 'error' : 'success'}`}>
          {uploadStatus}
        </div>
      )}

      <SchematicPreview
        imageSrc="/static/sample-schematic.jpg"
        boxes={readBoxes()}
        activeBoxIndex={activeBoxIndex}
      />
      <div className='spacer'/>
      <HierarchicalTable data={uploadedData} onSave={handleSaveChanges} onSelectItem={onSelectItem} />

      {/* {
        uploadedData.length > 0
        && <HierarchicalTable data={uploadedData} onSave={handleSaveChanges} />
      } */}
    </div>
  );
}

export default UploadDrawing;
