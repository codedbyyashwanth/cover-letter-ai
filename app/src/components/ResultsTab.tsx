import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ResultsTabProps {
  resumeText: string;
  jobDescription: string;
}

const ResultsTab = ({ resumeText, jobDescription }: ResultsTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    additionalNotes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate cover letter
    setTimeout(() => {
      const letter = `
Dear Hiring Manager at ${formData.company},

I am writing to express my interest in the ${formData.position} position at ${formData.company}. With my background in frontend development and experience with React and TypeScript, I believe I am well-suited for this role.

Based on the job description, I understand you're looking for someone with expertise in UI component libraries and modern web development practices. Throughout my career, I have:
- Developed responsive web applications using React and TypeScript
- Implemented UI components using design systems
- Collaborated with cross-functional teams to deliver high-quality products

${formData.additionalNotes}

I am excited about the opportunity to contribute to your team and would welcome the chance to discuss how my background and skills would be a good fit for ${formData.company}.

Thank you for considering my application. I look forward to the possibility of working together.

Sincerely,
${formData.name}
${formData.email}
${formData.phone}
`;
      
      setGeneratedLetter(letter.trim());
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-center mb-4">Customize & Generate Cover Letter</h2>
      <p className="text-center text-gray-600 mb-6">
        Add your details to personalize your cover letter
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="John Doe" 
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input 
            id="company" 
            name="company" 
            placeholder="Acme Inc." 
            value={formData.company}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input 
            id="position" 
            name="position" 
            placeholder="Frontend Developer" 
            value={formData.position}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Your Email</Label>
          <Input 
            id="email" 
            name="email" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="phone">Your Phone</Label>
          <Input 
            id="phone" 
            name="phone" 
            placeholder="+1 123-456-7890" 
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea 
          id="additionalNotes" 
          name="additionalNotes" 
          placeholder="Any additional information you'd like to include..." 
          value={formData.additionalNotes}
          onChange={handleInputChange}
          className="h-24"
        />
      </div>
      
      <div className="mb-6 text-center">
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating || !formData.name || !formData.company || !formData.position}
          className="w-full md:w-auto"
        >
          {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
        </Button>
      </div>
      
      {generatedLetter && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Your Cover Letter</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <Textarea 
              value={generatedLetter} 
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="min-h-[300px] font-sans"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTab;