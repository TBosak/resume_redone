export interface ResumeBasics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: {
    countryCode: string;
    address: string;
  };
  profiles: {
    network: string;
    username: string;
    url: string;
  }[];
}

export interface WorkExperience {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  summary: string;
  url: string;
  location: string | null;
}

export interface Volunteer {
  organization: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  url: string;
}

export interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  startDate?: string;
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

export interface Project {
  name: string;
  startDate: string;
  summary: string;
  url: string;
}

export interface Resume {
  $schema: string;
  basics: ResumeBasics;
  work: WorkExperience[];
  volunteer: Volunteer[];
  education: Education[];
  awards: unknown[];
  certificates: Certificate[];
  publications: unknown[];
  skills: Skill[];
  languages: unknown[];
  interests: unknown[];
  projects: Project[];
  meta: {
    version: string;
    canonical: string;
  };
}
