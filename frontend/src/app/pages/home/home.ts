import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

type ServerStatus = 'checking' | 'online' | 'offline';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private apiService = inject(ApiService);

  readonly serverStatus = signal<ServerStatus>('checking');

  ngOnInit(): void {
    this.apiService.getHealthStatus().subscribe({
      next: () => this.serverStatus.set('online'),
      error: () => this.serverStatus.set('offline'),
    });
  }
}
