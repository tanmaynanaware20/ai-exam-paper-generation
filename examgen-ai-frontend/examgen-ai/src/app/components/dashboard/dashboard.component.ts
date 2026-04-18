import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface QuickCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  badge?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  quickCards: QuickCard[] = [
    {
      title: 'Generate Paper',
      description: 'Create smart AI-powered exam papers with difficulty control and marks distribution.',
      icon: 'fa-magic',
      route: '/generate',
      color: 'blue',
      badge: 'Core Feature'
    },
    {
      title: 'Upload Old Paper',
      description: 'Upload previous year papers to analyze repeated questions and patterns.',
      icon: 'fa-upload',
      route: '/upload-paper',
      color: 'teal'
    },
    {
      title: 'Upload Syllabus',
      description: 'Process your syllabus files and generate topic-based question papers.',
      icon: 'fa-book-open',
      route: '/syllabus',
      color: 'purple'
    },
    {
      title: 'History',
      description: 'View all previously generated papers. Download or delete any record.',
      icon: 'fa-history',
      route: '/history',
      color: 'amber'
    },
    {
      title: 'Download PDF',
      description: 'Export any generated exam paper instantly as a ready-to-print PDF file.',
      icon: 'fa-file-pdf',
      route: '/generate',
      color: 'rose'
    }
  ];

  features = [
    { icon: '📚', label: 'Syllabus Based', desc: 'Topic-specific questions' },
    { icon: '🎯', label: 'Difficulty Control', desc: 'Easy / Medium / Hard' },
    { icon: '📋', label: 'Previous Year Analysis', desc: 'Pattern detection' },
    { icon: '⚡', label: 'Instant PDF Export', desc: 'Ready to print' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
