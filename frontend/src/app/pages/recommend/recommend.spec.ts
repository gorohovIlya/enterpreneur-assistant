import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Recommend } from './recommend';

describe('Recommend', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recommend],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function render(): { fixture: ReturnType<typeof TestBed.createComponent<Recommend>>; el: HTMLElement } {
    const fixture = TestBed.createComponent(Recommend);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('groups the six radios into three named groups', () => {
    const { el } = render();
    const radios = [...el.querySelectorAll<HTMLInputElement>('input[type="radio"]')];

    expect(radios).toHaveLength(6);
    expect(new Set(radios.map((radio) => radio.name)).size).toBe(3);
    expect(radios.map((radio) => radio.name)).toEqual([
      'employees',
      'employees',
      'investors',
      'investors',
      'limitedLiability',
      'limitedLiability',
    ]);
  });

  it('gives every control an id and marks the required ones', () => {
    const { el } = render();
    const radios = [...el.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    const selects = [...el.querySelectorAll<HTMLSelectElement>('select')];

    expect(radios.every((radio) => radio.id.length > 0)).toBe(true);
    expect(selects.every((select) => select.id.length > 0)).toBe(true);
    expect(selects.every((select) => select.required)).toBe(true);

    // One `required` radio marks the whole group required.
    const requiredGroups = new Set(radios.filter((radio) => radio.required).map((radio) => radio.name));
    expect(requiredGroups).toEqual(new Set(['employees', 'investors', 'limitedLiability']));
  });

  it('keeps submit enabled on an incomplete form and exposes errors after submitting', () => {
    const { fixture, el } = render();
    const submit = el.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    expect(submit.disabled).toBe(false);

    submit.click();
    fixture.detectChanges();

    expect([...el.querySelectorAll('.field__error')]).toHaveLength(6);
    expect([...el.querySelectorAll('[aria-invalid="true"]')]).toHaveLength(6);
    expect(el.querySelector('#founders')?.getAttribute('aria-describedby')).toBe('founders-error');
    expect(el.querySelector('#employees-yes')?.getAttribute('aria-describedby')).toBe(
      null,
    );
  });

  it('renders advantages, limitations and reasons for a recommendation', () => {
    const { fixture, el } = render();
    const component = fixture.componentInstance;

    component.form.patchValue({
      founders: 'couple',
      revenue: 'small',
      employees: true,
      investors: true,
      limitedLiability: true,
      priority: 'scaling',
    });
    component.submit();
    fixture.detectChanges();

    const headings = [...el.querySelectorAll('.result__card h3')].map((h) => h.textContent?.trim());

    expect(headings).toEqual(['Преимущества', 'Ограничения', 'Почему это подходит']);
    expect(el.querySelectorAll('.limits li').length).toBeGreaterThan(0);
    expect(el.querySelector('.result__title')?.getAttribute('tabindex')).toBe('-1');
    expect(el.querySelector('.result')?.getAttribute('aria-live')).toBeNull();
  });

  it('returns focus to the first question on reset', () => {
    const { fixture, el } = render();
    const component = fixture.componentInstance;

    component.form.patchValue({
      founders: 'one',
      revenue: 'micro',
      employees: false,
      investors: false,
      limitedLiability: false,
      priority: 'simplicity',
    });
    component.submit();
    fixture.detectChanges();

    expect(el.querySelector('.result__card')).toBeTruthy();

    component.reset();
    fixture.detectChanges();

    expect(document.activeElement).toBe(el.querySelector('#founders'));
  });
});
