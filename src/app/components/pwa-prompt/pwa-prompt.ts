import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../services/pwa';

@Component({
  selector: 'app-pwa-prompt',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  template: `
    <div class="pwa-prompt">
      <mat-icon>get_app</mat-icon>
      <h2>Install empHR App</h2>
      <p>Install our app for a better experience</p>
      <div class="actions">
        <button mat-button (click)="dismiss()">Not now</button>
        <button mat-raised-button color="primary" (click)="install()">Install</button>
      </div>
    </div>
  `,
  styles: [`
    .pwa-prompt {
      padding: 20px;
      text-align: center;
    }
    
    mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #3f51b5;
    }
    
    .actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class PwaPromptComponent implements OnInit {
  private deferredPrompt: any;

  constructor(private pwaService: PwaService) {}

  ngOnInit(): void {
    this.pwaService.getInstallEvent().subscribe(e => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  }

  async install(): Promise<void> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
    }
  }

  dismiss(): void {
    // Handle dismiss action
  }
}
