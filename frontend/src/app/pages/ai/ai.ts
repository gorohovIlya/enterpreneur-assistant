import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FoundersCount,
  Priority,
  RecommendationInput,
  RecommendationResult,
  RevenueLevel,
} from '../../models/opf';
import { AiResponse, ApiService } from '../../services/api';
import { RecommendationService } from '../../services/recommendation';

function isFounders(value: string | null): value is FoundersCount {
  return value === 'one' || value === 'couple' || value === 'group' || value === 'many';
}

function isRevenue(value: string | null): value is RevenueLevel {
  return value === 'micro' || value === 'small' || value === 'large';
}

function isPriority(value: string | null): value is Priority {
  return value === 'simplicity' || value === 'scaling';
}

function isBoolean(value: string | null): value is 'true' | 'false' {
  return value === 'true' || value === 'false';
}

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ai.html',
  styleUrl: './ai.scss',
})
export class Ai implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly recommendationService = inject(RecommendationService);
  private readonly route = inject(ActivatedRoute);

  readonly input = signal<RecommendationInput | null>(null);
  readonly response = signal<AiResponse | null>(null);
  readonly recommendation = signal<RecommendationResult | null>(null);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly downloading = signal(false);
  readonly downloadFailed = signal(false);

  ngOnInit(): void {
    const input = this.readInput();

    if (!input) {
      return;
    }

    this.input.set(input);
    this.load(input);
  }

  retry(): void {
    const input = this.input();

    if (input) {
      this.load(input);
    }
  }

  downloadReport(): void {
    const input = this.input();
    const recommendation = this.recommendation();
    const ai = this.response();

    if (!input || !recommendation || !ai || this.downloading()) {
      return;
    }

    this.downloading.set(true);
    this.downloadFailed.set(false);

    this.apiService.getReport({ input, recommendation, ai }).subscribe({
      next: (blob) => {
        this.saveBlob(blob, `otchet-${recommendation.opf.id}.pdf`);
        this.downloading.set(false);
      },
      error: () => {
        this.downloading.set(false);
        this.downloadFailed.set(true);
      },
    });
  }

  private load(input: RecommendationInput): void {
    this.loading.set(true);
    this.failed.set(false);
    this.response.set(null);
    this.recommendation.set(null);
    this.downloadFailed.set(false);

    this.recommendationService.recommend(input).subscribe((recommendation) => {
      this.recommendation.set(recommendation);
    });

    this.apiService.getAiResponse(input).subscribe({
      next: (response) => {
        this.response.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.failed.set(true);
      },
    });
  }

  private saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private readInput(): RecommendationInput | null {
    const params = this.route.snapshot.queryParamMap;
    const founders = params.get('founders');
    const revenue = params.get('revenue');
    const employees = params.get('employees');
    const investors = params.get('investors');
    const limitedLiability = params.get('limitedLiability');
    const priority = params.get('priority');

    if (
      !isFounders(founders) ||
      !isRevenue(revenue) ||
      !isBoolean(employees) ||
      !isBoolean(investors) ||
      !isBoolean(limitedLiability) ||
      !isPriority(priority)
    ) {
      return null;
    }

    return {
      founders,
      revenue,
      employees: employees === 'true',
      investors: investors === 'true',
      limitedLiability: limitedLiability === 'true',
      priority,
    };
  }
}
