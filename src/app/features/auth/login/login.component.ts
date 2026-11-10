import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.roleName.includes('ADMIN')) this.router.navigate(['/dashboard/admin']);
        else if (res.roleName.includes('CLIENT')) this.router.navigate(['/dashboard/client']);
        else this.router.navigate(['/dashboard/freelance']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Identifiants invalides ou serveur indisponible';
      }
    });
  }
}
