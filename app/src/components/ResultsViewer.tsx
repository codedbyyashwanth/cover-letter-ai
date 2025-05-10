/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Copy, Download, Check, RefreshCw, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Resume, JobDescription } from '../types/resume';
import { generateCoverLetter } from '../services/coverLetterService';

interface ResultsViewerProps {
    resume: Resume;
    jobDescription: JobDescription;
    rawResumeText: string;
}

const ResultsViewer = ({ resume, jobDescription, rawResumeText }: ResultsViewerProps) => {
    const [activeTab, setActiveTab] = useState('resume');
    const [editableResumeText, setEditableResumeText] = useState(rawResumeText);
    const [editableJobText, setEditableJobText] = useState(jobDescription.jobDescription);
    const [coverLetter, setCoverLetter] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        // Generate cover letter on component mount
        handleGenerateCoverLetter();
    }, []);
    
    const handleGenerateCoverLetter = async () => {
        setIsGenerating(true);
        setError(null);
        
        try {
            // Use the actual generateCoverLetter function that calls the API
            const letter = await generateCoverLetter(resume, jobDescription);
            setCoverLetter(letter);
        } catch (err) {
            console.error('Error generating cover letter:', err);
            setError('Failed to generate cover letter. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
  
    const handleDownload = () => {
        // Create blob from text
        const blob = new Blob([coverLetter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cover Letter - ${jobDescription.position} at ${jobDescription.company}.txt`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
  
    return (
        <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6 grid grid-cols-3">
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="job">Job Description</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resume" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Extracted Resume Data</h3>
                <span className="text-sm text-gray-500 flex items-center">
                <Edit className="w-4 h-4 mr-1" />
                Edit as needed
                </span>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
                <h2 className="text-xl font-bold">{resume.name}</h2>
                <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
                {resume.email && <span>{resume.email}</span>}
                {resume.phone && <span>• {resume.phone}</span>}
                {resume.location && <span>• {resume.location}</span>}
                </div>
                
                {resume.profile && (
                <div className="mt-4">
                    <h3 className="font-medium mb-1">Profile</h3>
                    <p className="text-sm">{resume.profile}</p>
                </div>
                )}
                
                {resume.skills && (
                <div className="mt-4">
                    <h3 className="font-medium mb-1">Skills</h3>
                    <div className="space-y-2">
                    {resume.skills.languages && (
                        <div>
                        <span className="text-sm font-medium">Languages: </span>
                        <span className="text-sm">{resume.skills.languages.join(', ')}</span>
                        </div>
                    )}
                    {resume.skills.frontend && (
                        <div>
                        <span className="text-sm font-medium">Frontend: </span>
                        <span className="text-sm">{resume.skills.frontend.join(', ')}</span>
                        </div>
                    )}
                    {resume.skills.backend && (
                        <div>
                        <span className="text-sm font-medium">Backend: </span>
                        <span className="text-sm">{resume.skills.backend.join(', ')}</span>
                        </div>
                    )}
                    {resume.skills.other && (
                        <div>
                        <span className="text-sm font-medium">Other: </span>
                        <span className="text-sm">{resume.skills.other.join(', ')}</span>
                        </div>
                    )}
                    </div>
                </div>
                )}
                
                {resume.experience && resume.experience.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-medium mb-1">Experience</h3>
                    <div className="space-y-3">
                    {resume.experience.map((exp, index) => (
                        <div key={index} className="text-sm">
                        <div className="flex justify-between">
                            <span className="font-medium">{exp.position}</span>
                            <span>{exp.duration}</span>
                        </div>
                        <div className="text-gray-600">{exp.company}</div>
                        {exp.description && (
                            <ul className="mt-1 ml-4 list-disc text-sm">
                            {exp.description.map((desc, i) => (
                                <li key={i}>{desc}</li>
                            ))}
                            </ul>
                        )}
                        </div>
                    ))}
                    </div>
                </div>
                )}
                
                {resume.education && resume.education.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-medium mb-1">Education</h3>
                    <div className="space-y-2">
                    {resume.education.map((edu, index) => (
                        <div key={index} className="text-sm">
                        <div className="font-medium">{edu.institution}</div>
                        <div className="text-gray-600">
                            {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                            {edu.grade ? ` • ${edu.grade}` : ''}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>
            
            <div>
                <h3 className="text-sm font-medium mb-1">Raw Resume Text</h3>
                <Textarea 
                value={editableResumeText}
                onChange={(e) => setEditableResumeText(e.target.value)}
                className="min-h-[200px] font-mono text-xs"
                />
            </div>
            </TabsContent>
            
            <TabsContent value="job" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Job Details</h3>
                <span className="text-sm text-gray-500 flex items-center">
                <Edit className="w-4 h-4 mr-1" />
                Edit as needed
                </span>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
                <h2 className="text-xl font-bold">{jobDescription.position}</h2>
                <div className="text-gray-600 mb-4">
                {jobDescription.company}
                {jobDescription.location && <span> • {jobDescription.location}</span>}
                </div>
                
                {jobDescription.requirements && jobDescription.requirements.length > 0 && (
                <div className="mt-2">
                    <h3 className="font-medium mb-1">Key Requirements</h3>
                    <ul className="list-disc ml-5 space-y-1 text-sm">
                    {jobDescription.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
            
            <div>
                <h3 className="text-sm font-medium mb-1">Job Description Text</h3>
                <Textarea 
                value={editableJobText}
                onChange={(e) => setEditableJobText(e.target.value)}
                className="min-h-[200px] font-mono text-xs"
                />
            </div>
            </TabsContent>
            
            <TabsContent value="cover-letter" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Generated Cover Letter</h3>
                <div className="flex space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateCoverLetter}
                    disabled={isGenerating}
                    className="flex items-center"
                >
                    {isGenerating ? (
                    <>
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        Regenerating...
                    </>
                    ) : (
                    <>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerate
                    </>
                    )}
                </Button>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopy}
                >
                    {copied ? (
                    <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied
                    </>
                    ) : (
                    <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                    </>
                    )}
                </Button>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownload}
                >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                </Button>
                </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
                {isGenerating ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                    <RefreshCw className="w-8 h-8 mb-4 animate-spin" />
                    <p>Generating your cover letter...</p>
                </div>
                ) : error ? (
                <div className="py-10 flex flex-col items-center justify-center text-red-500">
                    <p>{error}</p>
                    <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateCoverLetter}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
                ) : (
                <Textarea 
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="min-h-[400px] w-full border-0 focus:ring-0 resize-none font-serif text-sm"
                />
                )}
            </div>
            </TabsContent>
        </Tabs>
        </div>
    );
};

export default ResultsViewer;