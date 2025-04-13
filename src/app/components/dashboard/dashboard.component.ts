import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatCardModule,
    MatListModule
  ]
})
export class DashboardComponent implements OnInit {
  userName = 'John Doe';
  navigationCards = [
    {
      title: 'Employee Research',
      description: 'Search and analyze employee profiles',
      icon: 'search',
      route: '/research',
      color: '#2196F3'
    },
    {
      title: 'Saved Profiles',
      description: 'View your saved employee profiles',
      icon: 'bookmark',
      route: '/saved-profiles',
      color: '#4CAF50'
    }
  ];

  recentSearches = [
    {
      query: 'Software Engineer',
      date: new Date(),
      results: 42
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    // Implement logout logic
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
}
