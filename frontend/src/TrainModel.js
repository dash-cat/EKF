import React, { useState, useEffect } from 'react';
import './css/TrainModel.css';

function TrainModel() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  const handleFilesChange = (e) => {
    setFiles(e.target.files);
    setUploadedFiles(Array.from(e.target.files));
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
    console.log(data);
  };

  const fetchModels = async () => {
    const response = await fetch('http://localhost:8000/models/');
    const data = await response.json();
    setModels(data.models);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (trainingInProgress) {
        const response = await fetch('http://localhost:8000/training_progress');
        if (response.ok) {
          const data = await response.json();
          setTrainingProgress(data.progress);
  
          if (data.progress >= 100) {
            clearInterval(interval);
            setTrainingInProgress(false);
            setShowModelSelection(true);
            fetchModels();
          }
        } else {
          setTrainingProgress(0);
          setTrainingInProgress(false);
        }
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [trainingInProgress]);

  return (
    <div>
      <h2>Train Model</h2>
      <input type="file" multiple onChange={handleFilesChange} />
      <button onClick={handleUpload}>Start Training</button>
  
      {uploadedFiles.length > 0 && (
        <div>
          <h3>Uploaded Files:</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
  
      {trainingInProgress && (
        <div>
          <h3>Training Progress</h3>
          <div className="progress-bar">
            <div className="progress-bar-inner" style={{ width: `${trainingProgress}%` }}>
              {trainingProgress}%
            </div>
          </div>
        </div>
      )}
  
      {showModelSelection && (
        <div>
          <h3>Select Trained Model</h3>
          <ul>
            {models.map((model) => (
              <li key={model.id}>
                <button onClick={() => setSelectedModel(model.id)}>{model.name}</button>
              </li>
            ))}
          </ul>
          <button onClick={() => console.log(`Selected model: ${selectedModel}`)}>Confirm Selection</button>
        </div>
      )}
    </div>
  );
}

export default TrainModel;
