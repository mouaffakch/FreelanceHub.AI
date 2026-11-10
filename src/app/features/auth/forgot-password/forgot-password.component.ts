import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: '../login/login.component.scss'
})
export class ForgotPasswordComponent {
  private auth = inject(AuthService);

  email = '';
  loading = false;
  error = '';
  successMsg = '';
  simulatedResetUrl = '';

  onSubmit(): void {
    if (!this.email) return;

    this.loading = true;
    this.error = '';
    this.successMsg = '';
    this.simulatedResetUrl = '';

    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res.message || 'Un email de réinitialisation vous a été envoyé.';
        if (res.resetUrl) {
          this.simulatedResetUrl = res.resetUrl;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Une erreur est survenue lors de l\'envoi.';
      }
    });
  }
}
