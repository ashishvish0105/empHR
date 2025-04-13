import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DashboardStats } from '../models/dashboard-stats.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardStatsService {
  private apiUrl = 'YOUR_API_URL'; // Replace with your actual API URL
  private statsSubject = new BehaviorSubject<DashboardStats | null>(null);
  stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/api/dashboard/stats`).pipe(
      tap(stats => this.statsSubject.next(stats))
    );
  }

  refreshStats(): void {
    this.getStats().subscribe();
  }

  // Helper method to get chart colors
  getChartColors(): string[] {
    return [
      '#FF6384', // Pink
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Teal
      '#9966FF', // Purple
      '#FF9F40'  // Orange
    ];
  }

  // Helper method to format large numbers
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
} 