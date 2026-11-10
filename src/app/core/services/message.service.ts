import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  id?: number;
  content: string;
  isRead?: boolean;
  createdAt?: string;
  senderId?: number;
  senderName?: string;
  receiverId?: number;
  receiverName?: string;
}

export interface MessageRequest {
  content: string;
  receiverId: number;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) {}

  getConversation(otherUserId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.api}/conversation/${otherUserId}`);
  }

  sendMessage(request: MessageRequest): Observable<Message> {
    return this.http.post<Message>(this.api, request);
  }

  getUnread(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.api}/unread`);
  }

  markAsRead(messageId: number): Observable<Message> {
    return this.http.put<Message>(`${this.api}/${messageId}/read`, {});
  }
}