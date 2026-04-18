import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, HistoryItem } from '../../services/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  historyList: HistoryItem[] = [];
  isLoading = false;
  errorMsg = '';
  successMsg = '';
  selectedItem: HistoryItem | null = null;
  isPdfLoading = false;
  deletingId: number | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.api.getHistory().subscribe({
      next: (data) => {
        this.historyList = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load history.';
        this.isLoading = false;
      }
    });
  }

  viewItem(item: HistoryItem): void {
    this.selectedItem = item;
  }

  closeModal(): void {
    this.selectedItem = null;
  }

  deleteItem(id: number): void {
    if (!confirm('Delete this history record?')) return;
    this.deletingId = id;
    this.api.deleteHistory(id).subscribe({
      next: () => {
        this.historyList = this.historyList.filter(h => h.id !== id);
        this.deletingId = null;
        this.successMsg = 'Record deleted.';
        if (this.selectedItem?.id === id) this.selectedItem = null;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err:any) => {
        this.errorMsg = 'Failed to delete record.';
        this.deletingId = null;
      }
    });
  }

  downloadPdf(item: HistoryItem): void {
  this.isPdfLoading = true;

  this.api.downloadPdf({
    text: item.generated_text
  }).subscribe({
    next: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exam-paper-${item.prompt}-${item.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      this.isPdfLoading = false;
    },
    error: () => {
      this.errorMsg = 'Failed to download PDF.';
      this.isPdfLoading = false;
    }
  });
}

  truncate(text: string, len = 80): string {
    if (!text) return '—';
    return text.length > len ? text.substring(0, len) + '...' : text;
  }
}
