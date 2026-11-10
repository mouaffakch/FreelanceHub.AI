import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showNotifications = false;

  notifications = [
    { id: 1, title: '🔒 Fonds sous Séquestre', text: 'Garantie Escrow active sur votre mission.', time: 'Il y a 10 min', icon: 'bi-shield-check', type: 'success', read: false },
    { id: 2, title: '💬 Nouveau Message', text: 'Une nouvelle communication est arrivée sur le chat.', time: 'Il y a 35 min', icon: 'bi-chat-dots-fill', type: 'info', read: false },
    { id: 3, title: '⭐ Avis & Évaluation 5★', text: 'Nouvelle note certifiée enregistrée avec succès.', time: 'Il y a 2h', icon: 'bi-star-fill', type: 'warning', read: true }
  ];

  constructor(public auth: AuthService) {}

  get dashboardLink(): string {
    const role = this.auth.getRole();
    if (role === 'ROLE_ADMIN') return '/admin';
    if (role === 'ROLE_CLIENT') return '/client';
    return '/freelance';
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }
}
