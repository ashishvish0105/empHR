import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Get token from URL query params
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.snackBar.open('Invalid or missing reset token. Please try again.', 'Close', {
        duration: 5000
      });
      this.router.navigate(['/forgot-password']);
    }
  }

  passwordMatchValidator(control: any): {[key: string]: boolean} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.pristine || confirmPassword?.pristine) {
      return null;
    }

    return password && confirmPassword && password.value !== confirmPassword.value ?
      { 'misMatch': true } : null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.resetPasswordForm.get(controlName);

    if (control?.hasError('required')) {
      return `${controlName === 'password' ? 'Password' : 'Confirm password'} is required`;
    }

    if (control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }

    if (control?.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
    }

    if (this.resetPasswordForm.hasError('misMatch') && controlName === 'confirmPassword') {
      return 'Passwords do not match';
    }

    return '';
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      this.isLoading = true;
      const { password } = this.resetPasswordForm.value;

      this.authService.resetPassword(this.token, password).subscribe({
        next: () => {
          this.snackBar.open(
            'Password has been successfully reset. Please login with your new password.',
            'Close',
            {
              duration: 5000,
              panelClass: ['success-snackbar']
            }
          );
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.snackBar.open(
            error.error?.message || 'Failed to reset password. Please try again.',
            'Close',
            { duration: 5000 }
          );
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
