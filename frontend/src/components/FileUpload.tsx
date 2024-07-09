import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import '../css/FileUpload.css';

interface FileUploadProps {
  handleFilesChange: (files: File[]) => void;
  selectedFiles: File[];
  size: 'regular' | 'big';
}

const FileUpload: React.FC<FileUploadProps> = ({ handleFilesChange, selectedFiles, size }) => {
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

  const buttonContent = () => {
    if (selectedFiles.length === 0) {
      return <span>Выбрать файлы</span>;
    } else {
      return selectedFiles.map((file, index) => {
        return <div key={index} className="file-item">
          {size == 'big' ? file.name : stringTruncatedTo(15, file.name)}
        </div>;
      })
    }
  };

  return (
    <div className={`file-upload-wrapper ${size == 'big' ? 'big' : 'regular' }`}>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} ref={inputRef} />
        <button className="input-file__button">
          {buttonContent()}
        </button>
      </div>

    </div>
  );
};

function stringTruncatedTo(length: number, input: string): string {
  if (input.length <= length) {
    return input;
  } else {
    return input.substring(0, length) + '...';
  }
}

export default FileUpload;
