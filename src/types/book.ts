
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  content: BookContent[];
  totalPages: number;
  lastReadPosition?: number;
  bookmarks: Bookmark[];
  dateAdded: Date;
  fileSize?: string;
}

export interface BookContent {
  id: string;
  chapterTitle: string;
  content: string;
  pageNumber: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  pageNumber: number;
  position: number;
  note?: string;
  dateCreated: Date;
}

export interface ReadingSettings {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'inter' | 'crimson' | 'open-sans';
  lineHeight: 'normal' | 'relaxed' | 'loose';
}
