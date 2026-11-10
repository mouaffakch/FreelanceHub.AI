import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type PaymentStatus = 'PENDING' | 'HELD_IN_ESCROW' | 'RELEASED' | 'DISPUTED' | 'REFUNDED';

export interface PaymentResponse {
  id: number;
  projectId: number;
  projectTitle: string;
  clientId: number;
  clientName: string;
  freelanceId?: number;
  freelanceName?: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionRef: string;
  disputeReason?: string;
  disputeResolution?: string;
  createdAt?: string;
  releasedAt?: string;
}

export interface EscrowDepositRequest {
  projectId: number;
  paymentMethod?: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
}

export interface DisputeRequest {
  projectId: number;
  reason: string;
}

export interface DisputeResolutionRequest {
  action: 'REFUND_CLIENT' | 'RELEASE_FREELANCE';
  resolution: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  // 🔒 Déposer les fonds sous séquestre
  depositEscrow(data: EscrowDepositRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/escrow/deposit`, data);
  }

  // 🔓 Débloquer les fonds au freelance
  releaseEscrow(projectId: number): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/escrow/release/${projectId}`, {});
  }

  // ⚠️ Déclarer un litige
  openDispute(data: DisputeRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/escrow/dispute`, data);
  }

  // ⚖️ Arbitrage admin
  resolveDispute(paymentId: number, data: DisputeResolutionRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/escrow/resolve/${paymentId}`, data);
  }

  // 🔍 Obtenir le paiement d'un projet
  getByProject(projectId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/project/${projectId}`);
  }

  // 📊 Mes paiements
  getMyPayments(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.apiUrl}/my-payments`);
  }

  // 👑 Tous les paiements (Admin)
  getAllPayments(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.apiUrl}/admin/all`);
  }
}
