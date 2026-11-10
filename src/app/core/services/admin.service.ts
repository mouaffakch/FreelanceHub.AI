import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingUsers: number;
  totalClients: number;
  totalFreelances: number;
  totalProjects: number;
  openProjects: number;
  inProgressProjects: number;
  closedProjects: number;
  totalApplications: number;
  totalReviews: number;
  averageRating: number;
  usersByRole: { [key: string]: number };
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  getSkills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/skills`);
  }

  addSkill(name: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/skills`, { name });
  }
}
