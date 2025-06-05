
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Bookmark } from '@/types/book';

interface BookContextType {
  books: Book[];
  currentBook: Book | null;
  currentPage: number;
  bookmarks: Bookmark[];
  addBook: (book: Book) => void;
  setCurrentBook: (book: Book | null) => void;
  setCurrentPage: (page: number) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (bookmarkId: string) => void;
  updateReadingProgress: (bookId: string, page: number) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// Sample books for demonstration
const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    coverUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop',
    content: [
      {
        id: '1-1',
        chapterTitle: 'Introduction to Programming',
        content: 'Programming is the art of telling a computer what to do. It involves writing instructions in a language that the computer can understand and execute. This book will guide you through the fundamental concepts of programming, starting with the basics and gradually building up to more advanced topics.\n\nThe journey of learning to program can be both challenging and rewarding. As you progress through this book, you will discover the elegant solutions that well-written code can provide to complex problems. Programming is not just about writing code; it is about thinking logically, breaking down problems into manageable pieces, and creating efficient solutions.\n\nIn this chapter, we will explore the history of programming languages, the different paradigms of programming, and the tools that programmers use in their daily work. We will also discuss the importance of good programming practices and how they contribute to writing maintainable and reliable software.',
        pageNumber: 1
      },
      {
        id: '1-2',
        chapterTitle: 'Setting Up Your Environment',
        content: 'Before you can start programming, you need to set up your development environment. This includes choosing the right tools, installing necessary software, and configuring your workspace for optimal productivity.\n\nA good development environment should include a text editor or integrated development environment (IDE), a compiler or interpreter for your chosen programming language, and version control software like Git. Many programmers also use additional tools such as debuggers, profilers, and testing frameworks to improve their workflow.\n\nThe choice of tools can significantly impact your programming experience. While it might be tempting to use the most popular or feature-rich tools, it is important to choose tools that match your skill level and project requirements. As you gain experience, you can gradually adopt more sophisticated tools and workflows.',
        pageNumber: 2
      }
    ],
    totalPages: 2,
    lastReadPosition: 0,
    bookmarks: [],
    dateAdded: new Date('2024-01-15'),
    fileSize: '2.3 MB'
  },
  {
    id: '2',
    title: 'Modern Web Development',
    author: 'John Doe',
    coverUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop',
    content: [
      {
        id: '2-1',
        chapterTitle: 'The Evolution of the Web',
        content: 'The World Wide Web has undergone tremendous changes since its inception in the early 1990s. What started as a simple system for sharing documents has evolved into a complex platform that powers everything from social networks to banking applications.\n\nIn the early days of the web, websites were mostly static collections of HTML pages with basic styling. JavaScript was introduced to add interactivity, and CSS was developed to separate content from presentation. These technologies formed the foundation of what we now call the front-end of web development.\n\nToday, web development encompasses a vast ecosystem of frameworks, libraries, and tools. Modern web applications are sophisticated software systems that can rival desktop applications in terms of functionality and user experience. The rise of mobile devices has also fundamentally changed how we approach web development, making responsive design and performance optimization more important than ever.',
        pageNumber: 1
      }
    ],
    totalPages: 1,
    lastReadPosition: 0,
    bookmarks: [],
    dateAdded: new Date('2024-02-10'),
    fileSize: '1.8 MB'
  },
  {
    id: '3',
    title: 'Design Patterns in Software',
    author: 'Alex Johnson',
    coverUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=600&fit=crop',
    content: [
      {
        id: '3-1',
        chapterTitle: 'Understanding Design Patterns',
        content: 'Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices evolved over time by experienced software developers. Design patterns are not finished designs that can be directly transformed into code; rather, they are templates that describe how to solve problems in different situations.\n\nThe concept of design patterns was popularized by the "Gang of Four" book, which identified 23 fundamental patterns divided into three categories: creational, structural, and behavioral patterns. Each pattern has a specific purpose and can be applied in appropriate contexts to improve code organization, maintainability, and reusability.\n\nUnderstanding design patterns is crucial for any serious software developer. They provide a common vocabulary for discussing design solutions and help in making architectural decisions. However, it is important to remember that patterns should be applied judiciously - not every problem requires a pattern, and overuse can lead to unnecessarily complex code.',
        pageNumber: 1
      }
    ],
    totalPages: 1,
    lastReadPosition: 0,
    bookmarks: [],
    dateAdded: new Date('2024-01-28'),
    fileSize: '3.1 MB'
  }
];

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBookState] = useState<Book | null>(null);
  const [currentPage, setCurrentPageState] = useState<number>(1);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    // Load sample books on first visit
    const savedBooks = localStorage.getItem('ebookReaderBooks');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      setBooks(sampleBooks);
      localStorage.setItem('ebookReaderBooks', JSON.stringify(sampleBooks));
    }

    const savedBookmarks = localStorage.getItem('ebookReaderBookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const addBook = (book: Book) => {
    const updatedBooks = [...books, book];
    setBooks(updatedBooks);
    localStorage.setItem('ebookReaderBooks', JSON.stringify(updatedBooks));
  };

  const setCurrentBook = (book: Book | null) => {
    setCurrentBookState(book);
    if (book) {
      setCurrentPageState(book.lastReadPosition || 1);
    }
  };

  const setCurrentPage = (page: number) => {
    setCurrentPageState(page);
    if (currentBook) {
      updateReadingProgress(currentBook.id, page);
    }
  };

  const addBookmark = (bookmark: Bookmark) => {
    const updatedBookmarks = [...bookmarks, bookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem('ebookReaderBookmarks', JSON.stringify(updatedBookmarks));
  };

  const removeBookmark = (bookmarkId: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('ebookReaderBookmarks', JSON.stringify(updatedBookmarks));
  };

  const updateReadingProgress = (bookId: string, page: number) => {
    const updatedBooks = books.map(book => 
      book.id === bookId ? { ...book, lastReadPosition: page } : book
    );
    setBooks(updatedBooks);
    localStorage.setItem('ebookReaderBooks', JSON.stringify(updatedBooks));
  };

  return (
    <BookContext.Provider value={{
      books,
      currentBook,
      currentPage,
      bookmarks,
      addBook,
      setCurrentBook,
      setCurrentPage,
      addBookmark,
      removeBookmark,
      updateReadingProgress
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
