
import React, { useState } from 'react';
import { BookContent, Bookmark } from '@/types/book';
import { useBooks } from '@/contexts/BookContext';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import { ChevronLeft, ChevronRight, Bookmark as BookmarkIcon, BookmarkMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReadingContentProps {
  chapter?: BookContent;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const ReadingContent: React.FC<ReadingContentProps> = ({
  chapter,
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const { currentBook, bookmarks, addBookmark, removeBookmark } = useBooks();
  const { settings } = useReadingSettings();
  const [selectedText, setSelectedText] = useState('');

  const isBookmarked = bookmarks.some(
    bookmark => bookmark.bookId === currentBook?.id && bookmark.pageNumber === currentPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleBookmark = () => {
    if (!currentBook) return;

    if (isBookmarked) {
      const bookmark = bookmarks.find(
        b => b.bookId === currentBook.id && b.pageNumber === currentPage
      );
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        bookId: currentBook.id,
        pageNumber: currentPage,
        position: 0,
        note: selectedText || undefined,
        dateCreated: new Date(),
      };
      addBookmark(newBookmark);
    }
  };

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  if (!chapter) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getThemeClasses()}`}>
        <div className="text-center">
          <BookmarkIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Chapter not found</h2>
          <p className="opacity-70">This page might not be available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{chapter.chapterTitle}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`rounded-lg ${isBookmarked ? 'text-amber-600' : ''}`}
          >
            {isBookmarked ? (
              <BookmarkMinus className="w-5 h-5" />
            ) : (
              <BookmarkIcon className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div 
          className={`reading-content mb-12 ${className}`}
          onMouseUp={() => {
            const selection = window.getSelection();
            if (selection) {
              setSelectedText(selection.toString());
            }
          }}
        >
          {chapter.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-8">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="rounded-lg flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm opacity-70">
              {currentPage} of {totalPages}
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              ></div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="rounded-lg flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReadingContent;
