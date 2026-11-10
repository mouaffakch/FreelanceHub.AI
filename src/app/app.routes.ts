import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { ClientDashboardComponent } from './features/dashboard/client-dashboard/client-dashboard.component';
import { FreelanceDashboardComponent } from './features/dashboard/freelance-dashboard/freelance-dashboard.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectFormComponent } from './features/projects/project-form/project-form.component';
import { FreelancerListComponent } from './features/freelancers/freelancer-list.component';
import { ChatComponent } from './features/chat/chat.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AIToolsComponent } from './features/ai-tools/ai-tools.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  
  // Dashboards
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: 'client', component: ClientDashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/client', component: ClientDashboardComponent, canActivate: [authGuard] },
  { path: 'freelance', component: FreelanceDashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/freelance', component: FreelanceDashboardComponent, canActivate: [authGuard] },
  
  // Projets & Marketplace
  { path: 'projects', component: ProjectListComponent, canActivate: [authGuard] },
  { path: 'project-form', component: ProjectFormComponent, canActivate: [authGuard] },
  { path: 'project-form/:id', component: ProjectFormComponent, canActivate: [authGuard] },
  { path: 'projects/new', component: ProjectFormComponent, canActivate: [authGuard] },

  // Annuaire des Talents / Freelances
  { path: 'freelancers', component: FreelancerListComponent, canActivate: [authGuard] },

  // Profil
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] },

  // Outils IA
  { path: 'ai-tools', component: AIToolsComponent, canActivate: [authGuard] },

  // Tchat privé
  { path: 'chat/:userId', component: ChatComponent, canActivate: [authGuard] },

  // Redirection par défaut si route inconnue
  { path: '**', redirectTo: 'login' }
];
