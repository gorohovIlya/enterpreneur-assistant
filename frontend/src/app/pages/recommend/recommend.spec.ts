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

  function render(): {
    fixture: ReturnType<typeof TestBed.createComponent<Recommend>>;
    el: HTMLElement;
  } {
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
    const requiredGroups = new Set(
      radios.filter((radio) => radio.required).map((radio) => radio.name),
    );
    expect(requiredGroups).toEqual(new Set(['employees', 'investors', 'limitedLiability']));
  });

  it('keeps submit enabled on an incomplete form and exposes errors after submitting', async () => {
    const { fixture, el } = render();
    const submit = el.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    expect(submit.disabled).toBe(false);

    submit.click();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect([...el.querySelectorAll('.field__error')]).toHaveLength(6);
    expect([...el.querySelectorAll('[aria-invalid="true"]')]).toHaveLength(12);
    expect(el.querySelector('#founders')?.getAttribute('aria-describedby')).toBe('founders-error');
    expect(el.querySelector('#employees-yes')?.getAttribute('aria-describedby')).toBe(
      'employees-error',
    );

    const summary = el.querySelector('#error-summary');
    expect(summary?.getAttribute('role')).toBe('alert');
    expect(summary?.querySelectorAll('a')).toHaveLength(6);
    expect(document.activeElement).toBe(summary);
  });

  it('links each error summary item to its question', async () => {
    const { fixture, el } = render();

    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const links = [...el.querySelectorAll<HTMLAnchorElement>('#error-summary a')];

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#founders',
      '#revenue',
      '#employees-yes',
      '#investors-yes',
      '#liability-yes',
      '#priority',
    ]);
    expect(links.every((link) => document.getElementById(link.hash.slice(1)))).toBe(true);
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

    expect(headings).toEqual(['Преимущества', 'Ограничения', 'Почему это подходит', 'Ваши ответы']);
    expect(el.querySelectorAll('.limits li').length).toBeGreaterThan(0);
    expect(el.querySelector('.result__title')?.getAttribute('tabindex')).toBe('-1');
    expect(el.querySelector('.result')?.getAttribute('aria-live')).toBeNull();
  });

  it('summarizes submitted answers and lets the user edit them', () => {
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

    const recap = el.querySelector('.result__recap');
    const alternatives = el.querySelector('.alternatives');

    expect(recap?.textContent).toContain('Ваши ответы');
    expect(recap?.textContent).toContain('2–4');
    expect(recap?.textContent).toContain('От 2,4 до 60 млн ₽');
    expect(recap?.textContent).toContain('Внешние инвесторы');
    expect(alternatives).toBeTruthy();
    expect(
      recap!.compareDocumentPosition(alternatives!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    recap?.querySelector<HTMLButtonElement>('button')?.click();
    expect(document.activeElement).toBe(el.querySelector('#founders'));
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
