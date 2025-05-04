import React, { useState } from 'react';
import pdfToText from 'react-pdftotext';

const PdfExtractor = () => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const extractedText = await pdfToText(file);
      setText(extractedText);
    } catch (err) {
      setError('Failed to extract text from PDF');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">PDF Text Extractor</h1>
      
      <div className="w-full mb-6">
        <label 
          htmlFor="pdf-upload" 
          className="block w-full p-6 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          Click to upload a PDF or drag and drop
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      
      {isLoading && <p>Extracting text, please wait...</p>}
      
      {error && (
        <div className="w-full p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      {text && (
        <div className="w-full">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg font-medium">Extracted Text</h2>
            <button 
              onClick={() => navigator.clipboard.writeText(text)}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              Copy Text
            </button>
          </div>
          <div className="p-4 border rounded-lg max-h-[400px] overflow-auto whitespace-pre-wrap bg-gray-50">
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfExtractor;