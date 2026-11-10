import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProjectRequest {
  title: string;
  description: string;
  budget: number;
  deadline?: string;
  status?: string;
  skillIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMyProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-projects`);
  }

  getByFreelance(freelanceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/freelance/${freelanceId}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(project: ProjectRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, project);
  }

  update(id: number, project: ProjectRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, project);
  }

  deliverProject(id: number, data: { deliverablesUrl: string; deliverablesNotes?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/deliver`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
