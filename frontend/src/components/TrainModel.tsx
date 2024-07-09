import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload.tsx';
import '../css/TrainModel.css';
import { endpoints } from '../endpoints.ts';

type DOMFile = File;

interface Model {
  id: string;
  name: string;
}

const TrainModel: React.FC = () => {
  const [files, setFiles] = useState<DOMFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [trainingInProgress, setTrainingInProgress] = useState<boolean>(false);
  const [showModelSelection, setShowModelSelection] = useState<boolean>(false);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');

  const handleFilesChange = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setUploadedFiles(acceptedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    setTrainingInProgress(true);
    const response = await fetch(endpoints.trainModels, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setUploadedFiles(data.files);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (trainingInProgress) {
        const response = await fetch(endpoints.trainingProgress);
        const data = await response.json();
        setTrainingProgress(data.progress);

        if (data.progress === 100) {
          clearInterval(interval);
          setTrainingInProgress(false);
          setShowModelSelection(true);

          const modelsResponse = await fetch(endpoints.models);
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
      <FileUpload handleFilesChange={handleFilesChange} selectedFiles={files} size='big' />
      
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
