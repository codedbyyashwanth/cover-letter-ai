import { useState } from 'react';
import { ArrowRight, Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface JobDescriptionTabProps {
  onSubmit: (jobDescription: string) => void;
}

const JobDescriptionTab = ({ onSubmit }: JobDescriptionTabProps) => {
  const [activeOption, setActiveOption] = useState('text');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setError(null);
    
    if (activeOption === 'text') {
      if (!jobDescription.trim()) {
        setError('Please enter a job description');
        return;
      }
      onSubmit(jobDescription);
    } else {
      if (!jobUrl.trim()) {
        setError('Please enter a job posting URL');
        return;
      }
      
      // URL validation
      try {
        new URL(jobUrl);
      } catch (e) {
        setError('Please enter a valid URL');
        return;
      }
      
      // Here you would normally call your web scraping service
      setIsLoading(true);
      try {
        // Simulating web scraping
        setTimeout(() => {
          const scrapedContent = `This is a simulated job description scraped from ${jobUrl}.
          
Position: Frontend Developer
Requirements:
- 3+ years of experience with React
- TypeScript knowledge
- Experience with UI component libraries
          
We're looking for a talented Frontend Developer to join our team.`;
          
          setJobDescription(scrapedContent);
          onSubmit(scrapedContent);
          setIsLoading(false);
        }, 1500);
      } catch (e) {
        setError('Failed to extract job description from URL');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-center mb-4">Add Job Description</h2>
      <p className="text-center text-gray-600 mb-6">
        Provide the job description to customize your cover letter
      </p>
      
      <Tabs value={activeOption} onValueChange={setActiveOption} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="text">Enter Text</TabsTrigger>
          <TabsTrigger value="url">Paste URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <div className="space-y-4">
            <Textarea 
              placeholder="Paste or type the job description here..."
              className="min-h-[200px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="url">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="https://example.com/job-posting"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  icon={<Link className="w-4 h-4 text-gray-500" />}
                />
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsLoading(true);
                  // This would normally call your web scraping service
                  setTimeout(() => {
                    const scrapedContent = `This is a simulated job description scraped from ${jobUrl}.
                    
Position: Frontend Developer
Requirements:
- 3+ years of experience with React
- TypeScript knowledge
- Experience with UI component libraries

We're looking for a talented Frontend Developer to join our team.`;
                    
                    setJobDescription(scrapedContent);
                    setIsLoading(false);
                  }, 1500);
                }}
                disabled={isLoading || !jobUrl}
              >
                Extract
              </Button>
            </div>
            
            {jobDescription && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Extracted Job Description:</h3>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{jobDescription}</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <Button 
          className="w-full md:w-auto"
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Continue'} 
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default JobDescriptionTab;