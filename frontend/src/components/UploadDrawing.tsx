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
    throw new Error("Not implemented");
  };

  const onSelectItem = (item: HierarchicalTableItem) => {
    setActiveBoxIndex(item.id);
    setTimeout(() => {
      document.querySelector('.bounding-box.active')?.scrollIntoView({ block: "center", inline: "center" });
    }, 0);
  }

  const downloadCSV = () => {
    const rows = [
      ["Артикул", "Наименование", "Количество", "Цена", "Сумма"],
      ...uploadedData.map(item => [
        item.article,
        item.name,
        item.amount,
        item.price,
        item.totalPrice
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);

    link.click();
  };

  const downloadExcel = () => {
    throw new Error("Not implemented");
  };


  return (
    <div className="load_schema">
      <h2>Загрузить схему</h2>
      <div className='upload_container'>

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

      <div className='table-button'>
        <button className="save-button" onClick={() => handleSaveChanges([])}>Сохранить изменения</button>
        <button className="export-button" onClick={downloadCSV}>Скачать CSV</button>
        <button className="export-button" onClick={downloadExcel}>Скачать Excel</button>
        <div style={{ flexGrow: 1 }} />
        <FileUpload handleFilesChange={handleFilesChange} selectedFiles={files} size='regular' />
        <button
          className={`upload-button ${files.length === 0 ? 'disabled' : ''}`}
          onClick={handleUpload}
          disabled={files.length === 0 || isLoading}
        >
          {isLoading ? 'Uploading...' : 'Загрузить'}
        </button>
      </div>

      <div className='preview-container'>
        <HierarchicalTable data={uploadedData} onSelectItem={onSelectItem} />
        <div className='spacer'/>
        <div className='preview-window'>
          <SchematicPreview
            imageSrc="/static/sample-schematic.jpg"
            boxes={readBoxes()}
            activeBoxIndex={activeBoxIndex}
          />
        </div>
      </div>

      {/* {
        uploadedData.length > 0
        && <HierarchicalTable data={uploadedData} onSave={handleSaveChanges} />
      } */}
    </div>
  );
}

export default UploadDrawing;
