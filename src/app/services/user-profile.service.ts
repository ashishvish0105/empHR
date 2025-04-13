import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserProfile, ProfileUpdate, PasswordUpdate } from '../models/user-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'YOUR_API_URL'; // Replace with your actual API URL
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/api/profile`).pipe(
      tap(profile => this.userProfileSubject.next(profile))
    );
  }

  updateProfile(update: ProfileUpdate): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/api/profile`, update).pipe(
      tap(profile => this.userProfileSubject.next(profile))
    );
  }

  updatePassword(passwordUpdate: PasswordUpdate): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/profile/password`, passwordUpdate);
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post<{ url: string }>(`${this.apiUrl}/api/profile/picture`, formData);
  }

  updateNotificationPreferences(preferences: UserProfile['notificationPreferences']): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/api/profile/notifications`, { notificationPreferences: preferences }).pipe(
      tap(profile => this.userProfileSubject.next(profile))
    );
  }
} 