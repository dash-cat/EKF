import React, { useState } from 'react';

function UploadDrawing() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвратить стандартное поведение формы
  
    const fileInput = document.querySelector('input[type="file"]');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div>
      <h2>Upload Drawing</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadDrawing;
