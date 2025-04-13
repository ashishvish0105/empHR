import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button mat-icon-button
            [matTooltip]="(isDarkMode$ | async) ? 'Switch to light mode' : 'Switch to dark mode'"
            (click)="toggleTheme()">
      <mat-icon>{{ (isDarkMode$ | async) ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    button {
      transition: transform 0.2s ease;
    }
    
    button:hover {
      transform: rotate(15deg);
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit(): void {}

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
} 