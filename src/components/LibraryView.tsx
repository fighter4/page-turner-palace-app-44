
import React, { useState } from 'react';
import { Book } from '@/types/book';
import { useBooks } from '@/contexts/BookContext';
import { BookOpen, Search, Plus, Calendar, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from './FileUpload';

interface LibraryViewProps {
  onOpenBook: (book: Book) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ onOpenBook }) => {
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getReadingProgress = (book: Book) => {
    const progress = ((book.lastReadPosition || 0) / book.totalPages) * 100;
    return Math.round(progress);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
            </div>
            
            <Button
              onClick={() => setShowUpload(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Books</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredBooks.length} of {books.length} books
            </div>
          </div>
        </div>

        {/* Books grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            {books.length === 0 ? (
              <div>
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No books in your library</h3>
                <p className="text-gray-600 mb-6">Get started by uploading your first ebook</p>
                <Button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First Book
                </Button>
              </div>
            ) : (
              <div>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => onOpenBook(book)}
              >
                {/* Book cover */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Reading progress */}
                  {(book.lastReadPosition || 0) > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="text-white text-xs mb-1">
                        {getReadingProgress(book)}% complete
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-1">
                        <div
                          className="bg-white rounded-full h-1 transition-all duration-300"
                          style={{ width: `${getReadingProgress(book)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Book info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{book.author}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(book.dateAdded)}</span>
                    </div>
                    
                    {book.fileSize && (
                      <div className="flex items-center space-x-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{book.fileSize}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* File upload modal */}
      <FileUpload
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </div>
  );
};

export default LibraryView;
