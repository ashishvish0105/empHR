import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchHistory } from '../models/search-history.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  private apiUrl = 'YOUR_API_URL'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getSearchHistory(): Observable<SearchHistory[]> {
    return this.http.get<SearchHistory[]>(`${this.apiUrl}/api/search-history`);
  }

  deleteSearchHistory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/search-history/${id}`);
  }

  clearAllHistory(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/search-history`);
  }

  // This method will be called from the EmployeeResearch component
  saveSearch(searchTerm: string, filters: any, resultsCount: number): Observable<SearchHistory> {
    const searchHistory: Partial<SearchHistory> = {
      searchTerm,
      filters,
      resultsCount,
      timestamp: new Date()
    };
    return this.http.post<SearchHistory>(`${this.apiUrl}/api/search-history`, searchHistory);
  }
} 