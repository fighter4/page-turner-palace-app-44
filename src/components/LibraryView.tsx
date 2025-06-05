
import React, { useState } from 'react';
import { Book } from '@/types/book';
import { useBooks } from '@/contexts/BookContext';
import { Search, Upload, BookOpen, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LibraryViewProps {
  onOpenBook: (book: Book) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ onOpenBook }) => {
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getReadingProgress = (book: Book) => {
    if (!book.lastReadPosition) return 0;
    return Math.round((book.lastReadPosition / book.totalPages) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-600">Discover your digital book collection</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search books, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-amber-200 focus:border-amber-400 focus:ring-amber-200"
            />
          </div>
          <Button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium px-6">
            <Upload className="w-4 h-4 mr-2" />
            Upload Book
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => onOpenBook(book)}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-amber-400" />
                  </div>
                )}
                {getReadingProgress(book) > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>{getReadingProgress(book)}% complete</span>
                      <Clock className="w-3 h-3" />
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1 mt-1">
                      <div
                        className="bg-amber-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${getReadingProgress(book)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-1">{book.author}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(book.dateAdded)}
                  </div>
                  {book.fileSize && (
                    <span>{book.fileSize}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first book to get started'}
            </p>
            <Button className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Book
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
