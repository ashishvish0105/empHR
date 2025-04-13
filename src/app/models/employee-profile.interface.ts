import { Employee } from '../models/employee.interface';

export interface MatchScore {
  total: number;
  skillsScore?: number;
  experienceScore?: number;
  locationScore?: number;
  roleScore?: number;
  breakdown: {
    skillsMatch: number;
    experienceMatch: number;
    roleMatch: number;
    locationMatch: number;
  };
  explanation: string[];
}

export interface ScoredEmployee extends Employee {
  matchScore: MatchScore;
}

export interface EmployeeProfile {
  id: string;
  fullName: string;
  email: string;
  position: string;
  department: string;
  skills: string[];
  experience: number;
  location: string;
  profilePicture?: string;
  platforms: {
    linkedin?: string;
    github?: string;
    naukri?: string;
  };
  matchScore?: number;
  lastUpdated: Date;
}
