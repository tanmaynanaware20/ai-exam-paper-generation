import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistoryItem {
  id: number;
  prompt: string;
  generated_text: string;
}

export interface PaperItem {
  id: number;
  subject: string;
  file_name: string;
  file_path: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  generatePaper(data: any): Observable<{ generatedText: string }> {
    return this.http.post<{ generatedText: string }>(
      `${this.baseUrl}/generate/generate-create`,
      data
    );
  }

  uploadPaper(data: FormData): Observable<{ extractedText: string }> {
    return this.http.post<{ extractedText: string }>(
      `${this.baseUrl}/paper/paper-create`,
      data
    );
  }

  getPaperList(): Observable<PaperItem[]> {
    return this.http.get<PaperItem[]>(
      `${this.baseUrl}/paper/paper-list`
    );
  }

  getHistory(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(
      `${this.baseUrl}/history-list`
    );
  }

  deleteHistory(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/history-delete/${id}`
    );
  }

  uploadSyllabus(data: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/syllabus-create`,
      data
    );
  }

  downloadPdf(data: any): Observable<Blob> {
    return this.http.post(
      `${this.baseUrl}/pdf/pdf-create`,
      data,
      {
        responseType: 'blob'
      }
    );
  }

  signup(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/signup`,
      data
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/login`,
      data
    );
  }
}