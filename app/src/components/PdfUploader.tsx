import { useState } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';
import { extractTextFromPdf, validatePdfFile } from '../services/pdfService';
import { parseResume } from '../services/parserService';
import { Resume } from '../types/resume';
import { PDFExtractResult } from '../types/pdf';

interface PdfUploaderProps {
  onResumeExtracted: (resume: Resume, rawText: string) => void;
}

const PdfUploader = ({ onResumeExtracted }: PdfUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
    // Validate file
    const validation = validatePdfFile(file);
    if (!validation.valid) {
      setError(validation.error ?? null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    
    try {
      // Extract text from PDF
      const result: PDFExtractResult = await extractTextFromPdf(file);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      // Parse resume data
      const resumeData = parseResume(result.text);
      
      // Call the parent callback with the parsed resume
      onResumeExtracted(resumeData, result.text);
    } catch (err) {
      console.error('Error processing resume:', err);
      setError('Failed to process resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <div className="mb-4 p-3 bg-gray-100 rounded-full">
            <Upload className="w-8 h-8 text-gray-500" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
          <p className="text-gray-500 mb-4 text-center">
            Drag and drop your PDF here, or click to browse
          </p>
          
          <label 
            htmlFor="resume-upload" 
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer transition-colors"
          >
            Browse Files
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
          </label>
          
          <p className="mt-2 text-xs text-gray-500">
            PDF only. Max file size: 5MB
          </p>
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md flex items-center">
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-blue-600">Processing your resume...</p>
        </div>
      )}
      
      {fileName && !isLoading && !error && (
        <div className="mt-4 p-4 bg-green-50 rounded-md flex items-center">
          <File className="w-5 h-5 text-green-500 mr-2" />
          <p className="text-green-600">
            <span className="font-medium">{fileName}</span> uploaded successfully
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;