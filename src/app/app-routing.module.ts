import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  // },
  {
    path: '',
    component: LoginComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'research',
    loadChildren: () => import('./research/research.module').then(m => m.ResearchModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'saved-profiles',
    loadChildren: () => import('./saved-profiles/saved-profiles.module').then(m => m.SavedProfilesModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
