import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AIService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  public auth = inject(AuthService);
  private aiService = inject(AIService);

  showNotifications = false;

  // AI Agent Modal State
  showAiModal = false;
  aiProvider = 'gemini';
  aiApiKey = '';
  aiTesting = false;
  aiTestMessage = '';
  aiTestSuccess: boolean | null = null;
  aiTestLatency = 0;

  notifications = [
    { id: 1, title: 'Fonds sous Séquestre', text: 'Garantie Escrow active sur votre mission.', time: 'Il y a 10 min', icon: 'bi-shield-check', type: 'success', read: false },
    { id: 2, title: 'Nouveau Message', text: 'Une nouvelle communication est arrivée sur le chat.', time: 'Il y a 35 min', icon: 'bi-chat-dots-fill', type: 'info', read: false },
    { id: 3, title: 'Avis & Évaluation 5 Étoiles', text: 'Nouvelle note certifiée enregistrée avec succès.', time: 'Il y a 2h', icon: 'bi-star-fill', type: 'warning', read: true }
  ];

  ngOnInit(): void {
    this.aiApiKey = this.aiService.getApiKey();
    this.aiProvider = this.aiService.getProvider() || 'gemini';
  }

  get dashboardLink(): string {
    const role = this.auth.getRole();
    if (role === 'ROLE_ADMIN') return '/admin';
    if (role === 'ROLE_CLIENT') return '/client';
    return '/freelance';
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get hasActiveKey(): boolean {
    return !!this.aiApiKey && this.aiApiKey.trim().length > 0;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  openAiModal(): void {
    this.aiApiKey = this.aiService.getApiKey();
    this.aiProvider = this.aiService.getProvider() || 'gemini';
    this.aiTestMessage = '';
    this.aiTestSuccess = null;
    this.showAiModal = true;
  }

  closeAiModal(): void {
    this.showAiModal = false;
  }

  testAndSaveAiKey(): void {
    this.aiTesting = true;
    this.aiTestMessage = '';
    this.aiTestSuccess = null;

    if (!this.aiApiKey.trim()) {
      // Pass to local mode
      this.aiService.setApiKey('');
      this.aiService.setProvider(this.aiProvider);
      this.aiTesting = false;
      this.aiTestSuccess = true;
      this.aiTestMessage = 'Mode Agent Sémantique Local actif (aucun crédit requis).';
      return;
    }

    this.aiService.testConnection(this.aiApiKey.trim(), this.aiProvider).subscribe({
      next: (res) => {
        this.aiTesting = false;
        if (res.connected) {
          this.aiService.setApiKey(this.aiApiKey.trim());
          this.aiService.setProvider(this.aiProvider);
          this.aiTestSuccess = true;
          this.aiTestLatency = res.latencyMs || 0;
          this.aiTestMessage = `Connexion établie avec succès avec ${res.provider} (Latence : ${res.latencyMs || 0} ms) ! L'Agent IA est maintenant actif sur l'ensemble de l'application.`;
        } else {
          this.aiTestSuccess = false;
          this.aiTestMessage = res.message || 'Échec de validation de la clé API. Vérifiez votre clé.';
        }
      },
      error: (err) => {
        this.aiTesting = false;
        this.aiTestSuccess = false;
        this.aiTestMessage = err?.error?.message || 'Erreur lors de la communication avec le serveur.';
      }
    });
  }

  clearAiKey(): void {
    this.aiApiKey = '';
    this.aiService.setApiKey('');
    this.aiTestSuccess = null;
    this.aiTestMessage = 'Clé supprimée. Retour au mode Agent Sémantique Local.';
  }
}
