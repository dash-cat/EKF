import React, { useState, useEffect } from 'react';
import './css/TrainModel.css';

function TrainModel() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [trainingStatus, setTrainingStatus] = useState('');

  const handleFilesChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const response = await fetch('/train_model/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setTrainingStatus(data.status);
    } catch (error) {
      console.error('Error starting training:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch('/models/');
      const data = await response.json();
      setModels(data.models);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch('/train_progress/');
      const data = await response.json();
      setProgress(data.progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const stopTraining = async () => {
    try {
      const response = await fetch('/stop_training/', {
        method: 'POST',
      });
      const data = await response.json();
      setTrainingStatus(data.status);
    } catch (error) {
      console.error('Error stopping training:', error);
    }
  };

  useEffect(() => {
    fetchModels();
    const interval = setInterval(() => {
      fetchProgress();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="train-model">
      <h2>Train Model</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFilesChange} />
        <button type="submit">Start Training</button>
      </form>
      <button onClick={stopTraining}>Stop Training</button>
      <div className="progress">
        {progress !== null && <p>Training Progress: {progress}%</p>}
        {trainingStatus && <p>Status: {trainingStatus}</p>}
      </div>
      <div className="models">
        <h3>Models</h3>
        <select onChange={handleModelChange}>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TrainModel;
