export interface Employee {
  id: string;
  name: string;
  role: string;
  experience: number;
  department: string;
  source: string;
  profileUrl: string;
  location?: string;
  skills?: string[];
  company?: string;
  matchScore: {
    total: number;
    breakdown: {
      skillsMatch: number;
      experienceMatch: number;
      roleMatch: number;
      locationMatch: number;
    };
    explanation: string[];
  };
} 