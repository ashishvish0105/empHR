import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Employee } from '../../models/employee.interface';
import { MatchScoreComponent } from '../match-score/match-score.component';

@Component({
  selector: 'app-employee-research',
  templateUrl: './employee-research.component.html',
  styleUrls: ['./employee-research.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ]
})
export class EmployeeResearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  employees$: Observable<Employee[]> = of([]); // Initialize with empty array
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor() {
    this.initializeSearch();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  private initializeSearch(): void {
    this.employees$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query) return [];
        this.isLoading = true;
        // Implement your search logic here
        return [];
      }),
      map(employees => {
        this.isLoading = false;
        return employees;
      }),
      catchError(error => {
        this.isLoading = false;
        console.error('Search error:', error);
        return [];
      }),
      takeUntil(this.destroy$)
    );
  }

  onSearch(): void {
    const query = this.searchControl.value;
    if (query) {
      this.searchControl.setValue(query, { emitEvent: true });
    }
  }

  openProfile(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  formatExperience(years: number): string {
    return years === 1 ? '1 year' : `${years} years`;
  }
}
