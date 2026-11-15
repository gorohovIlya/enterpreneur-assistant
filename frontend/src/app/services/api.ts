import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatusResponse {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  getHealthStatus(): Observable<StatusResponse> {
    return this.http.get<StatusResponse>('/api/health');
  }

  getAiResponse(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>('/api/ai');
  }
}
