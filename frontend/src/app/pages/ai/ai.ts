import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './ai.html',
  styleUrl: './ai.scss',
})
export class Ai implements OnInit {
  private readonly apiService = inject(ApiService);

  readonly response = signal<Record<string, unknown> | null>(null);

  ngOnInit(): void {
    this.apiService.getAiResponse().subscribe({
      next: (response) => this.response.set(response),
      error: () => this.response.set({ error: 'Не удалось получить ответ модели' }),
    });
  }
}
