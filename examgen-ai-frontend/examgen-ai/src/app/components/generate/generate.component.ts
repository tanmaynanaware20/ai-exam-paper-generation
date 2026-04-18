import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent {
  subject = '';
  difficulty = 'medium';
  marks = 30;

  uploadedPaperText = '';
  uploadedFileName = '';

  isLoading = false;
  generatedText = '';
  errorMsg = '';
  successMsg = '';
  isPdfLoading = false;

  difficultyOptions = [
    { value: 'easy', label: 'Easy', icon: '🟢' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'hard', label: 'Hard', icon: '🔴' }
  ];

  marksOptions = [30, 50, 70];

  constructor(private api: ApiService) {}

  get isFormValid(): boolean {
    return this.subject.trim().length > 0;
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.api.uploadPaper(formData).subscribe({
      next: (res: any) => {
        this.uploadedPaperText = res.extractedText || '';
        this.uploadedFileName = res.fileName || '';

        this.successMsg = 'Old paper analyzed successfully!';
        this.errorMsg = '';

        console.log('UPLOADED TEXT:', this.uploadedPaperText);

        setTimeout(() => {
          this.successMsg = '';
        }, 3000);
      },
      error: () => {
        this.errorMsg = 'Upload failed';
      }
    });
  }

  generate(): void {
    if (!this.isFormValid || this.isLoading) return;

    console.log('GENERATE CLICKED');

    this.isLoading = true;
    this.generatedText = '';
    this.errorMsg = '';
    this.successMsg = '';

    const payload = {
      subject: this.subject.trim(),
      difficulty: this.difficulty,
      totalMarks: this.marks,
      oldPaperText: this.uploadedPaperText || ''
    };

    console.log('Sending payload:', payload);

    this.api.generatePaper(payload).subscribe({
      next: (res: any) => {
        console.log('RESPONSE RECEIVED:', res);

        this.generatedText = res.generatedText || '';
        this.isLoading = false;

        this.successMsg = 'Paper generated successfully!';

        setTimeout(() => {
          this.successMsg = '';
        }, 3000);
      },
      error: (err: any) => {
        console.log('FULL ERROR:', err);

        this.errorMsg =
          err?.error?.error ||
          err?.error?.message ||
          'Failed to generate paper';

        this.isLoading = false;
      }
    });
  }

  downloadPdf(): void {
    if (!this.generatedText || this.isPdfLoading) return;

    this.isPdfLoading = true;

    this.api.downloadPdf({
      text: this.generatedText
    }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `exam-paper-${this.subject}.pdf`;
        a.click();

        URL.revokeObjectURL(url);

        this.isPdfLoading = false;
      },
      error: () => {
        this.errorMsg = 'PDF generation failed';
        this.isPdfLoading = false;
      }
    });
  }

  clearOutput(): void {
    this.generatedText = '';
    this.errorMsg = '';
    this.successMsg = '';
  }

  copyToClipboard(): void {
    if (!this.generatedText) return;

    navigator.clipboard.writeText(this.generatedText).then(() => {
      this.successMsg = 'Copied to clipboard!';

      setTimeout(() => {
        this.successMsg = '';
      }, 2000);
    });
  }
}