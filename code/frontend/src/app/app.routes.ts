import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

// Auth guard function
const authGuard = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated() ? true : ['/auth/login'];
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'auth/login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'auth/register',
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'post/create',
        loadComponent: () => import('./components/post/post-form/post-form.component').then(m => m.PostFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'post/edit/:id',
        loadComponent: () => import('./components/post/post-form/post-form.component').then(m => m.PostFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'post/:id',
        loadComponent: () => import('./components/post/post-detail/post-detail.component').then(m => m.PostDetailComponent)
      }
    ]
  }
];
