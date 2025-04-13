export interface SearchHistory {
  id: string;
  userId: string;
  searchTerm: string;
  filters: {
    [key: string]: any;
  };
  resultsCount: number;
  timestamp: Date;
} 