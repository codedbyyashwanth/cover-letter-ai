export interface Resume {
  name: string;
  email: string;
  phone: string;
  location: string;
  profile: string;
  education: Education[];
  experience: Experience[];
  skills: Skills;
  projects: Project[];
  awards: Award[];
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  grade?: string;
  year?: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  location?: string;
  technologies?: string[];
  description?: string[];
}

export interface Skills {
  languages?: string[];
  frontend?: string[];
  backend?: string[];
  other?: string[];
}

export interface Project {
  title: string;
  duration: string;
  technologies: string[];
  description: string[];
}

export interface Award {
  title: string;
  date: string;
  description?: string;
}

export interface JobDescription {
  company: string;
  position: string;
  requirements: string[];
  jobDescription: string;
  location?: string;
}

export interface CoverLetterRequest {
  resume: Resume;
  jobDescription: JobDescription;
}

export interface CoverLetterResponse {
  coverLetter: string;
}