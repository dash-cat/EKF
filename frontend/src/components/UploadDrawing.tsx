import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DataTable from './DataTable';
import './css/UploadDrawing.css';

const UploadDrawing: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedData, setUploadedData] = useState<
    Array<{ article: string, name: string, amount: number, price: string, totalPrice: string }>
  >([]);

  const handleFilesChange = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file); // Change 'files' to 'file' to match backend
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/upload', true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
        // Mock data
        const mockData = [
          { article: 'mb-20-80-60n', name: 'Каркас ВРУ-1 Unit S сварной', amount: 1, price: '43 322,82', totalPrice: '43 322,82' },
          { article: 'an-1-01', name: 'Наклейка "Молния"', amount: 1, price: '14,16', totalPrice: '14,16' },
          { article: 'mb15-08-02-07', name: 'Цоколь к ВРУ Unit S', amount: 1, price: '2 961,97', totalPrice: '2 961,97' }
        ];
        setUploadedData(mockData);
      } else {
        console.error('Error uploading files:', xhr.statusText);
      }
    };

    xhr.onerror = () => {
      console.error('Error uploading files:', xhr.statusText);
    };

    xhr.send(formData);
  };

  return (
    <div className="load_schema">
      <h2>Загрузить схему</h2>
      <FileUpload handleFilesChange={handleFilesChange} selectedFiles={files} />
      <button className="upload-button" onClick={handleUpload}>Загрузить</button>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="progress-bar">
          <div className="progress-bar-inner" style={{ width: `${uploadProgress}%` }}>
            {Math.round(uploadProgress)}%
          </div>
        </div>
      )}

      {uploadedData.length > 0 && <DataTable data={uploadedData} />}
    </div>
  );
}

export default UploadDrawing;
