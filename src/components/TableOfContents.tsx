
import React from 'react';
import { Book } from '@/types/book';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import { X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableOfContentsProps {
  book: Book;
  currentPage: number;
  isOpen: boolean;
  onClose: () => void;
  onPageSelect: (page: number) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  book,
  currentPage,
  isOpen,
  onClose,
  onPageSelect,
}) => {
  const { settings } = useReadingSettings();

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700 text-gray-100';
      case 'sepia':
        return 'bg-amber-100 border-amber-200 text-amber-900';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto">
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 transform transition-transform duration-300
        lg:relative lg:transform-none lg:w-72
        ${getThemeClasses()} border-r shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <h2 className="font-semibold">Table of Contents</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-medium text-sm opacity-70 mb-2">Book</h3>
            <p className="font-semibold">{book.title}</p>
            <p className="text-sm opacity-70">{book.author}</p>
          </div>

          <div className="space-y-1">
            <h3 className="font-medium text-sm opacity-70 mb-2">Chapters</h3>
            {book.content.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => {
                  onPageSelect(chapter.pageNumber);
                  onClose();
                }}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  hover:bg-opacity-10 hover:bg-gray-500
                  ${currentPage === chapter.pageNumber 
                    ? 'bg-amber-100 text-amber-800 border-l-4 border-amber-500' 
                    : ''
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-sm line-clamp-2">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <span className="text-xs opacity-60 flex-shrink-0">
                    Page {chapter.pageNumber}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
