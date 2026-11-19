import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { UserService } from '../../../core/services/user.service';
import { AdminService, AdminStats } from '../../../core/services/admin.service';
import { PaymentService, PaymentResponse } from '../../../core/services/payment.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private userService = inject(UserService);
  private adminService = inject(AdminService);
  private paymentService = inject(PaymentService);

  users: User[] = [];
  loadingUsers = true;
  error = '';
  successMsg = '';

  stats: AdminStats | null = null;
  loadingStats = true;

  // Supervision Financière & Escrow
  payments: PaymentResponse[] = [];
  loadingPayments = true;

  // Modale d'arbitrage de litige
  showResolveModal = false;
  selectedDisputePayment: PaymentResponse | null = null;
  disputeResolutionText = '';
  resolvingDispute = false;

  get totalEscrowVolume(): number {
    return this.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }

  get totalPlatformCommission(): number {
    return this.payments
      .filter(p => p.status === 'RELEASED')
      .reduce((sum, p) => sum + (p.platformFee || 0), 0);
  }

  get activeDisputesCount(): number {
    return this.payments.filter(p => p.status === 'DISPUTED').length;
  }

  ngOnInit() {
    this.loadUsers();
    this.loadStats();
    this.loadPayments();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loadingUsers = false;
      },
      error: () => {
        this.error = 'Impossible de charger la liste des utilisateurs.';
        this.loadingUsers = false;
      }
    });
  }

  loadStats() {
    this.loadingStats = true;
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadingStats = false;
      },
      error: () => {
        this.loadingStats = false;
      }
    });
  }

  loadPayments() {
    this.loadingPayments = true;
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data || [];
        this.loadingPayments = false;
      },
      error: () => {
        this.loadingPayments = false;
      }
    });
  }

  suspend(userId: number) {
    this.userService.suspendUser(userId).subscribe({
      next: () => {
        this.successMsg = 'Compte utilisateur suspendu.';
        this.loadUsers();
        this.loadStats();
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: () => {
        this.error = 'Erreur lors de la suspension.';
      }
    });
  }

  activate(userId: number) {
    this.userService.activateUser(userId).subscribe({
      next: () => {
        this.successMsg = 'Compte utilisateur activé.';
        this.loadUsers();
        this.loadStats();
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: () => {
        this.error = "Erreur lors de l'activation.";
      }
    });
  }

  // ==================== ARBITRAGE DU LITIGE (ADMIN) ====================
  openResolveModal(payment: PaymentResponse) {
    this.selectedDisputePayment = payment;
    this.disputeResolutionText = `Après examen des livrables et des échanges, décision arbitrale rendue le ${new Date().toLocaleDateString('fr-FR')}.`;
    this.showResolveModal = true;
  }

  closeResolveModal() {
    this.showResolveModal = false;
    this.selectedDisputePayment = null;
  }

  executeDisputeResolution(action: 'REFUND_CLIENT' | 'RELEASE_FREELANCE') {
    if (!this.selectedDisputePayment || !this.disputeResolutionText.trim()) return;

    this.resolvingDispute = true;
    this.error = '';

    this.paymentService.resolveDispute(this.selectedDisputePayment.id, {
      action,
      resolution: this.disputeResolutionText.trim()
    }).subscribe({
      next: () => {
        this.resolvingDispute = false;
        this.showResolveModal = false;
        this.selectedDisputePayment = null;
        this.successMsg = action === 'REFUND_CLIENT'
          ? 'Décision arbitrale validée : Le client a été intégralement remboursé.'
          : 'Décision arbitrale validée : Les fonds ont été débloqués pour le freelance.';
        this.loadPayments();
        this.loadStats();
        setTimeout(() => (this.successMsg = ''), 5000);
      },
      error: (err) => {
        this.resolvingDispute = false;
        this.error = err?.error?.message || "Erreur lors de l'arbitrage du litige.";
      }
    });
  }
}
