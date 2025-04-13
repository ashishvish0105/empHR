export interface SavedProfile {
  id: string;
  name: string;
  role: string;
  platform: 'LinkedIn' | 'Naukri' | 'Indeed' | 'Other';
  profileUrl: string;
  savedDate: Date;
  experience: number;
  location?: string;
  skills?: string[];
  currentCompany?: string;
  education?: string;
  notes?: string;
} 