import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RecommendationInput } from '../models/opf';
import { ApiService } from './api';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts the recommendation answers to the AI endpoint', () => {
    const input: RecommendationInput = {
      founders: 'couple',
      revenue: 'small',
      employees: true,
      investors: false,
      limitedLiability: true,
      priority: 'scaling',
    };

    service.getAiResponse(input).subscribe();

    const request = httpMock.expectOne('/api/ai');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(input);

    request.flush({ content: 'Ответ модели', model: 'test-model' });
  });
});
