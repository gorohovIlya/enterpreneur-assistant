import { Component, OnInit, inject, signal } from '@angular/core';
import { AiResponse, ApiService } from '../../services/api';

@Component({
  selector: 'app-ai',
  standalone: true,
  templateUrl: './ai.html',
  styleUrl: './ai.scss',
})
export class Ai implements OnInit {
  private readonly apiService = inject(ApiService);

  readonly response = signal<AiResponse | null>(null);
  readonly failed = signal(false);

  ngOnInit(): void {
    this.apiService.getAiResponse().subscribe({
      next: (response) => {
        this.response.set(response);
        this.failed.set(false);
      },
      error: () => {
        this.response.set(null);
        this.failed.set(true);
      },
    });
  }
}
