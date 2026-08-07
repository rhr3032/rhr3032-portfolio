/**
 * Portfolio Data Schema
 * ---------------------
 * This file defines the canonical TypeScript interfaces for the portfolio data.
 * The portfolio.json in src/assets/data/ must conform to the `Portfolio` root type.
 * When updating your GitHub Gist, use this schema as the reference.
 *
 * Gist URL: https://gist.github.com/rhr3032
 */

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  behance?: string;
  pinterest?: string;
  instagram?: string;
  medium?: string;
}

export interface PersonalInfo {
  name: string;
  /** Primary professional title */
  title: string;
  /** Short punchy tagline shown in the hero */
  tagline: string;
  /** Multi-sentence bio shown in the About section */
  bio: string;
  email: string;
  location: string;
  /** URL to profile photo (optional; initials avatar used if omitted) */
  avatar?: string;
  social: SocialLinks;
}

export interface Experience {
  company: string;
  companyUrl?: string;
  role: string;
  /** ISO date string e.g. "2020-01-01" */
  startDate: string;
  /** ISO date string, or null if current position */
  endDate: string | null;
  description?: string;
  highlights: string[];
  technologies: string[];
  logo?: string;
}

export type SkillLevel = 'expert' | 'proficient' | 'familiar';

export interface SkillItem {
  name: string;
  level: SkillLevel;
  /** Short icon identifier (e.g. devicon class name) — optional */
  icon?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  /** Live demo URL */
  url?: string;
  /** GitHub repository URL */
  github?: string;
  /** Preview image URL */
  image?: string;
  /** Whether this project is featured prominently */
  featured: boolean;
}

export interface BlogPost {
  title: string;
  /** Full Medium article URL */
  mediumUrl: string;
  /** ISO date string e.g. "2024-06-15" */
  date: string;
  summary: string;
  readingTime?: string;
}

export interface Education {
  institution: string;
  degree: string;
  location: string;
  /** ISO date string e.g. "2020-12-31" */
  endDate: string;
}

export interface Activity {
  organization: string;
  role: string;
  /** Human-readable duration e.g. "Aug 2018 – Apr 2021" */
  duration: string;
  highlights: string[];
}

export interface Talk {
  title: string;
  event: string;
  year: number;
  role: string;
}

export interface Publication {
  title: string;
  publisher: string;
  year: number;
  hashnodeUrl: string;
}

/** Root type — matches the shape of portfolio.json */
export interface Portfolio {
  personal: PersonalInfo;
  experience: Experience[];
  education?: Education[];
  skills: SkillCategory[];
  projects?: Project[];
  blog?: BlogPost[];
  activities?: Activity[];
  talks?: Talk[];
  publications?: Publication[];
}
