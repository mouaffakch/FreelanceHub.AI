import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  getFreelances(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/freelances`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.api}/me`);
  }

  updateProfile(data: { firstname?: string; lastname?: string; bio?: string; avatar?: string; skillIds?: number[] }): Observable<User> {
    return this.http.put<User>(`${this.api}/me`, data);
  }

  suspendUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.api}/${id}/suspend`, {});
  }

  activateUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.api}/${id}/activate`, {});
  }
}
