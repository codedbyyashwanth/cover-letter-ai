import { useState } from 'react';
import { Link, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { extractJobRequirements } from '../services/coverLetterService';
import { JobDescription } from '../types/resume';

interface JobDescriptionInputProps {
  onJobDescriptionSubmit: (jobDescription: JobDescription) => void;
}

const JobDescriptionInput = ({ onJobDescriptionSubmit }: JobDescriptionInputProps) => {
  const [activeTab, setActiveTab] = useState('text');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [jobDetails, setJobDetails] = useState<{
    company: string;
    position: string;
    location: string;
  }>({
    company: '',
    position: '',
    location: ''
  });
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescriptionText(e.target.value);
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobUrl(e.target.value);
  };
  
  const handleJobDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleExtractFromUrl = async () => {
    if (!jobUrl) {
      setError('Please enter a job posting URL');
      return;
    }
    
    // URL validation
    try {
      new URL(jobUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Simulating web scraping
    try {
      // This would normally be an API call to your backend
      setTimeout(() => {
        const scrapedText = `
Job Title: Senior Frontend Developer
Company: TechNova Solutions
Location: Remote, US

About Us:
TechNova Solutions is a leading technology company specializing in innovative software solutions for enterprise clients. We're looking for a talented Senior Frontend Developer to join our growing team.

Responsibilities:
• Develop responsive web applications using React and TypeScript
• Collaborate with UX/UI designers to implement intuitive user interfaces
• Work closely with backend developers to integrate APIs
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and contribute to continuous improvement

Requirements:
• 3+ years of experience with React.js
• Strong proficiency in TypeScript and JavaScript
• Experience with state management (Redux, Context API)
• Knowledge of modern frontend tools and build processes
• Experience with responsive design and CSS frameworks
• Understanding of cross-browser compatibility issues
• Excellent problem-solving skills
• Strong communication and teamwork abilities

Nice to Have:
• Experience with Next.js
• Knowledge of testing frameworks (Jest, Cypress)
• Experience with GraphQL
• Understanding of CI/CD processes
• Previous experience in agile development teams

Benefits:
• Competitive salary and equity
• Flexible working hours
• Remote-first culture
• Health insurance
• Professional development opportunities
• 401(k) matching
        `;
        
        setExtractedText(scrapedText);
        setJobDescriptionText(scrapedText);
        
        // Try to extract company and position from the scraped text
        const positionMatch = scrapedText.match(/Job Title:?\s*([^\n]+)/i);
        const companyMatch = scrapedText.match(/Company:?\s*([^\n]+)/i);
        const locationMatch = scrapedText.match(/Location:?\s*([^\n]+)/i);
        
        if (positionMatch || companyMatch) {
          setJobDetails({
            position: positionMatch ? positionMatch[1].trim() : '',
            company: companyMatch ? companyMatch[1].trim() : '',
            location: locationMatch ? locationMatch[1].trim() : ''
          });
        }
        
        setIsLoading(false);
      }, 1500);
    } catch {
      setError('Failed to extract job description from URL');
      setIsLoading(false);
    }
  };
  
  const handleSubmit = () => {
    const textToProcess = activeTab === 'text' ? jobDescriptionText : extractedText;
    
    if (!textToProcess) {
      setError('Please enter a job description');
      return;
    }
    
    if (!jobDetails.company || !jobDetails.position) {
      setError('Please enter company name and position');
      return;
    }
    
    // Extract requirements from the job description
    const requirements = extractJobRequirements(textToProcess);
    
    // Create job description object
    const jobDescription: JobDescription = {
      company: jobDetails.company,
      position: jobDetails.position,
      location: jobDetails.location,
      requirements: requirements,
      jobDescription: textToProcess
    };
    
    // Submit to parent component
    onJobDescriptionSubmit(jobDescription);
  };
  
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-2">
          <TabsTrigger value="text" className="rounded-l-md">Enter Text</TabsTrigger>
          <TabsTrigger value="url" className="rounded-r-md">Paste URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <Textarea 
            placeholder="Paste or type the job description here..."
            className="min-h-[200px] font-sans text-sm"
            value={jobDescriptionText}
            onChange={handleTextChange}
          />
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                placeholder="https://example.com/jobs/frontend-developer"
                value={jobUrl}
                onChange={handleUrlChange}
                className="pl-10"
              />
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <Button 
              onClick={handleExtractFromUrl}
              disabled={isLoading || !jobUrl}
              className="whitespace-nowrap"
            >
              {isLoading ? 'Extracting...' : 'Extract'}
              <ExternalLink className="ml-2" size={16} />
            </Button>
          </div>
          
          {extractedText && (
            <div className="mt-4">
              <Label>Extracted Job Description</Label>
              <Textarea 
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="min-h-[200px] mt-2 font-sans text-sm"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">Job Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input 
              id="company" 
              name="company" 
              placeholder="e.g. Acme Inc." 
              value={jobDetails.company}
              onChange={handleJobDetailsChange}
            />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input 
              id="position" 
              name="position" 
              placeholder="e.g. Frontend Developer" 
              value={jobDetails.position}
              onChange={handleJobDetailsChange}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input 
              id="location" 
              name="location" 
              placeholder="e.g. Remote, New York, NY" 
              value={jobDetails.location}
              onChange={handleJobDetailsChange}
            />
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default JobDescriptionInput;