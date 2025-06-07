
import React, { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { BookProvider, useBooks } from '@/contexts/BookContext';
import { ReadingSettingsProvider } from '@/contexts/ReadingSettingsContext';
import LibraryView from '@/components/LibraryView';
import ReadingView from '@/components/ReadingView';

const IndexContent = () => { // Renamed Index to IndexContent to use useBooks hook
  const { books: contextBooks } = useBooks(); // Get books from context
  const [currentView, setCurrentView] = useState<'library' | 'reading'>('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    // If there's a selected book, keep its state in sync with the context
    if (selectedBook && contextBooks) {
      const updatedBookFromContext = contextBooks.find(b => b.id === selectedBook.id);
      if (updatedBookFromContext) {
        // Only update if there's a difference, to avoid potential loops if objects are not memoized
        // For simplicity here, we'll update if the reference differs or bookmarks length differs
        // A more robust check might involve deep comparison or versioning if necessary
        if (updatedBookFromContext !== selectedBook ||
            (updatedBookFromContext.bookmarks && selectedBook.bookmarks &&
             updatedBookFromContext.bookmarks.length !== selectedBook.bookmarks.length)) {
          setSelectedBook(updatedBookFromContext);
        }
      } else {
        // Book removed from context, so deselect it
        setSelectedBook(null);
        setCurrentView('library');
      }
    }
  }, [contextBooks, selectedBook]);

  const handleOpenBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('reading');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen">
      {currentView === 'library' ? (
        <LibraryView onOpenBook={handleOpenBook} />
      ) : selectedBook ? (
        <ReadingView
          book={selectedBook}
          onBackToLibrary={handleBackToLibrary}
        />
      ) : null}
    </div>
  );
};

// New Index component that wraps IndexContent with providers
const Index = () => (
  <ReadingSettingsProvider>
    <BookProvider>
      <IndexContent />
    </BookProvider>
  </ReadingSettingsProvider>
);

export default Index;
