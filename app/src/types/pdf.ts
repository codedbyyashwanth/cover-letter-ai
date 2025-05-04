export interface PDFFile {
    name: string;
    size: number;
    type: string;
    data?: ArrayBuffer;
  }
  
  export interface PDFExtractResult {
    text: string;
    pageCount: number;
    isLoading: boolean;
    error?: string;
}