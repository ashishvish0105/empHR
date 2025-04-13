import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit {
  searchControl = new FormControl('');
  loading = false;
  employees: any[] = [];
  error: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.loading = true;
        this.error = null;
        return this.employeeService.searchEmployees(query || '');
      })
    ).subscribe({
      next: (results) => {
        this.employees = results;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch results. Please try again.';
        this.loading = false;
      }
    });
  }

  viewProfile(url: string) {
    window.open(url, '_blank');
  }
} 