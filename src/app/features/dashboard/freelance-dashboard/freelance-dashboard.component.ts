import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProjectService } from '../../../core/services/project.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AIService, RecommendationResponse } from '../../../core/services/ai.service';
import { PaymentService, PaymentResponse } from '../../../core/services/payment.service';

@Component({
  selector: 'app-freelance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './freelance-dashboard.component.html',
  styleUrl: './freelance-dashboard.component.scss'
})
export class FreelanceDashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private applicationService = inject(ApplicationService);
  private aiService = inject(AIService);
  private paymentService = inject(PaymentService);

  projects: any[] = [];
  myApplications: any[] = [];
  recommendations: RecommendationResponse[] = [];
  myPayments: PaymentResponse[] = [];

  loading = false;
  loadingApps = false;
  loadingReco = false;
  loadingPayments = false;
  error = '';
  successMsg = '';

  get acceptedCount(): number {
    return this.myApplications.filter(a => a.status === 'ACCEPTED').length;
  }

  get pendingCount(): number {
    return this.myApplications.filter(a => a.status === 'PENDING').length;
  }

  get totalSecuredEscrow(): number {
    return this.myPayments
      .filter(p => p.status === 'HELD_IN_ESCROW')
      .reduce((sum, p) => sum + (p.netAmount || 0), 0);
  }

  get totalEarnedReleased(): number {
    return this.myPayments
      .filter(p => p.status === 'RELEASED')
      .reduce((sum, p) => sum + (p.netAmount || 0), 0);
  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadMyApplications();
    this.loadSmartMatching();
    this.loadMyPayments();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAll().subscribe({
      next: (data: any[]) => {
        this.projects = data || [];
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erreur lors du chargement des projets.';
      }
    });
  }

  loadMyApplications(): void {
    this.loadingApps = true;
    this.applicationService.getMyApplications().subscribe({
      next: (apps: any[]) => {
        this.myApplications = apps || [];
        this.loadingApps = false;
      },
      error: () => {
        this.loadingApps = false;
      }
    });
  }

  loadSmartMatching(): void {
    this.loadingReco = true;
    this.aiService.getRecommendations(3).subscribe({
      next: (recs) => {
        this.recommendations = recs || [];
        this.loadingReco = false;
      },
      error: () => {
        this.loadingReco = false;
      }
    });
  }

  loadMyPayments(): void {
    this.loadingPayments = true;
    this.paymentService.getMyPayments().subscribe({
      next: (payments) => {
        this.myPayments = payments || [];
        this.loadingPayments = false;
      },
      error: () => {
        this.loadingPayments = false;
      }
    });
  }

  getPaymentForProject(projectId: number): PaymentResponse | undefined {
    return this.myPayments.find(p => p.projectId === projectId);
  }

  getClientId(app: any): number {
    if (!app) return 1;
    return app.clientId ||
           app.project?.clientId ||
           app.project?.client?.id ||
           app.project?.user?.id ||
           app.client?.id ||
           1;
  }

  getClientName(app: any): string {
    if (!app) return 'Client Partenaire';
    return app.clientName ||
           app.project?.clientName ||
           app.project?.client?.fullName ||
           app.project?.client?.name ||
           app.client?.fullName ||
           'Client Partenaire';
  }

  // ==================== LIVRABLES ====================
  showDeliverModal = false;
  selectedAppForDeliver: any = null;
  deliverUrl = '';
  deliverNotes = '';
  delivering = false;

  openDeliverModal(app: any): void {
    this.selectedAppForDeliver = app;
    this.deliverUrl = app.project?.deliverablesUrl || app.deliverablesUrl || '';
    this.deliverNotes = app.project?.deliverablesNotes || app.deliverablesNotes || '';
    this.error = '';
    this.showDeliverModal = true;
  }

  closeDeliverModal(): void {
    this.showDeliverModal = false;
    this.selectedAppForDeliver = null;
  }

  executeDeliver(): void {
    if (!this.selectedAppForDeliver || !this.deliverUrl.trim()) return;

    const projectId = this.selectedAppForDeliver.projectId || this.selectedAppForDeliver.project?.id;
    if (!projectId) return;

    this.delivering = true;
    this.error = '';

    this.projectService.deliverProject(projectId, {
      deliverablesUrl: this.deliverUrl.trim(),
      deliverablesNotes: this.deliverNotes.trim()
    }).subscribe({
      next: (updatedProj) => {
        this.delivering = false;
        this.showDeliverModal = false;
        if (this.selectedAppForDeliver.project) {
          this.selectedAppForDeliver.project.deliverablesUrl = updatedProj.deliverablesUrl;
          this.selectedAppForDeliver.project.deliverablesNotes = updatedProj.deliverablesNotes;
          this.selectedAppForDeliver.project.deliveredAt = updatedProj.deliveredAt;
        } else {
          this.selectedAppForDeliver.deliverablesUrl = updatedProj.deliverablesUrl;
          this.selectedAppForDeliver.deliverablesNotes = updatedProj.deliverablesNotes;
          this.selectedAppForDeliver.deliveredAt = updatedProj.deliveredAt;
        }
        this.successMsg = '🚀 Livrables transmis avec succès au client pour vérification et déblocage des fonds !';
        this.loadMyApplications();
        setTimeout(() => (this.successMsg = ''), 5000);
      },
      error: (err) => {
        this.delivering = false;
        this.error = err?.error?.message || 'Erreur lors de la transmission des livrables.';
      }
    });
  }

  // ==================== FACTURE / REÇU ESCROW ====================
  showInvoiceModal = false;
  selectedInvoiceApp: any = null;

  openInvoiceModal(app: any): void {
    this.selectedInvoiceApp = app;
    this.showInvoiceModal = true;
  }

  closeInvoiceModal(): void {
    this.showInvoiceModal = false;
    this.selectedInvoiceApp = null;
  }

  printInvoice(): void {
    window.print();
  }
}
