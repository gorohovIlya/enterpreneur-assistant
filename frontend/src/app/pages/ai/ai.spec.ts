import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Ai } from './ai';

const VALID_PARAMS = {
  founders: 'one',
  revenue: 'micro',
  employees: 'false',
  investors: 'false',
  limitedLiability: 'false',
  priority: 'simplicity',
};

describe('Ai', () => {
  let httpMock: HttpTestingController;

  function setup(params: Record<string, string>): ComponentFixture<Ai> {
    TestBed.configureTestingModule({
      imports: [Ai],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(params) } },
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);

    return TestBed.createComponent(Ai);
  }

  afterEach(() => {
    httpMock.verify();
  });

  function render(params: Record<string, string>) {
    const fixture = setup(params);
    fixture.detectChanges();

    return {
      fixture,
      el: fixture.nativeElement as HTMLElement,
    };
  }

  it('shows an empty state when there are no answers to explain', () => {
    const { el } = render({});

    expect(el.querySelector('.ai__empty')?.textContent).toContain('Нет данных для запроса');
    httpMock.expectNone('/api/ai');
  });

  it('posts valid answers and renders the model response', () => {
    const { fixture, el } = render(VALID_PARAMS);
    const request = httpMock.expectOne('/api/ai');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      founders: 'one',
      revenue: 'micro',
      employees: false,
      investors: false,
      limitedLiability: false,
      priority: 'simplicity',
    });

    request.flush({
      content: '1 Место — ИП\n2 Место — ООО',
      model: 'test-model',
    });
    fixture.detectChanges();

    expect(el.querySelector('.ai__model')?.textContent).toContain('test-model');
    expect(el.querySelector('.ai__text')?.textContent).toContain('1 Место — ИП');
  });

  it('shows an error with a retry action when the request fails', () => {
    const { fixture, el } = render(VALID_PARAMS);
    const request = httpMock.expectOne('/api/ai');

    request.flush('failure', { status: 502, statusText: 'Bad Gateway' });
    fixture.detectChanges();

    expect(el.querySelector('.ai__status--error')?.textContent).toContain(
      'Не удалось получить ответ модели',
    );
    expect(el.querySelector('.ai__actions button')?.textContent).toContain('Попробовать ещё раз');
  });
});
