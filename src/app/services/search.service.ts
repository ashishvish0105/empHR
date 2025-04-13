import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { EmployeeProfile } from '../models/employee-profile.interface';

export interface SearchResponse {
  results: EmployeeProfile[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchFilters {
  skills?: string[];
  department?: string;
  experience?: {
    min?: number;
    max?: number;
  };
  location?: string;
  platforms?: string[];
}

export interface SearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  filters?: SearchFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/employees/search`;
  private lastSearchSubject = new BehaviorSubject<SearchParams | null>(null);
  public lastSearch$ = this.lastSearchSubject.asObservable();

  private searchHistorySubject = new BehaviorSubject<SearchParams[]>([]);
  public searchHistory$ = this.searchHistorySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSearchHistory();
  }

  searchEmployees(params: SearchParams): Observable<SearchResponse> {
    // Create HTTP params
    let httpParams = new HttpParams()
      .set('query', params.query)
      .set('page', params.page?.toString() || '1')
      .set('pageSize', params.pageSize?.toString() || '10');

    // Add optional parameters
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
      httpParams = httpParams.set('sortOrder', params.sortOrder || 'asc');
    }

    // Add filters if they exist
    if (params.filters) {
      if (params.filters.skills?.length) {
        httpParams = httpParams.set('skills', params.filters.skills.join(','));
      }
      if (params.filters.department) {
        httpParams = httpParams.set('department', params.filters.department);
      }
      if (params.filters.experience) {
        if (params.filters.experience.min !== undefined) {
          httpParams = httpParams.set('experienceMin', params.filters.experience.min.toString());
        }
        if (params.filters.experience.max !== undefined) {
          httpParams = httpParams.set('experienceMax', params.filters.experience.max.toString());
        }
      }
      if (params.filters.location) {
        httpParams = httpParams.set('location', params.filters.location);
      }
      if (params.filters.platforms?.length) {
        httpParams = httpParams.set('platforms', params.filters.platforms.join(','));
      }
    }

    return this.http.get<SearchResponse>(this.apiUrl, { params: httpParams })
      .pipe(
        tap(response => {
          this.updateLastSearch(params);
          this.addToSearchHistory(params);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while searching';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid search parameters';
          break;
        case 401:
          errorMessage = 'Please login to search';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this search';
          break;
        case 429:
          errorMessage = 'Too many search requests. Please try again later';
          break;
        case 500:
          errorMessage = 'Server error while performing search';
          break;
        default:
          errorMessage = `Search error: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  private updateLastSearch(params: SearchParams): void {
    this.lastSearchSubject.next(params);
  }

  private addToSearchHistory(params: SearchParams): void {
    const history = this.searchHistorySubject.value;
    const updatedHistory = [params, ...history].slice(0, 10); // Keep last 10 searches
    this.searchHistorySubject.next(updatedHistory);
    this.saveSearchHistory(updatedHistory);
  }

  private loadSearchHistory(): void {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      try {
        const parsedHistory = JSON.parse(history);
        this.searchHistorySubject.next(parsedHistory);
      } catch (error) {
        console.error('Error loading search history:', error);
        localStorage.removeItem('searchHistory');
      }
    }
  }

  private saveSearchHistory(history: SearchParams[]): void {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  clearSearchHistory(): void {
    this.searchHistorySubject.next([]);
    localStorage.removeItem('searchHistory');
  }

  getLastSearch(): SearchParams | null {
    return this.lastSearchSubject.value;
  }
} 