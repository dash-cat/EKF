import React, { useState } from 'react';
import axios from 'axios';

function TrainModel() {
  const [files, setFiles] = useState([]);

  const handleFilesChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    const response = await axios.post('/train_model/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
  };

  return (
    <div>
      <h2>Train Model</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFilesChange} />
        <button type="submit">Start Training</button>
      </form>
    </div>
  );
}

export default TrainModel;
