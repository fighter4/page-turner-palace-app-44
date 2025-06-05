
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBooks } from '@/contexts/BookContext';
import { processFile } from '@/utils/fileProcessor';

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ isOpen, onClose }) => {
  const { addBook } = useBooks();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFile, setProcessingFile] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setError('');
    
    for (const file of acceptedFiles) {
      try {
        setProcessingFile(file.name);
        console.log(`Processing file: ${file.name}`);
        
        const book = await processFile(file);
        addBook(book);
        console.log(`Successfully processed: ${file.name}`);
      } catch (error) {
        console.error('Error processing file:', error);
        setError(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    setIsProcessing(false);
    setProcessingFile('');
    if (!error) {
      onClose();
    }
  }, [addBook, onClose, error]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: true,
    disabled: isProcessing
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Upload Books</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isProcessing}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6">
          {isProcessing ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-gray-600 mb-2">Processing files...</p>
              {processingFile && (
                <p className="text-sm text-gray-400">Current: {processingFile}</p>
              )}
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop books here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports EPUB, PDF, and TXT files
                  </p>
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError('')}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
