import { useState } from 'react';
import { Upload, File, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { PDFExtractResult } from '../types/pdf';
import pdfToText from 'react-pdftotext';

interface PdfUploadTabProps {
  onPdfProcessed: (result: PDFExtractResult) => void;
}

const PdfUploadTab = ({ onPdfProcessed }: PdfUploadTabProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    // Check file type
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf') && 
        !file.name.endsWith('.docx') && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Check file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size should not exceed 2MB');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    
    try {
      const extractedText = await pdfToText(file);
      onPdfProcessed({
        text: extractedText,
        pageCount: 1, // This is an approximation as pdfToText doesn't return page count
        isLoading: false
      });
    } catch (err) {
      setError('Failed to extract text from file');
      console.error(err);
      onPdfProcessed({
        text: '',
        pageCount: 0,
        isLoading: false,
        error: 'Failed to extract text from file'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-center mb-4">Upload Your Resume</h2>
      <p className="text-center text-gray-600 mb-6">
        In order to fully customize your cover letter, upload your resume
      </p>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold">Drop your resume here or choose a file</h3>
          <p className="text-gray-500 mb-4">PDF & DOCX only. Max 2MB file size.</p>
          
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="mr-2" asChild>
              <span>Browse Files</span>
            </Button>
          </label>
        </div>
        
        {fileName && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center">
            <File className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium">{fileName}</span>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfUploadTab;