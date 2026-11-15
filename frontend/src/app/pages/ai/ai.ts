import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FoundersCount, Priority, RecommendationInput, RevenueLevel } from '../../models/opf';
import { AiResponse, ApiService } from '../../services/api';

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
  private readonly route = inject(ActivatedRoute);

  readonly input = signal<RecommendationInput | null>(null);
  readonly response = signal<AiResponse | null>(null);
  readonly loading = signal(false);
  readonly failed = signal(false);

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

  private load(input: RecommendationInput): void {
    this.loading.set(true);
    this.failed.set(false);
    this.response.set(null);

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
