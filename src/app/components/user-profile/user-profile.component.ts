import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../services/user-profile.service';
import {
  UserProfile,
  PasswordUpdate,
} from '../../models/user-profile.interface';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
})
export class UserProfileComponent implements OnInit {
  isChangingPassword = false;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  notificationForm!: FormGroup;
  isLoading = false;
  profile?: UserProfile;
  isSaving = false;
  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProfile();
  }
  // ...existing code...
onProfilePictureSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    // You can now upload the file or update the preview
    // Example: this.uploadProfilePicture(file);
    // Optionally, show a preview:
    const reader = new FileReader();
    // ...existing code...
reader.onload = () => {
  if (this.profile) {
    this.profile.profilePicture = reader.result as string;
  }
};
// ...existing code...
    reader.readAsDataURL(file);
  }
}
// ...existing code...

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      location: [''],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      searchAlerts: [true],
      weeklyDigest: [false],
      newFeatures: [true],
    });
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.userProfileService.getCurrentProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.updateFormsWithProfile(profile);
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Failed to load profile');
        this.isLoading = false;
      },
    });
  }

  private updateFormsWithProfile(profile: UserProfile): void {
    this.profileForm.patchValue({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
    });

    this.notificationForm.patchValue(profile.notificationPreferences);
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.userProfileService.updateProfile(this.profileForm.value).subscribe({
        next: (profile) => {
          this.profile = profile;
          this.showSuccess('Profile updated successfully');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Failed to update profile');
          this.isLoading = false;
        },
      });
    }
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.userProfileService
        .updatePassword(this.passwordForm.value as PasswordUpdate)
        .subscribe({
          next: () => {
            this.showSuccess('Password updated successfully');
            this.passwordForm.reset();
            this.isLoading = false;
          },
          error: (error) => {
            this.showError('Failed to update password');
            this.isLoading = false;
          },
        });
    }
  }

  onNotificationChange(): void {
    if (this.notificationForm.valid) {
      this.isLoading = true;
      this.userProfileService
        .updateNotificationPreferences(this.notificationForm.value)
        .subscribe({
          next: (profile) => {
            this.profile = profile;
            this.showSuccess('Notification settings updated successfully');
          },
          error: (error) => {
            this.showError('Failed to update notification settings');
          },
        });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.userProfileService.uploadProfilePicture(file).subscribe({
        next: (response) => {
          this.profile = { ...this.profile!, profilePicture: response.url };
          this.showSuccess('Profile picture updated successfully');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Failed to upload profile picture');
          this.isLoading = false;
        },
      });
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  getPasswordErrorMessage(field: string): string {
    const control = this.passwordForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (control.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }

    if (control.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
    }

    if (control.hasError('mismatch')) {
      return 'Passwords do not match';
    }

    return '';
  }
}
