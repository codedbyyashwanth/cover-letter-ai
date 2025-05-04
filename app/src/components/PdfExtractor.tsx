import React, { useState } from 'react';
import pdfToText from 'react-pdftotext';

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  profile: string;
}

const PdfExtractor = () => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    setResumeData(null);
    
    try {
      // Extract text from PDF
      const extractedText = await pdfToText(file);
      setText(extractedText);
      
      // Send text to backend for processing
      const response = await fetch('http://localhost:3001/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: extractedText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }
      
      const data = await response.json();
      setResumeData(data);
    } catch (err) {
      setError('Failed to process resume');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Resume Parser</h1>
      
      <div className="w-full mb-6">
        <label 
          htmlFor="pdf-upload" 
          className="block w-full p-6 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          Upload your resume (PDF)
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      
      {isLoading && <p>Processing resume, please wait...</p>}
      
      {error && (
        <div className="w-full p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      {resumeData && (
        <div className="w-full bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">{resumeData.name}</h2>
          <p className="mb-2"><strong>Email:</strong> {resumeData.email}</p>
          <p className="mb-2"><strong>Phone:</strong> {resumeData.phone}</p>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Profile</h3>
            <p>{resumeData.profile}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfExtractor;