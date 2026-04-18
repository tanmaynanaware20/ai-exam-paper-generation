import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, PaperItem } from '../../services/api.service';

@Component({
  selector: 'app-upload-paper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-paper.component.html',
  styleUrls: ['./upload-paper.component.scss']
})
export class UploadPaperComponent implements OnInit {
  selectedFile: File | null = null;
  subject = '';
  isUploading = false;
  isLoadingList = false;
  paperList: PaperItem[] = [];
  errorMsg = '';
  successMsg = '';
  isDragOver = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadPaperList();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
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
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  get isFormValid(): boolean {
    return !!this.selectedFile && this.subject.trim().length > 0;
  }

  upload(): void {
    if (!this.isFormValid || this.isUploading) return;
    this.isUploading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const formData = new FormData();
formData.append('file', this.selectedFile!);
formData.append('subject', this.subject.trim());

this.api.uploadPaper(formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.successMsg = 'Paper uploaded successfully!';
        this.selectedFile = null;
        this.subject = '';
        this.loadPaperList();
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Upload failed. Please try again.';
        this.isUploading = false;
      }
    });
  }

  loadPaperList(): void {
    this.isLoadingList = true;
    this.api.getPaperList().subscribe({
      next: (data) => {
        this.paperList = data;
        this.isLoadingList = false;
      },
      error: () => {
        this.isLoadingList = false;
      }
    });
  }

  formatSize(file: File): string {
    const kb = file.size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }
}
