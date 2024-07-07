import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload.tsx';
import '../css/TrainModel.css';

function TrainModel() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  const handleFilesChange = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setUploadedFiles(acceptedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    setTrainingInProgress(true);
    const response = await fetch('http://localhost:8000/train_model/', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setUploadedFiles(data.files);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (trainingInProgress) {
        const response = await fetch('http://localhost:8000/training_progress');
        const data = await response.json();
        setTrainingProgress(data.progress);

        if (data.progress === 100) {
          clearInterval(interval);
          setTrainingInProgress(false);
          setShowModelSelection(true);

          const modelsResponse = await fetch('http://localhost:8000/models/');
          const modelsData = await modelsResponse.json();
          setModels(modelsData.models);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [trainingInProgress]);

  return (
    <div className='window-train'>
      <h2>Тренировка модели</h2>
      <FileUpload handleFilesChange={handleFilesChange} selectedFiles={files} />
      
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className='upload-container'>
          <h3>Загруженные файлы:</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="upload-button" onClick={handleUpload}>Начать тренировку</button>
      
      {trainingInProgress && (
        <div>
          <h3>Прогресс тренировки</h3>
          <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: `${trainingProgress}%` }}>
              {trainingProgress}%
            </div>
          </div>
        </div>
      )}

      {showModelSelection && (
        <div>
          <h3>Выберите обученную модель</h3>
          <ul>
            {models.map((model) => (
              <li key={model.id}>
                <button onClick={() => setSelectedModel(model.id)}>{model.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TrainModel;
