'use client';

import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export default function FileDropZone({ onFileSelect, isLoading }: FileDropZoneProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative group border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer text-center
          ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} style={{ display: 'none' }} />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              {file ? file.name : 'Upload or drop your resume to get started'}
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              Supported formats: PDF, DOCX, TXT (Max 10MB)
            </p>
          </div>

          {!file && (
            <button className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200/50">
              Score resume
            </button>
          )}

          {file && !isLoading && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg font-medium">
              <CheckCircle2 size={18} />
              <span>File ready for analysis</span>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 animate-progress origin-left w-full"></div>
              </div>
              <span className="text-blue-600 text-sm font-bold animate-pulse">Analyzing your resume...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
