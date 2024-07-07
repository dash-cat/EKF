import React, { useState, useEffect } from 'react';
import './css/TrainModel.css';

function TrainModel() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingInProgress, setTrainingInProgress] = useState(false);

  const handleFilesChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    setTrainingInProgress(true);
    const response = await fetch('/train_model/', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setUploadedFiles(data.files);
  };

  const fetchTrainingProgress = async () => {
    const response = await fetch('/training_progress');
    const data = await response.json();
    setTrainingProgress(data.progress);
  };

  useEffect(() => {
    if (trainingInProgress) {
      const interval = setInterval(() => {
        fetchTrainingProgress();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [trainingInProgress]);

  return (
    <div>
      <h2>Train Model</h2>
      <div>
        <input type="file" multiple onChange={handleFilesChange} />
        <button onClick={handleUpload} disabled={trainingInProgress}>Загрузить данные для дообучения</button>
      </div>
      <div>
        <h3>Uploaded Files</h3>
        <ul>
          {uploadedFiles.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>
      {trainingInProgress && (
        <div>
          <h3>Прогресс обучения: {trainingProgress}%</h3>
          <progress value={trainingProgress} max="100"></progress>
        </div>
      )}
    </div>
  );
}


export default TrainModel;