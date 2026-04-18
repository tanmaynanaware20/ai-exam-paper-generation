import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-shell">
      <app-navbar></app-navbar>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: var(--bg-base);
    }
    .app-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      animation: fadeIn 0.3s ease;
    }
    @media (max-width: 768px) {
      .app-shell { flex-direction: column; }
      .app-content { padding: 16px; }
    }
  `]
})
export class AppComponent {
    message = "";

  constructor(private http: HttpClient) {}

  getData() {
    this.http.get<any>('http://localhost:5000/api/message')
      .subscribe(res => {
        this.message = res.message;
      });
  } 
}
