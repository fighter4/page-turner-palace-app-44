// @ts-ignore - epubjs doesn't have official TypeScript types
import ePub from 'epubjs';
import * as pdfjsLib from 'pdfjs-dist';
import { Book, BookContent } from '@/types/book';

// Set up PDF.js worker - use CDN without ?import parameter
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.js';

export const processFile = async (file: File): Promise<Book> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileExtension) {
    case 'epub':
      return await processEPUB(file);
    case 'pdf':
      return await processPDF(file);
    case 'txt':
      return await processTXT(file);
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
};

const processEPUB = async (file: File): Promise<Book> => {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer);
  
  await book.ready;
  
  // Get metadata
  const metadata = await book.loaded.metadata;
  const navigation = await book.loaded.navigation;
  
  // Extract chapters
  const content: BookContent[] = [];
  let pageNumber = 1;
  
  for (const item of navigation.toc) {
    try {
      const section = book.section(item.href);
      const sectionContent = await section.load(book.load.bind(book));
      const textContent = sectionContent.textContent || '';
      
      content.push({
        id: `${Date.now()}-${pageNumber}`,
        chapterTitle: item.label || `Chapter ${pageNumber}`,
        content: textContent.trim(),
        pageNumber: pageNumber++
      });
    } catch (error) {
      console.warn('Error loading section:', item.href, error);
    }
  }
  
  // If no TOC, try to get spine items
  if (content.length === 0) {
    const spine = await book.loaded.spine;
    for (const item of spine.slice(0, 10)) { // Fixed: removed .items
      try {
        const section = book.section(item.href);
        const sectionContent = await section.load(book.load.bind(book));
        const textContent = sectionContent.textContent || '';
        
        if (textContent.trim().length > 100) { // Only include substantial content
          content.push({
            id: `${Date.now()}-${pageNumber}`,
            chapterTitle: `Chapter ${pageNumber}`,
            content: textContent.trim(),
            pageNumber: pageNumber++
          });
        }
      } catch (error) {
        console.warn('Error loading spine item:', item.href, error);
      }
    }
  }
  
  return {
    id: Date.now().toString(),
    title: metadata.title || file.name.replace(/\.epub$/i, ''),
    author: metadata.creator || 'Unknown Author',
    content: content.length > 0 ? content : [{
      id: `${Date.now()}-1`,
      chapterTitle: 'Content',
      content: 'Unable to extract readable content from this EPUB file.',
      pageNumber: 1
    }],
    totalPages: content.length || 1,
    lastReadPosition: 0,
    bookmarks: [],
    dateAdded: new Date(),
    fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
  };
};

const processPDF = async (file: File): Promise<Book> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const content: BookContent[] = [];
    const maxPages = Math.min(pdf.numPages, 20); // Limit to first 20 pages for performance
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();
        
        if (pageText.length > 50) { // Only include pages with substantial content
          content.push({
            id: `${Date.now()}-${pageNum}`,
            chapterTitle: `Page ${pageNum}`,
            content: pageText,
            pageNumber: pageNum
          });
        }
      } catch (error) {
        console.warn(`Error processing PDF page ${pageNum}:`, error);
      }
    }
    
    return {
      id: Date.now().toString(),
      title: file.name.replace(/\.pdf$/i, ''),
      author: 'Unknown Author',
      content: content.length > 0 ? content : [{
        id: `${Date.now()}-1`,
        chapterTitle: 'Content',
        content: 'Unable to extract readable content from this PDF file.',
        pageNumber: 1
      }],
      totalPages: content.length || 1,
      lastReadPosition: 0,
      bookmarks: [],
      dateAdded: new Date(),
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    };
  } catch (error) {
    console.error('PDF processing error:', error);
    // Return a fallback book object if PDF processing fails
    return {
      id: Date.now().toString(),
      title: file.name.replace(/\.pdf$/i, ''),
      author: 'Unknown Author',
      content: [{
        id: `${Date.now()}-1`,
        chapterTitle: 'Error',
        content: `Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
        pageNumber: 1
      }],
      totalPages: 1,
      lastReadPosition: 0,
      bookmarks: [],
      dateAdded: new Date(),
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    };
  }
};

const processTXT = async (file: File): Promise<Book> => {
  const text = await file.text();
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  
  // Split into chapters (roughly 2000 characters each)
  const content: BookContent[] = [];
  let currentChapter = '';
  let chapterNumber = 1;
  
  for (const paragraph of paragraphs) {
    if (currentChapter.length + paragraph.length > 2000 && currentChapter.length > 0) {
      content.push({
        id: `${Date.now()}-${chapterNumber}`,
        chapterTitle: `Chapter ${chapterNumber}`,
        content: currentChapter.trim(),
        pageNumber: chapterNumber
      });
      currentChapter = paragraph;
      chapterNumber++;
    } else {
      currentChapter += (currentChapter ? '\n\n' : '') + paragraph;
    }
  }
  
  // Add the last chapter
  if (currentChapter.trim()) {
    content.push({
      id: `${Date.now()}-${chapterNumber}`,
      chapterTitle: `Chapter ${chapterNumber}`,
      content: currentChapter.trim(),
      pageNumber: chapterNumber
    });
  }
  
  return {
    id: Date.now().toString(),
    title: file.name.replace(/\.txt$/i, ''),
    author: 'Unknown Author',
    content: content.length > 0 ? content : [{
      id: `${Date.now()}-1`,
      chapterTitle: 'Content',
      content: text.trim() || 'Empty file.',
      pageNumber: 1
    }],
    totalPages: content.length || 1,
    lastReadPosition: 0,
    bookmarks: [],
    dateAdded: new Date(),
    fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
  };
};
