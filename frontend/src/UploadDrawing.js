import React, { useState } from 'react';
import FileUpload from './FileUpload';

function UploadDrawing() {
  const [files, setFiles] = useState([]);

  const handleFilesChange = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    const response = await fetch('http://localhost:8000/upload/', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <h2>Загрузить схему</h2>
      <FileUpload handleFilesChange={handleFilesChange} selectedFiles={files} />
      <button className="upload-button" onClick={handleUpload}>Загрузить</button>
    </div>
  );
}

export default UploadDrawing;
