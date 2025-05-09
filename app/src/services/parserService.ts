import { Resume, Education, Experience, Project, Award, Skills } from '../types/resume';

/**
 * Parse resume text to extract structured information
 */
export const parseResume = (text: string): Resume => {
  // Initialize empty resume object
  const resume: Resume = {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    profile: extractProfile(text),
    education: extractEducation(text),
    experience: extractExperience(text),
    skills: extractSkills(text),
    projects: extractProjects(text),
    awards: extractAwards(text)
  };
  
  return resume;
};

/**
 * Extract name from resume text
 */
const extractName = (text: string): string => {
  // Try to find name at the top of resume (common format)
  const topNameRegex = /^\s*([A-Z][a-z]+(\s+[A-Z][a-z]+)+)/m;
  const topNameMatch = text.match(topNameRegex);
  
  // Look for name formatted as "Name:" or in a section labeled "NAME"
  const labeledNameRegex = /(?:Name|NAME):\s*([A-Z][a-z]+(\s+[A-Z][a-z]+)+)/;
  const labeledNameMatch = text.match(labeledNameRegex);
  
  // Look for a name in uppercase/title case that appears in the first few lines
  const firstFewLines = text.split('\n').slice(0, 5).join('\n');
  const prominentNameRegex = /([A-Z][a-z]+(?: [A-Z][a-z]+)+)/;
  const prominentNameMatch = firstFewLines.match(prominentNameRegex);
  
  // Use the most likely match
  if (topNameMatch && topNameMatch[1]) {
    return topNameMatch[1].trim();
  } else if (labeledNameMatch && labeledNameMatch[1]) {
    return labeledNameMatch[1].trim();
  } else if (prominentNameMatch && prominentNameMatch[1]) {
    return prominentNameMatch[1].trim();
  }
  
  return "Unknown";
};

/**
 * Extract email from resume text
 */
const extractEmail = (text: string): string => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = text.match(emailRegex);
  return emailMatch ? emailMatch[0] : '';
};

/**
 * Extract phone number from resume text
 */
const extractPhone = (text: string): string => {
  // Match various phone formats with international code
  const phoneRegex = /(?:\+\d{1,3}[- ]?)?\(?(?:\d{3})\)?[- ]?\d{3}[- ]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  return phoneMatch ? phoneMatch[0] : '';
};

/**
 * Extract location from resume text
 */
const extractLocation = (text: string): string => {
  // Look for common location patterns (City, State/Country format)
  const locationRegex = /(?:Location|Address|Location:)?\s*((?:[A-Z][a-z]+,?\s*)+(?:[A-Z]{2}|[A-Z][a-z]+))/;
  const match = text.match(locationRegex);
  
  // Try to find location at the end of contact info section
  const linesWithAddress = text.split('\n').filter(line => 
    /(?:City|State|Country|Location|Address|[A-Z][a-z]+,\s*[A-Z]{2})/.test(line)
  );
  
  if (match && match[1]) {
    return match[1].trim();
  } else if (linesWithAddress.length > 0) {
    return linesWithAddress[0].trim();
  }
  
  return '';
};

/**
 * Extract profile/summary from resume text
 */
