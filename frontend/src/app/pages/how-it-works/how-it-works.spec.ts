import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HowItWorks } from './how-it-works';

describe('HowItWorks', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowItWorks],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('explains the three steps and the AI explanation option', () => {
    const fixture = TestBed.createComponent(HowItWorks);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.step')).toHaveLength(3);
    expect(el.textContent).toContain('Дополнительно: ответ ИИ');
    expect(el.querySelector('.how__cta a')?.getAttribute('href')).toBe('/recommend');
  });
});
