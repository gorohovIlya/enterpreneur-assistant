import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, StatusResponse } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private apiService = inject(ApiService);

    serverStatus = signal<StatusResponse | null>(null);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
      this.apiService.getHealthStatus().subscribe({
        next: (data) => this.serverStatus.set(data),
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Ошибка соединения с бэкендом');
        }
      });
    }
}
