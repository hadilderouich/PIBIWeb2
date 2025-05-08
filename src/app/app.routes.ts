import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Copie1Component } from './dashboard/copie1/copie1.component';
import { Copie2Component } from './dashboard/copie2/copie2.component';
import { Copie3Component } from './dashboard/copie3/copie3.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard/copie1', 
    component: Copie1Component, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard/copie2', 
    component: Copie2Component, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard/copie3', 
    component: Copie3Component, 
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
