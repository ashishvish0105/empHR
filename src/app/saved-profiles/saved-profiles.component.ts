import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SavedProfilesService } from '../services/saved-profiles.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-saved-profiles',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './saved-profiles.component.html',
  styleUrls: ['./saved-profiles.component.scss']
})
export class SavedProfilesComponent implements OnInit {
  profiles: any[] = [];
  selectedProfiles: Set<string> = new Set();
  loading = false;
  error: string | null = null;

  constructor(
    private savedProfilesService: SavedProfilesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.loading = true;
    this.savedProfilesService.getSavedProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load saved profiles';
        this.loading = false;
      }
    });
  }

  toggleSelection(profileId: string) {
    if (this.selectedProfiles.has(profileId)) {
      this.selectedProfiles.delete(profileId);
    } else {
      this.selectedProfiles.add(profileId);
    }
  }

  exportSelected() {
    const profilesToExport = this.profiles.filter(p => 
      this.selectedProfiles.has(p.id)
    );
    this.savedProfilesService.exportProfile(profilesToExport);
  }

  deleteSelected() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Profiles',
        message: 'Are you sure you want to delete the selected profiles?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.savedProfilesService.deleteProfile(Array.from(this.selectedProfiles))
          .subscribe({
            next: () => {
              this.loadProfiles();
              this.selectedProfiles.clear();
            },
            error: (error: any) => {
              this.error = 'Failed to delete profiles';
            }
          });
      }
    });
  }
} 