import pdfToText from 'react-pdftotext';
import { PDFExtractResult } from '../types/pdf';

/**
 * Extract text from a PDF file
 */
export const extractTextFromPdf = async (file: File): Promise<PDFExtractResult> => {
  try {
    const extractedText = await pdfToText(file);
    
    return {
      text: extractedText,
      pageCount: 1, // This is approximate as pdfToText doesn't return page count
      isLoading: false
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return {
      text: '',
      pageCount: 0,
      isLoading: false,
      error: 'Failed to extract text from PDF'
    };
  }
};

/**
 * Validate PDF file (size, type)
 */
export const validatePdfFile = (file: File): { valid: boolean; error?: string } => {
  // Check if it's a PDF
  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    return { valid: false, error: 'Please upload a PDF file' };
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size should not exceed 5MB' };
  }
  
  return { valid: true };
};