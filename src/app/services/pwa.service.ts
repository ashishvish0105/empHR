import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  constructor(private swUpdate: SwUpdate) {}

  checkForUpdates(): Promise<void> {
    if (this.swUpdate.isEnabled) {
      return this.swUpdate.checkForUpdate()
        .then(() => {
          console.log('Checking for updates');
        })
        .catch(err => {
          console.error('Error checking for updates:', err);
        });
    }
    return Promise.resolve();
  }

  public getInstallEvent(): Observable<BeforeInstallPromptEvent> {
    return fromEvent<BeforeInstallPromptEvent>(window, 'beforeinstallprompt');
  }
} 