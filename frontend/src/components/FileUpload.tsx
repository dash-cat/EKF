import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './css/FileUpload.css';

interface FileUploadProps {
  handleFilesChange: (files: File[]) => void;
  selectedFiles: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({ handleFilesChange, selectedFiles }) => {
  const onDrop = useCallback((acceptedFiles) => {
    handleFilesChange(acceptedFiles);
  }, [handleFilesChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div className="file-upload-wrapper">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <button className="input-file__button">Выбрать файлы</button>
      </div>
      <div className="file-list">
        {selectedFiles.map((file, index) => (
          <div key={index} className="file-item">
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
