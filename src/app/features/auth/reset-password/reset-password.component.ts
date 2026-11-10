import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: '../login/login.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  successMsg = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.error = 'Jeton de réinitialisation manquant dans l\'URL.';
      }
    });
  }

  onSubmit(): void {
    if (!this.token) {
      this.error = 'Jeton de réinitialisation invalide.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'Le mot de passe doit comporter au moins 6 caractères.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les deux mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMsg = '';

    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res.message || 'Mot de passe réinitialisé avec succès !';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erreur lors de la réinitialisation.';
      }
    });
  }
}
