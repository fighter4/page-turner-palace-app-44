
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Book } from '@/types/book';

interface ReadingNavigationProps {
  book: Book;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const ReadingNavigation: React.FC<ReadingNavigationProps> = ({
  book,
  currentPage,
  onPageChange,
  className = ''
}) => {
  const [showGoToPage, setShowGoToPage] = useState(false);
  const [goToPageValue, setGoToPageValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === 'INPUT') {
        return; // Don't handle if user is typing in an input
      }
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
          }
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          if (currentPage < book.totalPages) {
            onPageChange(currentPage + 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          onPageChange(1);
          break;
        case 'End':
          event.preventDefault();
          onPageChange(book.totalPages);
          break;
        case 'g':
          event.preventDefault();
          setShowGoToPage(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, book.totalPages, onPageChange]);

  const handleGoToPage = () => {
    const pageNum = parseInt(goToPageValue);
    if (pageNum >= 1 && pageNum <= book.totalPages) {
      onPageChange(pageNum);
      setShowGoToPage(false);
      setGoToPageValue('');
    }
  };

  const handleGoToFirst = () => onPageChange(1);
  const handleGoToLast = () => onPageChange(book.totalPages);
  const handlePrevious = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () => currentPage < book.totalPages && onPageChange(currentPage + 1);

  return (
    <>
      <div className={`flex items-center justify-between bg-white border-t px-4 py-3 ${className}`}>
        {/* Navigation buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToFirst}
            disabled={currentPage === 1}
            className="hidden sm:flex"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
        </div>

        {/* Page info and go to page */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowGoToPage(true)}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Page {currentPage} of {book.totalPages}
          </button>
          
          <div className="hidden sm:block w-48 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / book.totalPages) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === book.totalPages}
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToLast}
            disabled={currentPage === book.totalPages}
            className="hidden sm:flex"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Go to page modal */}
      {showGoToPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Go to Page</h3>
            <div className="space-y-4">
              <input
                type="number"
                min="1"
                max={book.totalPages}
                value={goToPageValue}
                onChange={(e) => setGoToPageValue(e.target.value)}
                placeholder={`Page (1-${book.totalPages})`}
                className="w-full px-3 py-2 border rounded-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGoToPage();
                  } else if (e.key === 'Escape') {
                    setShowGoToPage(false);
                    setGoToPageValue('');
                  }
                }}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleGoToPage}
                  className="flex-1"
                  disabled={!goToPageValue}
                >
                  Go
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGoToPage(false);
                    setGoToPageValue('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReadingNavigation;
