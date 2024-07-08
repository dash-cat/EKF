import React, { useState } from 'react';
import TrainModel from './TrainModel.tsx';
import UploadDrawing from './UploadDrawing.tsx';
import Documentation from './Documentation.tsx';
import Presentation from './Presentation.tsx';
import ComponentTester from './ComponentTester.tsx';

const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadDrawing />;
      case 'train':
        return <TrainModel />;
      case 'documentation':
        return <Documentation />;
      case 'presentation':
        return <Presentation />;
      case 'tester':
        return <ComponentTester />;
      default:
        return <UploadDrawing />;
    }
  };

  return (
    <div>
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
        <button
          className={activeTab === 'presentation' ? 'active' : ''}
          onClick={() => setActiveTab('presentation')}
        >
          Презентация
        </button>
        <button
          className={activeTab === 'tester' ? 'active' : ''}
          onClick={() => setActiveTab('tester')}
        >
          Тестер
        </button>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default TabNavigation;

