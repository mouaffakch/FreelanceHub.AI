import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProjectService } from '../../../core/services/project.service';
import { ApplicationService } from '../../../core/services/application.service';
import { ReviewService, ReviewResponse } from '../../../core/services/review.service';
import { PaymentService, PaymentResponse } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss'
})
export class ClientDashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private applicationService = inject(ApplicationService);
  private reviewService = inject(ReviewService);
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  projects: any[] = [];
  selectedProject: any = null;
  applications: any[] = [];
  
  loadingProjects = false;
  loadingApps = false;
  loadingPayment = false;
  loadingReview = false;
  error = '';
  successMsg = '';

  // Paiement & Escrow du projet sélectionné
  projectPayment: PaymentResponse | null = null;
  projectReview: ReviewResponse | null = null;

  // Modale d'évaluation & déblocage du séquestre
  showReviewModal = false;
  reviewRating = 5;
  hoverRating = 0;
  reviewComment = '';
  submittingReview = false;

  // Modale de consignation Escrow (Paiement)
  showDepositModal = false;
  depositingEscrow = false;
  depositCardNumber = '';
  depositCardHolder = '';
  depositExpiry = '';
  depositCvv = '';
  depositPaymentMethod = 'CREDIT_CARD';
  depositError = '';

  // Modale de litige
  showDisputeModal = false;
  disputeReason = '';
  submittingDispute = false;

  // Modale de confirmation de suppression
  showDeleteModal = false;
  projectToDeleteId: number | null = null;
  deletingProject = false;

  // Modale Facture / Reçu Escrow
  showInvoiceModal = false;

  openInvoiceModal(): void {
    this.showInvoiceModal = true;
  }

  closeInvoiceModal(): void {
    this.showInvoiceModal = false;
  }

  printInvoice(): void {
    window.print();
  }

  ratingLabels: { [key: number]: string } = {
    1: '⭐ 1/5 — Insatisfaisant / Incomplet',
    2: '⭐⭐ 2/5 — Décevant',
    3: '⭐⭐⭐ 3/5 — Travail convenable',
    4: '⭐⭐⭐⭐ 4/5 — Très bon travail',
    5: '⭐⭐⭐⭐⭐ 5/5 — Prestation exceptionnelle'
  };

  getStarsArray(count: number): number[] {
    const c = Math.max(0, Math.round(count) || 0);
    return Array(c).fill(0);
  }

  getRatingLabel(): string {
    const current = this.hoverRating || this.reviewRating;
    return this.ratingLabels[current] || '⭐⭐⭐⭐⭐ 5/5 — Prestation exceptionnelle';
  }

  get totalProjects(): number {
    return this.projects ? this.projects.length : 0;
  }

  get inProgressCount(): number {
    return this.projects.filter(p => p.status === 'IN_PROGRESS').length;
  }

  get openCount(): number {
    return this.projects.filter(p => p.status === 'OPEN').length;
  }

  get formattedDisplayCardNumber(): string {
    if (!this.depositCardNumber) return '•••• •••• •••• ••••';
    return this.depositCardNumber;
  }

  get displayCardHolder(): string {
    return this.depositCardHolder.trim().toUpperCase() || 'NOM DU TITULAIRE';
  }

  get displayExpiry(): string {
    return this.depositExpiry.trim() || 'MM/AA';
  }

  get cardBrand(): string {
    const clean = this.depositCardNumber.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('3')) return 'AMEX';
    return 'CARTE BANCAIRE';
  }

  get isDepositFormValid(): boolean {
    const cleanCard = this.depositCardNumber.replace(/\s+/g, '');
    const hasCard = cleanCard.length >= 15;
    const hasHolder = this.depositCardHolder.trim().length >= 2;
    const hasExpiry = this.depositExpiry.length === 5;
    const hasCvv = this.depositCvv.length >= 3;
    return hasCard && hasHolder && hasExpiry && hasCvv;
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loadingProjects = true;
    this.error = '';

    this.projectService.getMyProjects().subscribe({
      next: (data: any[]) => {
        this.projects = data || [];
        this.loadingProjects = false;
        
        if (this.projects.length > 0) {
          if (!this.selectedProject) {
            this.selectProject(this.projects[0]);
          } else {
            const found = this.projects.find(p => p.id === this.selectedProject.id);
            this.selectProject(found || this.projects[0]);
          }
        } else {
          this.selectedProject = null;
          this.applications = [];
          this.projectPayment = null;
          this.projectReview = null;
        }
      },
      error: (err: any) => {
        this.loadingProjects = false;
        this.error = err?.error?.message || 'Erreur lors du chargement des projets.';
      }
    });
  }

  selectProject(project: any): void {
    this.selectedProject = project;
    this.loadApplicationsForSelectedProject();
    this.loadPaymentForSelectedProject();
    this.loadReviewForSelectedProject();
  }

  loadApplicationsForSelectedProject(): void {
    if (!this.selectedProject) return;

    this.loadingApps = true;
    this.applicationService.getByProject(this.selectedProject.id).subscribe({
      next: (apps: any[]) => {
        this.applications = apps || [];
        this.loadingApps = false;
      },
      error: () => {
        this.loadingApps = false;
      }
    });
  }

  loadPaymentForSelectedProject(): void {
    if (!this.selectedProject) return;

    this.loadingPayment = true;
    this.paymentService.getByProject(this.selectedProject.id).subscribe({
      next: (payment: PaymentResponse) => {
        this.projectPayment = payment || null;
        this.loadingPayment = false;
      },
      error: () => {
        this.projectPayment = null;
        this.loadingPayment = false;
      }
    });
  }

  loadReviewForSelectedProject(): void {
    if (!this.selectedProject) return;

    this.loadingReview = true;
    this.reviewService.getByProject(this.selectedProject.id).subscribe({
      next: (review: ReviewResponse) => {
        this.projectReview = review || null;
        this.loadingReview = false;
      },
      error: () => {
        this.projectReview = null;
        this.loadingReview = false;
      }
    });
  }

  getFreelanceName(app: any): string {
    if (!app) return 'Freelance';
    return app.freelanceName || app.applicantName || app.freelancerName || app.freelance?.fullName || 'Freelance';
  }

  getFreelanceId(app: any): number {
    if (!app) return 2;
    const id = app.freelanceId || app.applicantId || app.freelancerId || app.userId || app.freelance?.id;
    return id ? Number(id) : 2;
  }

  hasAcceptedFreelance(): boolean {
    return this.applications.some(a => a.status === 'ACCEPTED');
  }

  getAcceptedFreelanceName(): string {
    const accepted = this.applications.find(a => a.status === 'ACCEPTED');
    return accepted ? this.getFreelanceName(accepted) : 'Freelance Partenaire';
  }

  acceptFreelance(appId: number): void {
    this.error = '';
    this.successMsg = '';

    this.applicationService.accept(appId).subscribe({
      next: () => {
        this.successMsg = '🎉 Candidature acceptée avec succès ! Le projet passe au statut EN COURS.';
        this.loadProjects();
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Erreur lors de l\'acceptation.';
      }
    });
  }

  rejectFreelance(appId: number): void {
    this.error = '';
    this.successMsg = '';

    this.applicationService.reject(appId).subscribe({
      next: () => {
        this.successMsg = 'Candidature refusée.';
        this.loadApplicationsForSelectedProject();
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Erreur lors du refus.';
      }
    });
  }

  // ==================== CONSIGNATION SÉQUESTRE (ESCROW DEPOSIT) ====================
  openDepositModal(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!this.depositCardHolder) {
      this.depositCardHolder = currentUser?.fullName || '';
    }
    this.depositError = '';
    this.showDepositModal = true;
  }

  closeDepositModal(): void {
    this.showDepositModal = false;
    this.depositError = '';
  }

  onCardNumberInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '').substring(0, 16);
    const parts = value.match(/.{1,4}/g) || [];
    this.depositCardNumber = parts.join(' ');
  }

  onExpiryInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      this.depositExpiry = value.substring(0, 2) + '/' + value.substring(2);
    } else {
      this.depositExpiry = value;
    }
  }

  onCvvInput(event: any): void {
    this.depositCvv = event.target.value.replace(/\D/g, '').substring(0, 4);
  }

  fillDemoCard(): void {
    const currentUser = this.authService.getCurrentUser();
    this.depositCardHolder = currentUser?.fullName || 'Jean Dupont';
    this.depositCardNumber = '4242 4242 4242 4242';
    this.depositExpiry = '12/28';
    this.depositCvv = '842';
    this.depositError = '';
  }

  executeDeposit(): void {
    if (!this.selectedProject) return;

    if (!this.isDepositFormValid) {
      this.depositError = 'Veuillez saisir toutes les informations de votre carte : numéro à 16 chiffres, nom du titulaire, date d\'expiration (MM/AA) et code de sécurité CVV (3 chiffres).';
      return;
    }

    this.depositingEscrow = true;
    this.depositError = '';

    this.paymentService.depositEscrow({
      projectId: this.selectedProject.id,
      paymentMethod: this.depositPaymentMethod,
      cardNumber: this.depositCardNumber,
      cardHolder: this.depositCardHolder,
      expiryDate: this.depositExpiry
    }).subscribe({
      next: (payment) => {
        this.depositingEscrow = false;
        this.showDepositModal = false;
        this.projectPayment = payment;
        this.successMsg = '🔒 Montant de ' + (this.selectedProject?.budget || 0) + ' € consigné sous séquestre avec succès ! Vos données ont été validées et le projet est sécurisé.';
        this.loadProjects();
        setTimeout(() => (this.successMsg = ''), 5000);
      },
      error: (err) => {
        this.depositingEscrow = false;
        this.depositError = err?.error?.message || 'Erreur lors du dépôt sous séquestre.';
      }
    });
  }

  // ==================== VALIDATION, NOTATION & DÉBLOCAGE PAIEMENT ====================
  openCompleteModal(): void {
    this.reviewRating = 5;
    this.hoverRating = 0;
    this.reviewComment = '';
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
  }

  setRating(rating: number): void {
    this.reviewRating = rating;
  }

  setHover(rating: number): void {
    this.hoverRating = rating;
  }

  submitReview(): void {
    if (!this.selectedProject || !this.reviewComment.trim()) return;

    this.submittingReview = true;
    this.error = '';

    this.reviewService.createReview({
      projectId: this.selectedProject.id,
      rating: this.reviewRating,
      comment: this.reviewComment.trim()
    }).subscribe({
      next: () => {
        // Libérer les fonds du séquestre
        this.paymentService.releaseEscrow(this.selectedProject.id).subscribe({
          next: (payment) => {
            this.submittingReview = false;
            this.showReviewModal = false;
            this.projectPayment = payment;
            this.successMsg = '🌟 Mission validée avec succès ! Les fonds ont été débloqués pour le freelance et votre avis est enregistré.';
            this.loadProjects();
            setTimeout(() => (this.successMsg = ''), 5000);
          },
          error: () => {
            this.submittingReview = false;
            this.showReviewModal = false;
            this.successMsg = '🌟 Avis enregistré avec succès !';
            this.loadProjects();
            setTimeout(() => (this.successMsg = ''), 5000);
          }
        });
      },
      error: (err: any) => {
        this.submittingReview = false;
        this.error = err?.error?.message || 'Erreur lors de l\'enregistrement de l\'avis.';
      }
    });
  }

  // ==================== DÉCLARATION DE LITIGE ====================
  openDisputeModal(): void {
    this.disputeReason = '';
    this.showDisputeModal = true;
  }

  closeDisputeModal(): void {
    this.showDisputeModal = false;
  }

  executeDispute(): void {
    if (!this.selectedProject || !this.disputeReason.trim()) return;

    this.submittingDispute = true;
    this.error = '';

    this.paymentService.openDispute({
      projectId: this.selectedProject.id,
      reason: this.disputeReason.trim()
    }).subscribe({
      next: (payment) => {
        this.submittingDispute = false;
        this.showDisputeModal = false;
        this.projectPayment = payment;
        this.successMsg = '⚠️ Litige ouvert. Les fonds sont gelés sous séquestre pour examen par l\'administrateur.';
        this.loadProjects();
        setTimeout(() => (this.successMsg = ''), 5000);
      },
      error: (err) => {
        this.submittingDispute = false;
        this.error = err?.error?.message || 'Erreur lors du signalement du litige.';
      }
    });
  }

  // ==================== SUPPRESSION PROJET ====================
  confirmDelete(id: number): void {
    this.projectToDeleteId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.projectToDeleteId = null;
  }

  executeDelete(): void {
    if (!this.projectToDeleteId) return;

    this.deletingProject = true;
    this.projectService.delete(this.projectToDeleteId).subscribe({
      next: () => {
        this.deletingProject = false;
        this.showDeleteModal = false;
        this.projectToDeleteId = null;
        this.successMsg = 'Projet supprimé avec succès.';
        this.loadProjects();
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: (err: any) => {
        this.deletingProject = false;
        this.error = err?.error?.message || 'Erreur lors de la suppression.';
      }
    });
  }
}
