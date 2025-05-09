import { useState } from 'react';
import PdfUploader from './components/PdfUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResultsViewer from './components/ResultsViewer';
import ProgressSteps from './components/ProgressSteps';
import { Resume, JobDescription } from './types/resume';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resume, setResume] = useState<Resume | null>(null);
  const [rawResumeText, setRawResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  
  const steps = ['Upload Resume', 'Job Description', 'Generate'];
  
  const handleResumeExtracted = (extractedResume: Resume, rawText: string) => {
    setResume(extractedResume);
    setRawResumeText(rawText);
    setCurrentStep(2);
  };
  
  const handleJobDescriptionSubmit = (jobDesc: JobDescription) => {
    setJobDescription(jobDesc);
    setCurrentStep(3);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Cover Letter Generator</h1>
        <p className="text-center text-gray-600 mb-8">
          Upload your resume, add a job description, and generate a tailored cover letter
        </p>
        
        <ProgressSteps currentStep={currentStep} steps={steps} />
        
        <div className="py-4">
          {currentStep === 1 && (
            <PdfUploader onResumeExtracted={handleResumeExtracted} />
          )}
          
          {currentStep === 2 && (
            <JobDescriptionInput onJobDescriptionSubmit={handleJobDescriptionSubmit} />
          )}
          
          {currentStep === 3 && resume && jobDescription && (
            <ResultsViewer 
              resume={resume} 
              jobDescription={jobDescription} 
              rawResumeText={rawResumeText}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;