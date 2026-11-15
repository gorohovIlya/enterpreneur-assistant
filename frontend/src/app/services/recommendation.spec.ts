import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { RecommendationInput } from '../models/opf';
import { RecommendationService } from './recommendation';

describe('RecommendationService', () => {
  let service: RecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendationService);
  });

  function recommend(input: RecommendationInput) {
    return firstValueFrom(service.recommend(input));
  }

  it('recommends НПД for a solo founder below the revenue cap', async () => {
    const result = await recommend({
      founders: 'one',
      revenue: 'micro',
      employees: false,
      investors: false,
      limitedLiability: false,
      priority: 'simplicity',
    });

    expect(result.opf.id).toBe('npd');
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('recommends ИП for a solo founder who hires', async () => {
    const result = await recommend({
      founders: 'one',
      revenue: 'small',
      employees: true,
      investors: false,
      limitedLiability: false,
      priority: 'simplicity',
    });

    expect(result.opf.id).toBe('ip');
  });

  it('recommends ООО for partners with investors', async () => {
    const result = await recommend({
      founders: 'couple',
      revenue: 'small',
      employees: true,
      investors: true,
      limitedLiability: true,
      priority: 'scaling',
    });

    expect(result.opf.id).toBe('ooo');
    expect(result.opf.limitations.length).toBeGreaterThan(0);
  });

  it('recommends АО for a large shareholder base', async () => {
    const result = await recommend({
      founders: 'many',
      revenue: 'large',
      employees: true,
      investors: true,
      limitedLiability: true,
      priority: 'scaling',
    });

    expect(result.opf.id).toBe('ao');
  });

  it('returns at most two alternatives, none of them the recommendation', async () => {
    const result = await recommend({
      founders: 'couple',
      revenue: 'small',
      employees: true,
      investors: true,
      limitedLiability: true,
      priority: 'scaling',
    });

    expect(result.alternatives.length).toBeLessThanOrEqual(2);
    expect(result.alternatives.map((opf) => opf.id)).not.toContain(result.opf.id);
  });
});
