
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBooks } from '@/contexts/BookContext';
import { Book, BookContent } from '@/types/book';

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ isOpen, onClose }) => {
  const { addBook } = useBooks();

  const processFile = async (file: File): Promise<Book> => {
    // Mock file processing - in a real app, you'd parse EPUB/PDF
    const content = await file.text().catch(() => 'Sample content for uploaded book.');
    
    const mockChapters: BookContent[] = [
      {
        id: `${Date.now()}-1`,
        chapterTitle: 'Chapter 1',
        content: content.substring(0, 2000) || 'This is the content of your uploaded book. In a real implementation, this would be parsed from the EPUB or PDF file.',
        pageNumber: 1
      },
      {
        id: `${Date.now()}-2`,
        chapterTitle: 'Chapter 2', 
        content: content.substring(2000, 4000) || 'This is the second chapter of your uploaded book.',
        pageNumber: 2
      }
    ];

    return {
      id: Date.now().toString(),
      title: file.name.replace(/\.(epub|pdf|txt)$/i, ''),
      author: 'Unknown Author',
      content: mockChapters,
      totalPages: mockChapters.length,
      lastReadPosition: 0,
      bookmarks: [],
      dateAdded: new Date(),
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const book = await processFile(file);
        addBook(book);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
    onClose();
  }, [addBook, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Upload Books</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6">
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
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
