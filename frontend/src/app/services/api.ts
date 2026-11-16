import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecommendationInput, RecommendationResult } from '../models/opf';

export interface StatusResponse {
  status: string;
  message: string;
}

export interface AiResponse {
  content: string;
  model: string;
}

export interface ReportPayload {
  input: RecommendationInput;
  recommendation: RecommendationResult;
  ai: AiResponse;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getHealthStatus(): Observable<StatusResponse> {
    return this.http.get<StatusResponse>('/api/health');
  }

  getAiResponse(input: RecommendationInput): Observable<AiResponse> {
    return this.http.post<AiResponse>('/api/ai', input);
  }

  getReport(payload: ReportPayload): Observable<Blob> {
    return this.http.post('/api/report', payload, { responseType: 'blob' });
  }
}
