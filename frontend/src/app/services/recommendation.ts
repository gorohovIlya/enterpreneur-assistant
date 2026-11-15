import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OPF_CATALOG } from '../data/opf-catalog';
import { OpfInfo, RecommendationInput, RecommendationResult } from '../models/opf';

interface Candidate {
  opf: OpfInfo;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  /**
   * Пока правила подбора живут на клиенте. Метод уже асинхронный,
   * поэтому позже его можно заменить вызовом API без изменения компонентов.
   */
  recommend(input: RecommendationInput): Observable<RecommendationResult> {
    return of(this.calculate(input));
  }

  private calculate(input: RecommendationInput): RecommendationResult {
    const candidates = [
      this.scoreNpd(input),
      this.scoreIp(input),
      this.scoreOoo(input),
      this.scoreAo(input),
      this.scoreCoop(input),
    ]
      .filter((candidate) => Number.isFinite(candidate.score))
      .sort((a, b) => b.score - a.score);

    const best = candidates[0] ?? { opf: OPF_CATALOG.ooo, score: 0 };
    const alternatives = candidates
      .slice(1)
      .filter((candidate) => candidate.score > 0)
      .slice(0, 2)
      .map((candidate) => candidate.opf);

    return {
      opf: best.opf,
      reasons: this.buildReasons(input, best.opf),
      alternatives,
    };
  }

  private scoreNpd(input: RecommendationInput): Candidate {
    const eligible =
      input.founders === 'one' &&
      !input.employees &&
      input.revenue === 'micro' &&
      !input.investors;

    if (!eligible) {
      return { opf: OPF_CATALOG.npd, score: -Infinity };
    }

    const score =
      10 +
      (input.limitedLiability ? -12 : 2) +
      (input.priority === 'simplicity' ? 3 : -1);

    return { opf: OPF_CATALOG.npd, score };
  }

  private scoreIp(input: RecommendationInput): Candidate {
    if (input.founders !== 'one') {
      return { opf: OPF_CATALOG.ip, score: -Infinity };
    }

    let score = 6;
    score += input.revenue === 'small' ? 3 : 1;
    score += input.employees ? 1 : 0;
    score += input.investors ? -3 : 0;
    score += input.limitedLiability ? -4 : 0;
    score += input.priority === 'simplicity' ? 2 : 0;

    return { opf: OPF_CATALOG.ip, score };
  }

  private scoreOoo(input: RecommendationInput): Candidate {
    let score = 5;

    if (input.founders === 'one') {
      score += 1;
    } else if (input.founders === 'many') {
      score -= 2;
    } else {
      score += 3;
    }

    score += input.revenue === 'micro' ? 1 : 3;
    score += input.employees ? 1 : 0;
    score += input.investors ? 3 : 0;
    score += input.limitedLiability ? 4 : 0;
    score += input.priority === 'scaling' ? 2 : 1;

    return { opf: OPF_CATALOG.ooo, score };
  }

  private scoreAo(input: RecommendationInput): Candidate {
    let score = 2;

    if (input.founders === 'many') {
      score += 8;
    } else if (input.founders === 'couple' || input.founders === 'group') {
      score -= 1;
    } else {
      score -= 3;
    }

    score += input.revenue === 'large' ? 5 : input.revenue === 'small' ? 0 : -3;
    score += input.employees ? 1 : 0;
    score += input.investors ? 3 : 0;
    score += input.limitedLiability ? 2 : 0;
    score += input.priority === 'scaling' ? 3 : -4;

    return { opf: OPF_CATALOG.ao, score };
  }

  private scoreCoop(input: RecommendationInput): Candidate {
    const eligible =
      input.founders === 'group' && !input.investors && !input.limitedLiability;

    if (!eligible) {
      return { opf: OPF_CATALOG.coop, score: -Infinity };
    }

    let score = 2;
    score += input.revenue === 'large' ? -2 : 2;
    score += input.employees ? 1 : 0;
    score += input.priority === 'simplicity' ? 2 : -3;

    if (input.revenue !== 'large' && input.priority === 'simplicity') {
      score += 5;
    }

    return { opf: OPF_CATALOG.coop, score };
  }

  private buildReasons(input: RecommendationInput, opf: OpfInfo): string[] {
    const reasons: string[] = [];

    switch (opf.id) {
      case 'npd':
        reasons.push(
          'Один владелец и доход до 2,4 млн ₽ — условия НПД выполнены.',
          'НПД не требует деклараций и страховых взносов.',
          'Зарегистрироваться можно за несколько минут в приложении.',
        );
        break;

      case 'ip':
        reasons.push(
          'ИП подходит, если бизнесом владеет один человек.',
          input.employees
            ? 'ИП может официально нанимать сотрудников.'
            : 'Для старта не потребуется сложная корпоративная структура.',
          'Регистрация проще и дешевле, чем у ООО.',
        );
        if (input.priority === 'simplicity') {
          reasons.push('Быстрый старт и минимум отчётности — ваш приоритет.');
        }
        break;

      case 'ooo':
        reasons.push(
          input.limitedLiability
            ? 'Вам важна ограниченная ответственность — ООО её обеспечивает.'
            : 'Форма даёт участникам ограниченную ответственность.',
          input.founders === 'one'
            ? 'Доли позволяют позже подключить партнёров или инвесторов.'
            : 'Можно вести бизнес с партнёрами и официально делить доли.',
          input.investors
            ? 'ООО удобно для привлечения инвесторов через доли.'
            : input.employees
              ? 'Можно официально нанимать сотрудников.'
              : 'Форма хорошо масштабируется по мере роста бизнеса.',
        );
        if (input.priority === 'scaling') {
          reasons.push('ООО подходит для роста и привлечения капитала.');
        }
        break;

      case 'ao':
        reasons.push(
          input.founders === 'many'
            ? 'Большое число владельцев удобно оформить через акции.'
            : 'Акционерная структура подходит для масштабного бизнеса.',
          input.revenue === 'large'
            ? 'Форма рассчитана на крупный бизнес и серьёзные обороты.'
            : 'Структура готова к дальнейшему росту.',
        );
        if (input.investors) {
          reasons.push('Выпуск акций помогает привлекать капитал.');
        }
        reasons.push(
          'Акционеры несут ограниченную ответственность.',
          'Прозрачная корпоративная структура упрощает управление.',
        );
        break;

      case 'coop':
        reasons.push(
          'Кооператив объединяет участников, которые лично участвуют в работе.',
          'Прибыль распределяется между членами кооператива.',
          'Решения принимаются коллективно, по принципу равноправия.',
          'Форма подходит небольшой команде без внешних инвесторов.',
        );
        break;
    }

    return reasons.slice(0, 4);
  }
}
