import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  apply(projectId: number, coverLetter: string = 'Bonjour, je suis très intéressé par votre projet et disponible immédiatement.'): Observable<any> {
    const textMessage = coverLetter && coverLetter.trim() ? coverLetter.trim() : 'Bonjour, je suis très intéressé par votre projet.';
    
    // On envoie à la fois 'message' et 'coverLetter' pour satisfaire le DTO Spring Boot
    const payload = {
      projectId: projectId,
      message: textMessage,
      coverLetter: textMessage
    };

    return this.http.post<any>(this.apiUrl, payload);
  }

  getByProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-applications`);
  }

  accept(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/accept`, {});
  }

  reject(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/reject`, {});
  }
}