import React, { useState } from 'react';
import TrainModel from './components/TrainModel';
import UploadDrawing from './components/UploadDrawing.tsx';
import Documentation from './components/Documentation';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  const renderContent = () => {
    if (activeTab === 'upload') {
      return <UploadDrawing />;
    } else if (activeTab === 'train') {
      return <TrainModel />;
    } else if (activeTab === 'documentation') {
      return <Documentation />;
    }
  };

  return (
    <div className="app">
      <div className="status-bar">
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          Загрузка
        </button>
        <button
          className={activeTab === 'train' ? 'active' : ''}
          onClick={() => setActiveTab('train')}
        >
          Тренировка
        </button>
        <button
          className={activeTab === 'documentation' ? 'active' : ''}
          onClick={() => setActiveTab('documentation')}
        >
          Документация
        </button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default App;
