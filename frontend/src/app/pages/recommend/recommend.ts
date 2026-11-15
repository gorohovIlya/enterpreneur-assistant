import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  FoundersCount,
  Priority,
  RecommendationInput,
  RecommendationResult,
  RevenueLevel,
} from '../../models/opf';
import { RecommendationService } from '../../services/recommendation';

type ControlName =
  | 'founders'
  | 'revenue'
  | 'employees'
  | 'investors'
  | 'limitedLiability'
  | 'priority';

@Component({
  selector: 'app-recommend',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recommend.html',
  styleUrl: './recommend.scss',
})
export class Recommend {
  private readonly fb = inject(FormBuilder);
  private readonly recommendationService = inject(RecommendationService);
  private readonly resultTitleRef = viewChild<ElementRef<HTMLElement>>('resultTitle');
  private readonly foundersRef = viewChild<ElementRef<HTMLSelectElement>>('foundersSelect');

  readonly form = this.fb.group({
    founders: this.fb.control<FoundersCount | null>(null, Validators.required),
    revenue: this.fb.control<RevenueLevel | null>(null, Validators.required),
    employees: this.fb.control<boolean | null>(null, Validators.required),
    investors: this.fb.control<boolean | null>(null, Validators.required),
    limitedLiability: this.fb.control<boolean | null>(null, Validators.required),
    priority: this.fb.control<Priority | null>(null, Validators.required),
  });

  readonly result = signal<RecommendationResult | null>(null);
  readonly submitting = signal(false);
  readonly failed = signal(false);

  isInvalid(control: ControlName): boolean {
    const field = this.form.controls[control];
    return field.touched && field.invalid;
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { founders, revenue, employees, investors, limitedLiability, priority } =
      this.form.getRawValue();

    if (
      !founders ||
      !revenue ||
      employees === null ||
      investors === null ||
      limitedLiability === null ||
      !priority
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const input: RecommendationInput = {
      founders,
      revenue,
      employees,
      investors,
      limitedLiability,
      priority,
    };

    this.submitting.set(true);
    this.failed.set(false);

    this.recommendationService.recommend(input).subscribe({
      next: (result) => {
        this.result.set(result);
        this.submitting.set(false);

        // Focus the result heading once the view has rendered it. The browser
        // scrolls it into view and respects `scroll-padding-top` and
        // `prefers-reduced-motion`, so no manual scrolling is needed.
        setTimeout(() => this.resultTitleRef()?.nativeElement.focus(), 0);
      },
      error: () => {
        this.submitting.set(false);
        this.failed.set(true);
      },
    });
  }

  reset(): void {
    this.form.reset({
      founders: null,
      revenue: null,
      employees: null,
      investors: null,
      limitedLiability: null,
      priority: null,
    });
    this.result.set(null);
    this.failed.set(false);
    this.foundersRef()?.nativeElement.focus();
  }
}
