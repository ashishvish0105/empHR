import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedProfilesComponent } from './saved-profiles.component';

const routes: Routes = [
  {
    path: '',
    component: SavedProfilesComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SavedProfilesComponent
  ]
})
export class SavedProfilesModule { } 