const extractProfile = (text: string): string => {
  // Look for sections titled Profile, Summary, About, Objective, etc.
  const profileRegex = /(?:PROFILE|Profile|Summary|About|Objective)[:\s]*(.*?)(?=\n\s*(?:[A-Z][A-Z\s]+:|\n\s*[A-Z][A-Z\s]+\s*\n))/is;
  const match = text.match(profileRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // If no profile section found, look for the first paragraph that might be a summary
  const paragraphs = text.split(/\n\s*\n/);
  for (let i = 0; i < 3 && i < paragraphs.length; i++) {
    const para = paragraphs[i].trim();
    if (para.length > 100 && !para.includes(':') && !para.match(/^[A-Z\s]+$/)) {
      return para;
    }
  }
  
  return '';
};

/**
 * Extract education information from resume text
 */
const extractEducation = (text: string): Education[] => {
  const education: Education[] = [];
  
  // Extract education section
  const educationRegex = /(?:EDUCATION|Education)[:\s]*(.*?)(?=\n\s*(?:[A-Z][A-Z\s]+:|\n\s*[A-Z][A-Z\s]+\s*\n))/is;
  const match = text.match(educationRegex);
  
  if (match && match[1]) {
    const educationText = match[1].trim();
    const educationItems = educationText.split(/\n\s*(?=[A-Z])/);
    
    educationItems.forEach(item => {
      if (item.trim()) {
        // Try to extract institution, degree, field, grade
        const institutionMatch = item.match(/([A-Za-z\s]+)/);
        const degreeMatch = item.match(/(?:B\.Tech|Bachelor|Master|Ph\.D|MBA|M\.Tech|Class\s+(?:X|XII|10|12))/i);
        const fieldMatch = item.match(/\((.*?)\)/);
        const gradeMatch = item.match(/(?:CGPA|GPA|Percentage)[:\s-]*([0-9.]+)/i);
        
        if (institutionMatch) {
          const educationItem: Education = {
            institution: institutionMatch[1].trim(),
            degree: degreeMatch ? degreeMatch[0].trim() : '',
          };
          
          if (fieldMatch) {
            educationItem.field = fieldMatch[1].trim();
          }
          
          if (gradeMatch) {
            educationItem.grade = gradeMatch[1].trim();
          }
          
          education.push(educationItem);
        }
      }
    });
  }
  
  return education;
};

/**
 * Extract work experience from resume text
 */
const extractExperience = (text: string): Experience[] => {
  const experience: Experience[] = [];
  
  // Extract experience section
  const experienceRegex = /(?:PROFESSIONAL\s+EXPERIENCE|EXPERIENCE|Work Experience)[:\s]*(.*?)(?=\n\s*(?:[A-Z][A-Z\s]+:|\n\s*[A-Z][A-Z\s]+\s*\n))/is;
  const match = text.match(experienceRegex);
  
  if (match && match[1]) {
    const experienceText = match[1].trim();
    const experienceItems = experienceText.split(/\n\s*(?=\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/);
    
    experienceItems.forEach(item => {
      if (item.trim()) {
        // Try to extract duration, position, company, location, technologies
        const durationMatch = item.match(/(\d{4}\s*[-–]\s*(?:\d{4}|Present))/i);
        const positionMatch = item.match(/([A-Za-z\s]+Developer|Engineer|Designer|Consultant|Manager|Intern|Internship)/i);
        const companyMatch = item.match(/(?:at|for|with|,)\s+([A-Za-z0-9\s&]+)(?:,|\n|$)/i);
        const locationMatch = item.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+)(?:\n|$)/);
        const technologiesMatch = item.match(/(?:Technologies|Tech Stack|Tools)[:\s-]+([^\n]+)/i);
        
        const techList = technologiesMatch && technologiesMatch[1] ? 
          technologiesMatch[1].split(/[,.]/).map(tech => tech.trim()).filter(Boolean) : 
          [];
        
        if (durationMatch || positionMatch || companyMatch) {
          experience.push({
            company: companyMatch ? companyMatch[1].trim() : 'Unknown Company',
            position: positionMatch ? positionMatch[1].trim() : 'Unknown Position',
            duration: durationMatch ? durationMatch[1].trim() : '',
            location: locationMatch ? locationMatch[1].trim() : '',
            technologies: techList,
            description: item.split('\n')
              .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
              .map(line => line.trim().replace(/^[•-]\s*/, ''))
          });
        }
      }
    });
  }
  
  return experience;
};

/**
 * Extract skills from resume text
 */
