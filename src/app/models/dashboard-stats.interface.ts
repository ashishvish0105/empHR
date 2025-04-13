export interface DashboardStats {
  searchesToday: number;
  platformUsage: {
    platform: string;
    count: number;
  }[];
  topSearchedRoles: {
    role: string;
    count: number;
  }[];
  lastUpdated: Date;
} 