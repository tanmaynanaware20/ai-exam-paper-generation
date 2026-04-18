import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-syllabus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.scss']
})
export class SyllabusComponent {
  selectedFile: File | null = null;
  isUploading = false;
  generatedText = '';
  errorMsg = '';
  successMsg = '';
  isDragOver = false;
  isPdfLoading = false;

  constructor(private api: ApiService, private router: Router) {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.generatedText = '';
      this.errorMsg = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.selectedFile = files[0];
      this.generatedText = '';
      this.errorMsg = '';
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.generatedText = '';
  }

  upload(): void {
    if (!this.selectedFile || this.isUploading) return;
    this.isUploading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const formData = new FormData();
formData.append('file', this.selectedFile!);

this.api.uploadSyllabus(formData).subscribe({
      next: (res) => {
        this.generatedText = res.generatedText;
        this.isUploading = false;
        this.successMsg = 'Syllabus processed successfully!';
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Upload failed. Please try again.';
        this.isUploading = false;
      }
    });
  }

  downloadPdf(): void {
    if (!this.generatedText || this.isPdfLoading) return;
    this.isPdfLoading = true;
    this.api.downloadPdf(this.generatedText).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `syllabus-paper-${Date.now()}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.isPdfLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to export PDF.';
        this.isPdfLoading = false;
      }
    });
  }

  useForGenerate(): void {
    this.router.navigate(['/generate']);
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.generatedText).then(() => {
      this.successMsg = 'Copied to clipboard!';
      setTimeout(() => this.successMsg = '', 2000);
    });
  }

  formatSize(file: File): string {
    const kb = file.size / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  }
}
