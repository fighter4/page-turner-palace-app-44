
import React, { useState } from 'react';
import { Book } from '@/types/book';
import { BookProvider } from '@/contexts/BookContext';
import { ReadingSettingsProvider } from '@/contexts/ReadingSettingsContext';
import LibraryView from '@/components/LibraryView';
import ReadingView from '@/components/ReadingView';

const Index = () => {
  const [currentView, setCurrentView] = useState<'library' | 'reading'>('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleOpenBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('reading');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedBook(null);
  };

  return (
    <ReadingSettingsProvider>
      <BookProvider>
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
      </BookProvider>
    </ReadingSettingsProvider>
  );
};

export default Index;
