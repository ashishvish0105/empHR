import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.darkMode.asObservable();
  private readonly THEME_KEY = 'darkMode';

  constructor() {
    this.loadTheme();
  }

  toggleDarkMode(): void {
    const newValue = !this.darkMode.value;
    this.darkMode.next(newValue);
    this.saveTheme(newValue);
    this.updateThemeClass(newValue);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme ? savedTheme === 'true' : prefersDark;
    
    this.darkMode.next(isDarkMode);
    this.updateThemeClass(isDarkMode);
  }

  private saveTheme(isDarkMode: boolean): void {
    localStorage.setItem(this.THEME_KEY, isDarkMode.toString());
  }

  private updateThemeClass(isDarkMode: boolean): void {
    document.body.classList.toggle('dark-theme', isDarkMode);
  }
} 