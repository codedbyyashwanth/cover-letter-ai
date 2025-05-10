import { Resume, JobDescription, CoverLetterResponse } from '../types/resume';

/**
 * Generate a cover letter based on resume and job description
 */
export const generateCoverLetter = async (
  resume: Resume, 
  jobDescription: JobDescription
): Promise<string> => {
  try {
    // Create a combined object matching your backend's expected format
    const resumeData = {
      resume,
      jobDescription
    };
    
    // Use direct URL without environment variables
    const response = await fetch('http://localhost:3001/api/generate-cover-letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate cover letter: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.coverLetter;
  } catch (error) {
    console.error('Failed to generate cover letter:', error);
    
    // Fallback to sample generator if API fails
    return generateSampleCoverLetter(resume, jobDescription);
  }
};

/**
 * Generate a sample cover letter for testing/demo purposes
 */
export const generateSampleCoverLetter = (resume: Resume, jobDescription: JobDescription): string => {
  const { name, experience } = resume;
  const { company, position } = jobDescription;
  
  // Get most recent experience
  const recentExperience = experience.length > 0 ? experience[0] : null;
  
  // Format date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Get achievement bullets from experience
  const achievements = recentExperience?.description || [
    'Successfully delivered projects on time and within budget',
    'Collaborated effectively with cross-functional teams',
    'Implemented best practices in development and testing'
  ];
  
  return `
${formattedDate}

Hiring Manager
${company}
${jobDescription.location || 'Location'}

Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${position} position at ${company}. With my background in ${recentExperience?.position || 'software development'}, I believe I would be a valuable addition to your team.

${resume.profile || `As a dedicated professional, I have consistently delivered high-quality results while focusing on efficiency and collaboration.`}

During my time at ${recentExperience?.company || 'my previous company'}, I have:
${achievements.map(desc => `- ${desc}`).join('\n')}

I am particularly excited about the opportunity to join ${company} because of your reputation for innovation and commitment to excellence. I believe my skills and experience align well with what you're looking for in a ${position}.

I would welcome the opportunity to discuss how my background, skills, and achievements can benefit your team. Thank you for considering my application.

Sincerely,
${name}
${resume.email}
${resume.phone}
  `.trim();
};

/**
 * Extract key requirements from job description
 */
export const extractJobRequirements = (text: string): string[] => {
  // Look for requirement sections or bullet points
  const requirementSection = text.match(/(?:requirements|qualifications|what you'll need)(?:[\s\S]*?)(?=(?:\n\s*\n|$))/i);
  
  if (requirementSection && requirementSection[0]) {
    // Extract bullet points or numbered lists
    const bulletPoints = requirementSection[0].match(/(?:•|\*|-|\d+\.)\s*(.*?)(?=\n|$)/g);
    
    if (bulletPoints && bulletPoints.length > 0) {
      return bulletPoints.map(point => 
        point.replace(/(?:•|\*|-|\d+\.)\s*/, '').trim()
      ).filter(Boolean);
    }
  }
  
  // If no structured requirements found, try to extract sentences that might be requirements
  const sentences = text.split(/[.!?](?:\s+|\n)/).map(s => s.trim()).filter(Boolean);
  const requirementSentences = sentences.filter(sentence => 
    /(?:you\s+(?:should|must|need)|we\s+(?:require|expect)|required|experience\s+(?:with|in)|knowledge\s+of|familiarity\s+with|experience\s+(?:using|developing)|proficiency\s+in)/i.test(sentence)
  );
  
  return requirementSentences.length > 0 ? requirementSentences : [];
};