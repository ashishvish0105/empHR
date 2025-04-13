import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Employee } from '../models/employee.interface';
import { environment } from '../../environments/environment';

interface ScoringRequest {
  candidate: {
    skills: string[];
    experience: number;
    role: string;
    location?: string;
  };
  requirements: {
    requiredSkills: string[];
    preferredSkills: string[];
    minExperience: number;
    role: string;
    location?: string;
  };
}

interface ScoringResponse {
  totalScore: number;
  skillsScore: number;
  experienceScore: number;
  roleScore: number;
  locationScore: number;
  explanations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CandidateScoringService {
  private apiUrl = environment.apiUrl + '/score-candidate';

  constructor(private http: HttpClient) {}

  scoreCandidate(candidate: Employee, searchCriteria: {
    requiredSkills?: string[];
    preferredSkills?: string[];
    minExperience?: number;
    role?: string;
    location?: string;
  }): Observable<Employee> {
    const scoringRequest: ScoringRequest = {
      candidate: {
        skills: candidate.skills || [],
        experience: candidate.experience,
        role: candidate.role,
        location: candidate.location
      },
      requirements: {
        requiredSkills: searchCriteria.requiredSkills || [],
        preferredSkills: searchCriteria.preferredSkills || [],
        minExperience: searchCriteria.minExperience || 0,
        role: searchCriteria.role || '',
        location: searchCriteria.location
      }
    };

    return this.http.post<ScoringResponse>(this.apiUrl, scoringRequest).pipe(
      map(response => ({
        ...candidate,
        matchScore: {
          total: response.totalScore,
          breakdown: {
            skillsMatch: response.skillsScore,
            experienceMatch: response.experienceScore,
            roleMatch: response.roleScore,
            locationMatch: response.locationScore
          },
          explanation: response.explanations
        }
      })),
      catchError(this.handleError)
    );
  }

  getScoreColor(score: number): string {
    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100');
    }
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFC107'; // Yellow
    if (score >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }

  getScoreDescription(score: number): string {
    if (score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100');
    }
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while scoring the candidate';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
