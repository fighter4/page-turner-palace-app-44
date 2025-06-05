
import React, { useState } from 'react';
import { Book, Bookmark } from '@/types/book';
import { useBooks } from '@/contexts/BookContext';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import { X, Bookmark as BookmarkIcon, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookmarkSidebarProps {
  book: Book;
  currentPage: number;
  isOpen: boolean;
  onClose: () => void;
  onPageSelect: (page: number) => void;
}

const BookmarkSidebar: React.FC<BookmarkSidebarProps> = ({
  book,
  currentPage,
  isOpen,
  onClose,
  onPageSelect,
}) => {
  const { addBookmark, removeBookmark } = useBooks();
  const { settings } = useReadingSettings();
  const [newBookmarkNote, setNewBookmarkNote] = useState('');
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null);

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

  const handleAddBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      bookId: book.id,
      pageNumber: currentPage,
      position: 0,
      note: newBookmarkNote || `Page ${currentPage}`,
      dateCreated: new Date()
    };
    addBookmark(newBookmark);
    setNewBookmarkNote('');
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
  };

  const bookBookmarks = book.bookmarks || [];

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
        fixed top-0 right-0 h-full w-80 transform transition-transform duration-300
        lg:relative lg:transform-none lg:w-72
        ${getThemeClasses()} border-l shadow-lg
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <BookmarkIcon className="w-5 h-5" />
            <h2 className="font-semibold">Bookmarks</h2>
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

        <div className="p-4 space-y-4">
          {/* Add new bookmark */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm opacity-70">Add Bookmark</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Add a note (optional)"
                value={newBookmarkNote}
                onChange={(e) => setNewBookmarkNote(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent"
              />
              <Button
                onClick={handleAddBookmark}
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Bookmark Page {currentPage}
              </Button>
            </div>
          </div>

          {/* Bookmarks list */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm opacity-70">
              Your Bookmarks ({bookBookmarks.length})
            </h3>
            
            {bookBookmarks.length === 0 ? (
              <p className="text-sm opacity-60 text-center py-4">
                No bookmarks yet. Add one above!
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bookBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all duration-200
                      hover:bg-opacity-10 hover:bg-gray-500
                      ${currentPage === bookmark.pageNumber 
                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                        : ''
                      }
                    `}
                    onClick={() => {
                      onPageSelect(bookmark.pageNumber);
                      onClose();
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <p className="font-medium text-sm">
                          Page {bookmark.pageNumber}
                        </p>
                        {bookmark.note && (
                          <p className="text-xs opacity-70 mt-1">
                            {bookmark.note}
                          </p>
                        )}
                        <p className="text-xs opacity-50 mt-1">
                          {bookmark.dateCreated.toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBookmark(bookmark.id);
                        }}
                        className="p-1 h-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkSidebar;
