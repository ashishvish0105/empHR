import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SavedProfilesService {
  private apiUrl = '/api/saved-profiles';

  constructor(private http: HttpClient) {}

  getSavedProfiles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  exportProfile(profiles: any[]): void {
    // Handle bulk export
    const data = JSON.stringify(profiles, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exported-profiles.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  deleteProfile(profileIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: { ids: profileIds } });
  }
} 