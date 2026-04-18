import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navItems: NavItem[] = [
    { path: '/dashboard',    label: 'Dashboard',     icon: 'fa-th-large' },
    { path: '/generate',     label: 'Generate Paper', icon: 'fa-magic' },
    { path: '/history',      label: 'History',        icon: 'fa-history' },
    { path: '/upload-paper', label: 'Upload Paper',   icon: 'fa-upload' },
    { path: '/syllabus',     label: 'Syllabus',       icon: 'fa-book-open' },
  ];
}
