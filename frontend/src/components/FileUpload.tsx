import React, { useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import '../css/FileUpload.css';

interface FileUploadProps {
  handleFilesChange: (files: File[]) => void;
  selectedFiles: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({ handleFilesChange, selectedFiles }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFilesChange(acceptedFiles);
  }, [handleFilesChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: true,
  });

  useEffect(() => {
    if (selectedFiles.length === 0 && inputRef.current) {
      inputRef.current.value = ''; // Clear the input
    }
  }, [selectedFiles]);

  return (
    <div className="file-upload-wrapper">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} ref={inputRef} />
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
};

export default FileUpload;
