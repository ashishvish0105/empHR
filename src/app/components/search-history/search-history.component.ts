import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchHistory } from '../../models/search-history.interface';
import { SearchHistoryService } from '../../services/search-history.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
     MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule
  ]
})
export class SearchHistoryComponent implements OnInit {
  displayedColumns: string[] = ['timestamp', 'searchTerm', 'filters', 'resultsCount', 'actions'];
  dataSource: MatTableDataSource<SearchHistory>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private searchHistoryService: SearchHistoryService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<SearchHistory>([]);
  }

  ngOnInit(): void {
    this.loadSearchHistory();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'timestamp':
          return new Date(item.timestamp).getTime();
        default:
          return (item as any)[property];
      }
    };
  }

  loadSearchHistory(): void {
    this.isLoading = true;
    this.searchHistoryService.getSearchHistory().subscribe({
      next: (history) => {
        this.dataSource.data = history;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Failed to load search history');
        this.isLoading = false;
      }
    });
  }

  searchAgain(searchHistory: SearchHistory): void {
    // Navigate to research page with search parameters
    this.router.navigate(['/research'], {
      queryParams: {
        q: searchHistory.searchTerm,
        ...searchHistory.filters
      }
    });
  }

  deleteSearch(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Search History',
        message: 'Are you sure you want to delete this search history entry?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchHistoryService.deleteSearchHistory(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(item => item.id !== id);
            this.showSuccess('Search history entry deleted');
          },
          error: () => this.showError('Failed to delete search history entry')
        });
      }
    });
  }

  clearAllHistory(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear All History',
        message: 'Are you sure you want to clear all search history? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchHistoryService.clearAllHistory().subscribe({
          next: () => {
            this.dataSource.data = [];
            this.showSuccess('Search history cleared');
          },
          error: () => this.showError('Failed to clear search history')
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formatFilters(filters: any): string {
    if (!filters) return 'None';

    const formattedFilters = [];
    if (filters.location) formattedFilters.push(`Location: ${filters.location}`);
    if (filters.experience) formattedFilters.push(`Experience: ${filters.experience}+ years`);
    if (filters.role) formattedFilters.push(`Role: ${filters.role}`);
    if (filters.skills?.length) formattedFilters.push(`Skills: ${filters.skills.join(', ')}`);

    return formattedFilters.length ? formattedFilters.join(' | ') : 'None';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
