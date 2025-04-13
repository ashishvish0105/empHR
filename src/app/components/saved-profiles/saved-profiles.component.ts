import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { SavedProfile } from '../../models/saved-profile.interface';
import { SavedProfilesService } from '../../services/saved-profiles.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-saved-profiles',
  templateUrl: './saved-profiles.component.html',
  styleUrls: ['./saved-profiles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule
  ]
})
export class SavedProfilesComponent implements OnInit {
  profiles: SavedProfile[] = [];
  selection = new Set<string>();
  isLoading = true;
  platformColors = {
    LinkedIn: '#0077B5',
    Naukri: '#FF7555',
    Indeed: '#2164F3',
    Other: '#757575'
  };

  constructor(
    private savedProfilesService: SavedProfilesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.isLoading = true;
    this.savedProfilesService.getSavedProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        this.isLoading = false;
      },
      error: (error) => {
        this.showError(error.message);
        this.isLoading = false;
      }
    });
  }

  toggleSelection(profileId: string): void {
    if (this.isSelected(profileId)) {
      this.selection.delete(profileId);
    } else {
      this.selection.add(profileId);
    }
  }

  isSelected(profileId: string): boolean {
    return this.selection.has(profileId);
  }

  exportSelected(): void {
    const selectedProfiles = this.profiles.filter(p => this.selection.has(p.id));
    console.log('Exporting profiles:', selectedProfiles);
    this.snackBar.open('Profiles exported successfully', 'Close', { duration: 3000 });
  }

  exportProfile(profileId: string): void {
    // TODO: Implement export logic for a single profile
    console.log('Exporting profile with ID:', profileId);
  }

  deleteSelected(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Profiles',
        message: `Are you sure you want to delete ${this.selection.size} selected profile(s)?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Simulate API call
        this.isLoading = true;
        setTimeout(() => {
          this.profiles = this.profiles.filter(p => !this.selection.has(p.id));
          this.selection.clear();
          this.isLoading = false;
          this.snackBar.open('Profiles deleted successfully', 'Close', { duration: 3000 });
        }, 1000);
      }
    });
  }

  clearSelection(): void {
    this.selection.clear();
  }

  openProfile(url: string): void {
    window.open(url, '_blank');
  }

  downloadProfile(profile: SavedProfile): void {
    console.log('Downloading profile:', profile);
    this.snackBar.open('Profile downloaded successfully', 'Close', { duration: 3000 });
  }

  deleteProfile(profile: SavedProfile, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Profile',
        message: `Are you sure you want to delete ${profile.name}'s profile?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Simulate API call
        this.isLoading = true;
        setTimeout(() => {
          this.profiles = this.profiles.filter(p => p.id !== profile.id);
          this.selection.delete(profile.id);
          this.isLoading = false;
          this.snackBar.open('Profile deleted successfully', 'Close', { duration: 3000 });
        }, 1000);
      }
    });
  }

  formatDate(date: string | Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'mediumDate') || '';
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000
    });
  }
}
