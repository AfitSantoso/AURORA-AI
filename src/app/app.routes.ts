import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { AlertListComponent } from './components/alert-list/alert-list.component';
import { AlertDetailComponent } from './components/alert-detail/alert-detail.component';
import { RmVerificationComponent } from './components/rm-verification/rm-verification.component';
import { DdVerificationComponent } from './components/dd-verification/dd-verification.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'repository', component: RepositoryComponent },
  { path: 'alerts', component: AlertListComponent },
  { path: 'alerts/:id', component: AlertDetailComponent },
  { path: 'alerts/:id/rm-verification', component: RmVerificationComponent },
  { path: 'alerts/:id/dd-verification', component: DdVerificationComponent },
  { path: '**', redirectTo: 'dashboard' }
];
