import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReviewRequest {
  projectId: number;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment?: string;
  projectId: number;
  projectTitle?: string;
  clientId: number;
  clientName?: string;
  freelanceId: number;
  freelanceName?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  createReview(data: ReviewRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getByFreelance(freelanceId: number): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.apiUrl}/freelance/${freelanceId}`);
  }

  getByProject(projectId: number): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/project/${projectId}`);
  }

  getAverageRating(freelanceId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/freelance/${freelanceId}/average`);
  }
}
