import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'generate',
    loadComponent: () =>
      import('./components/generate/generate.component').then(m => m.GenerateComponent)
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./components/history/history.component').then(m => m.HistoryComponent)
  },
  {
    path: 'upload-paper',
    loadComponent: () =>
      import('./components/upload-paper/upload-paper.component').then(m => m.UploadPaperComponent)
  },
  {
    path: 'syllabus',
    loadComponent: () =>
      import('./components/syllabus/syllabus.component').then(m => m.SyllabusComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
