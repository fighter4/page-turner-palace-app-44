
import React, { useState } from 'react';
import { Book } from '@/types/book';
import { ArrowUp, BookOpen, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';

interface ReadingHeaderProps {
  book: Book;
  currentPage: number;
  onBackToLibrary: () => void;
  onToggleTOC: () => void;
  onToggleSettings: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchResults: Array<{ pageNumber: number; snippet: string }>;
  onSearchResultClick: (pageNumber: number) => void;
}

const ReadingHeader: React.FC<ReadingHeaderProps> = ({
  book,
  currentPage,
  onBackToLibrary,
  onToggleTOC,
  onToggleSettings,
  searchTerm,
  onSearchChange,
  searchResults,
  onSearchResultClick,
}) => {
  const { settings } = useReadingSettings();
  const [showSearch, setShowSearch] = useState(false);

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

  const getProgressPercentage = () => {
    return Math.round((currentPage / book.totalPages) * 100);
  };

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${getThemeClasses()}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToLibrary}
            className="rounded-lg hover:bg-opacity-10"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Library
          </Button>
          
          <div className="hidden md:block">
            <h1 className="font-semibold text-lg truncate max-w-xs">{book.title}</h1>
            <p className="text-sm opacity-70">{book.author}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-4 text-sm">
            <span>Page {currentPage} of {book.totalPages}</span>
            <span>{getProgressPercentage()}%</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="rounded-lg"
          >
            <Search className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTOC}
            className="rounded-lg"
          >
            <BookOpen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSettings}
            className="rounded-lg"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Search panel */}
      {showSearch && (
        <div className={`border-t p-4 ${getThemeClasses()}`}>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
            <Input
              type="text"
              placeholder="Search in this book..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-opacity-50 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    onSearchResultClick(result.pageNumber);
                    setShowSearch(false);
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">Page {result.pageNumber}</span>
                  </div>
                  <p className="text-sm opacity-80">...{result.snippet}...</p>
                </div>
              ))}
            </div>
          )}

          {searchTerm && searchResults.length === 0 && (
            <p className="text-center text-sm opacity-60 py-4">No results found</p>
          )}
        </div>
      )}
    </header>
  );
};

export default ReadingHeader;
