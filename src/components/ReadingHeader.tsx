
import React from 'react';
import { Book } from '@/types/book';
import { ArrowLeft, Menu, Settings, Search, X, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReadingHeaderProps {
  book: Book;
  // currentPage: number; // Removed as it's unused
  onBackToLibrary: () => void;
  onToggleTOC: () => void;
  onToggleSettings: () => void;
  onToggleBookmarks: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchResults: Array<{ pageNumber: number; snippet: string }>;
  onSearchResultClick: (pageNumber: number) => void;
}

const ReadingHeader: React.FC<ReadingHeaderProps> = ({
  book,
  // currentPage, // Removed as it's unused
  onBackToLibrary,
  onToggleTOC,
  onToggleSettings,
  onToggleBookmarks,
  searchTerm,
  onSearchChange,
  searchResults,
  onSearchResultClick,
}) => {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToLibrary}
            className="rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Library</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTOC}
            className="rounded-lg"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Contents</span>
          </Button>
        </div>

        {/* Center section - Book info */}
        <div className="flex-1 text-center px-4">
          <h1 className="font-semibold text-gray-900 truncate">{book.title}</h1>
          <p className="text-sm text-gray-600 truncate">{book.author}</p>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
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
            onClick={onToggleBookmarks}
            className="rounded-lg"
          >
            <Bookmark className="w-4 h-4" />
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

      {/* Search bar */}
      {showSearch && (
        <div className="border-t bg-gray-50 p-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search in this book..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSearch(false);
                onSearchChange('');
              }}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mt-4 max-w-md mx-auto bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSearchResultClick(result.pageNumber);
                    setShowSearch(false);
                    onSearchChange('');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="text-sm font-medium">Page {result.pageNumber}</div>
                  <div className="text-xs text-gray-600 truncate">
                    ...{result.snippet}...
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default ReadingHeader;