const extractSkills = (text: string): Skills => {
  const skills: Skills = {
    languages: [],
    frontend: [],
    backend: [],
    other: []
  };
  
  // Extract skills section
  const skillsRegex = /(?:SKILLS|Skills|TECHNICAL SKILLS)[:\s]*(.*?)(?=\n\s*(?:[A-Z][A-Z\s]+:|\n\s*[A-Z][A-Z\s]+\s*\n))/is;
  const match = text.match(skillsRegex);
  
  if (match && match[1]) {
    const skillsText = match[1].trim();
    
    // Look for categorized skills
    const languagesMatch = skillsText.match(/(?:Languages|Programming Languages)[:\s]+(.*?)(?=\n\s*[A-Z]|$)/is);
    const frontendMatch = skillsText.match(/(?:Frontend|Front-end|UI\/UX)[:\s]+(.*?)(?=\n\s*[A-Z]|$)/is);
    const backendMatch = skillsText.match(/(?:Backend|Back-end|Server-side)[:\s]+(.*?)(?=\n\s*[A-Z]|$)/is);
    const otherMatch = skillsText.match(/(?:Other|Tools|Libraries|Frameworks)[:\s]+(.*?)(?=\n\s*[A-Z]|$)/is);
    
    if (languagesMatch && languagesMatch[1]) {
      skills.languages = languagesMatch[1].split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    }
    
    if (frontendMatch && frontendMatch[1]) {
      skills.frontend = frontendMatch[1].split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    }
    
    if (backendMatch && backendMatch[1]) {
      skills.backend = backendMatch[1].split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    }
    
    if (otherMatch && otherMatch[1]) {
      skills.other = otherMatch[1].split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    }
    
    // If no categorized skills found, try to extract all skills
    if (!skills.languages?.length && !skills.frontend?.length && 
        !skills.backend?.length && !skills.other?.length) {
      const allSkills = skillsText.split(/[,\n•-]/).map(s => s.trim()).filter(Boolean);
      
      // Try to categorize the skills
      allSkills.forEach(skill => {
        if (/Java|Python|C\+\+|Ruby|Swift|Kotlin|Go|Rust|C#|PHP/i.test(skill)) {
          skills.languages?.push(skill);
        } else if (/HTML|CSS|React|Angular|Vue|DOM|JavaScript|TypeScript|UI|UX|SASS|LESS/i.test(skill)) {
          skills.frontend?.push(skill);
        } else if (/Node|Express|Django|Flask|SQL|Mongo|Database|API|Server|Backend|REST|GraphQL/i.test(skill)) {
          skills.backend?.push(skill);
        } else {
          skills.other?.push(skill);
        }
      });
    }
  }
  
  return skills;
};

/**
 * Extract projects from resume text
 */
const extractProjects = (text: string): Project[] => {
  const projects: Project[] = [];
  
  // Extract projects section
  const projectsRegex = /(?:PROJECTS|Projects)[:\s]*(.*?)(?=\n\s*(?:[A-Z][A-Z\s]+:|\n\s*[A-Z][A-Z\s]+\s*\n))/is;
  const match = text.match(projectsRegex);
  
  if (match && match[1]) {
    const projectsText = match[1].trim();
    // Split by dates or project titles
    const projectItems = projectsText.split(/\n\s*(?=\d{2}\/\d{4}|[A-Z][a-z]+\s*-)/);
    
    projectItems.forEach(item => {
      if (item.trim()) {
        // Try to extract title, duration, technologies, description
        const titleMatch = item.match(/(?:-|–)\s*([A-Za-z0-9\s&-]+)(?:\n|$)/);
        const durationMatch = item.match(/(\d{1,2}\/\d{4}\s*[-–]\s*(?:\d{1,2}\/\d{4}|Present))/i);
        const technologiesMatch = item.match(/(?:Technologies used|Technologies|Tech Stack)[:\s]+([^\n]+)/i);
        
        const descriptionLines = item.split('\n')
          .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
          .map(line => line.trim().replace(/^[•-]\s*/, ''));
        
        const techList = technologiesMatch && technologiesMatch[1] ? 
          technologiesMatch[1].split(/[,.]/).map(tech => tech.trim()).filter(Boolean) : 
          [];
        
        if (titleMatch || durationMatch) {
          projects.push({
            title: titleMatch ? titleMatch[1].trim() : 'Unnamed Project',
            duration: durationMatch ? durationMatch[1].trim() : '',
            technologies: techList,
            description: descriptionLines
          });
        }
      }
    });
  }
  
  return projects;
};

/**
 * Extract awards/achievements from resume text
 */
const extractAwards = (text: string): Award[] => {
  const awards: Award[] = [];
  
  // Extract awards section
  const awardsRegex = /(?:AWARDS|Awards|Achievements|Honors)[:\s]*(.*?)(?=\n\s*(?:[A-Z][A-Z\s]+:|\n\s*[A-Z][A-Z\s]+\s*\n)|$)/is;
  const match = text.match(awardsRegex);
  
  if (match && match[1]) {
    const awardsText = match[1].trim();
    const awardItems = awardsText.split(/\n\s*(?=\d{2}\/\d{4}|\d{4}|[A-Z][a-z]+\s*\d{4})/);
    
    awardItems.forEach(item => {
      if (item.trim()) {
        // Try to extract title, date
        const dateMatch = item.match(/(\d{1,2}\/\d{4}|\d{2,4})/);
        // The remaining text is likely the title
        const titleText = item.replace(dateMatch ? dateMatch[0] : '', '').trim();
        
        if (titleText) {
          awards.push({
            title: titleText.split('\n')[0].trim(),
            date: dateMatch ? dateMatch[0] : '',
            description: titleText.split('\n').slice(1).join('\n').trim()
          });
        }
      }
    });
  }
  
  return awards;
};