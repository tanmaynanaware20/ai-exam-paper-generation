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

    // IMPORTANT FIX
    formData.append('paper', file);

    this.api.uploadPaper(formData).subscribe({
      next: (res: any) => {
        this.uploadedPaperText = res.extractedText || '';
        this.uploadedFileName = res.filename || '';

        this.successMsg = 'Upload successful';
        this.errorMsg = '';

        console.log('UPLOAD RESPONSE:', res);

        setTimeout(() => {
          this.successMsg = '';
        }, 3000);
      },
      error: (err) => {
        console.log('UPLOAD ERROR:', err);
        this.errorMsg = 'Upload failed';
      }
    });
  }

  generate(): void {
    if (!this.isFormValid || this.isLoading) return;

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

    this.api.generatePaper(payload).subscribe({
      next: (res: any) => {
        this.generatedText = res.generatedText || '';
        this.isLoading = false;

        this.successMsg = 'Paper generated successfully';

        setTimeout(() => {
          this.successMsg = '';
        }, 3000);
      },
      error: (err: any) => {
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
    navigator.clipboard.writeText(this.generatedText);

    this.successMsg = 'Copied to clipboard';

    setTimeout(() => {
      this.successMsg = '';
    }, 2000);
  }
}