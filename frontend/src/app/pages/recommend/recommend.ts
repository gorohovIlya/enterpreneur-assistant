import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
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
  'founders' | 'revenue' | 'employees' | 'investors' | 'limitedLiability' | 'priority';

interface RecapItem {
  label: string;
  value: string;
}

interface FieldMeta {
  name: ControlName;
  label: string;
  anchor: string;
}

const FOUNDERS_LABELS: Record<FoundersCount, string> = {
  one: 'Один',
  couple: '2–4',
  group: '5–50',
  many: '51 и больше',
};

const REVENUE_LABELS: Record<RevenueLevel, string> = {
  micro: 'До 2,4 млн ₽',
  small: 'От 2,4 до 60 млн ₽',
  large: 'Свыше 60 млн ₽',
};

const PRIORITY_LABELS: Record<Priority, string> = {
  simplicity: 'Простая регистрация и отчётность',
  scaling: 'Масштабирование и привлечение капитала',
};

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
  private readonly errorSummaryRef = viewChild<ElementRef<HTMLElement>>('errorSummary');

  private readonly fieldMeta: readonly FieldMeta[] = [
    { name: 'founders', label: 'Сколько будет учредителей?', anchor: 'founders' },
    { name: 'revenue', label: 'Планируемая годовая выручка', anchor: 'revenue' },
    { name: 'employees', label: 'Планируете нанимать сотрудников?', anchor: 'employees-yes' },
    {
      name: 'investors',
      label: 'Планируете привлекать внешних инвесторов?',
      anchor: 'investors-yes',
    },
    {
      name: 'limitedLiability',
      label: 'Нужна ли ограниченная ответственность?',
      anchor: 'liability-yes',
    },
    { name: 'priority', label: 'Что важнее на старте?', anchor: 'priority' },
  ];

  readonly form = this.fb.group({
    founders: this.fb.control<FoundersCount | null>(null, Validators.required),
    revenue: this.fb.control<RevenueLevel | null>(null, Validators.required),
    employees: this.fb.control<boolean | null>(null, Validators.required),
    investors: this.fb.control<boolean | null>(null, Validators.required),
    limitedLiability: this.fb.control<boolean | null>(null, Validators.required),
    priority: this.fb.control<Priority | null>(null, Validators.required),
  });

  readonly result = signal<RecommendationResult | null>(null);
  readonly submittedAnswers = signal<RecommendationInput | null>(null);
  readonly submitting = signal(false);
  readonly failed = signal(false);
  readonly showErrors = signal(false);

  readonly recap = computed<RecapItem[]>(() => {
    const answers = this.submittedAnswers();

    if (!answers) {
      return [];
    }

    return [
      { label: 'Учредители', value: FOUNDERS_LABELS[answers.founders] },
      { label: 'Выручка', value: REVENUE_LABELS[answers.revenue] },
      { label: 'Сотрудники', value: answers.employees ? 'Да' : 'Нет' },
      { label: 'Внешние инвесторы', value: answers.investors ? 'Да' : 'Нет' },
      {
        label: 'Ограниченная ответственность',
        value: answers.limitedLiability ? 'Нужна' : 'Не нужна',
      },
      { label: 'Приоритет', value: PRIORITY_LABELS[answers.priority] },
    ];
  });

  readonly aiQueryParams = computed<Record<string, string> | null>(() => {
    const answers = this.submittedAnswers();

    if (!answers) {
      return null;
    }

    return {
      founders: answers.founders,
      revenue: answers.revenue,
      employees: String(answers.employees),
      investors: String(answers.investors),
      limitedLiability: String(answers.limitedLiability),
      priority: answers.priority,
    };
  });

  get invalidFields(): FieldMeta[] {
    return this.fieldMeta.filter((field) => this.form.controls[field.name].invalid);
  }

  isInvalid(control: ControlName): boolean {
    const field = this.form.controls[control];
    return field.touched && field.invalid;
  }

  editAnswers(): void {
    this.foundersRef()?.nativeElement.focus();
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showErrors.set(true);
      this.focusErrors();
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
      this.showErrors.set(true);
      this.focusErrors();
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

    this.showErrors.set(false);
    this.submitting.set(true);
    this.failed.set(false);

    this.recommendationService.recommend(input).subscribe({
      next: (result) => {
        this.result.set(result);
        this.submittedAnswers.set(input);
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
    this.submittedAnswers.set(null);
    this.failed.set(false);
    this.showErrors.set(false);
    this.foundersRef()?.nativeElement.focus();
  }

  private focusErrors(): void {
    setTimeout(() => {
      const summary = this.errorSummaryRef()?.nativeElement;

      if (summary) {
        summary.focus();
        return;
      }

      const firstInvalid = this.invalidFields[0];

      if (firstInvalid) {
        document.getElementById(firstInvalid.anchor)?.focus();
      }
    }, 0);
  }
}
