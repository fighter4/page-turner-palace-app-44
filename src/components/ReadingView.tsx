
import React, { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { useBooks } from '@/contexts/BookContext';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import ReadingHeader from './ReadingHeader';
import ReadingContent from './ReadingContent';
import TableOfContents from './TableOfContents';
import ReadingSettings from './ReadingSettings';
import BookmarkSidebar from './BookmarkSidebar';
import ReadingNavigation from './ReadingNavigation';

interface ReadingViewProps {
  book: Book;
  onBackToLibrary: () => void;
}

const ReadingView: React.FC<ReadingViewProps> = ({ book, onBackToLibrary }) => {
  const { currentPage, setCurrentPage } = useBooks();
  const { settings } = useReadingSettings();
  const [showTOC, setShowTOC] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ pageNumber: number; snippet: string }>>([]);

  const currentChapter = book.content.find(chapter => chapter.pageNumber === currentPage);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = book.content
        .filter(chapter => 
          chapter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(chapter => ({
          pageNumber: chapter.pageNumber,
          snippet: getSearchSnippet(chapter.content, searchTerm)
        }));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, book.content]);

  const getSearchSnippet = (content: string, term: string): string => {
    const index = content.toLowerCase().indexOf(term.toLowerCase());
    if (index === -1) return '';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + term.length + 50);
    return content.substring(start, end);
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

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      case 'extra-large':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  const getFontFamilyClass = () => {
    switch (settings.fontFamily) {
      case 'crimson':
        return 'font-crimson';
      case 'open-sans':
        return 'font-open-sans';
      default:
        return 'font-inter';
    }
  };

  const getLineHeightClass = () => {
    switch (settings.lineHeight) {
      case 'relaxed':
        return 'leading-relaxed';
      case 'loose':
        return 'leading-loose';
      default:
        return 'leading-normal';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      <ReadingHeader
        book={book}
        currentPage={currentPage}
        onBackToLibrary={onBackToLibrary}
        onToggleTOC={() => setShowTOC(!showTOC)}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onToggleBookmarks={() => setShowBookmarks(!showBookmarks)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchResults={searchResults}
        onSearchResultClick={(pageNumber) => setCurrentPage(pageNumber)}
      />

      <div className="flex min-h-screen">
        <TableOfContents
          book={book}
          currentPage={currentPage}
          isOpen={showTOC}
          onClose={() => setShowTOC(false)}
          onPageSelect={setCurrentPage}
        />

        <main className="flex-1 transition-all duration-300 flex flex-col">
          <div className="flex-1">
            <ReadingContent
              chapter={currentChapter}
              currentPage={currentPage}
              totalPages={book.totalPages}
              onPageChange={setCurrentPage}
              className={`${getFontSizeClass()} ${getFontFamilyClass()} ${getLineHeightClass()}`}
            />
          </div>
          
          <ReadingNavigation
            book={book}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </main>

        <ReadingSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <BookmarkSidebar
          book={book}
          currentPage={currentPage}
          isOpen={showBookmarks}
          onClose={() => setShowBookmarks(false)}
          onPageSelect={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ReadingView;
