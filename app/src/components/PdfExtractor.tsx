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
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    setResumeData(null);
    setCoverLetter('');
    
    try {
      // Extract text from PDF
      const extractedText = await pdfToText(file);
      setText(extractedText);
      
      // Extract resume data in the frontend
      const parsedResume = parseResume(extractedText);
      setResumeData(parsedResume);
    } catch (err) {
      setError('Failed to process resume');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to parse resume text and extract information
  const parseResume = (text: string): ResumeData => {
    // Extract name - look for a name at the beginning of the resume
    const nameRegex = /^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m;
    const nameMatch = text.match(nameRegex);
    const name = nameMatch ? nameMatch[1] : 'Unknown';
    
    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Extract phone number (various formats)
    const phoneRegex = /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
    const phoneMatch = text.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : '';
    
    // Extract skills - look for common section headers and lists
    const skillsSection = text.match(/skills:?(.*?)(?=\n\n|\n[A-Z]|$)/is);
    let skills: string[] = [];
    
    if (skillsSection && skillsSection[1]) {
      // Split by commas, bullet points, or new lines
      skills = skillsSection[1]
        .split(/[,•\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0 && skill.length < 30);
    }
    
    // Extract profile/summary - often at the beginning after name/contact
    const profileSection = text.match(/(?:profile|summary|about|objective):?(.*?)(?=\n\n|\n[A-Z]|$)/is);
    let profile = '';
    
    if (profileSection && profileSection[1]) {
      profile = profileSection[1].trim();
    } else {
      // If no profile section found, use first paragraph after contact info
      const firstPara = text.split('\n\n')[1];
      if (firstPara && firstPara.length > 50) {
        profile = firstPara.trim();
      }
    }
    
    return {
      name,
      email,
      phone,
      skills,
      profile
    };
  };

  const handleGenerateCoverLetter = async () => {
    if (!resumeData) return;
    
    setGeneratingCoverLetter(true);
    setCoverLetter('');
    
    try {
      const response = await fetch('http://localhost:3001/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }
      
      const data = await response.json();
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError('Failed to generate cover letter');
      console.error(err);
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Resume Parser & Cover Letter Generator</h1>
      
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
        <div className="w-full bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">{resumeData.name}</h2>
          <p className="mb-2"><strong>Email:</strong> {resumeData.email}</p>
          <p className="mb-2"><strong>Phone:</strong> {resumeData.phone}</p>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Profile</h3>
            <p>{resumeData.profile}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleGenerateCoverLetter}
            disabled={generatingCoverLetter}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {generatingCoverLetter ? 'Generating Cover Letter...' : 'Generate Cover Letter'}
          </button>
        </div>
      )}
      
      {coverLetter && (
        <div className="w-full bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Generated Cover Letter</h2>
          <div className="whitespace-pre-line">{coverLetter}</div>
          <button
            onClick={() => navigator.clipboard.writeText(coverLetter)}
            className="mt-4 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfExtractor;