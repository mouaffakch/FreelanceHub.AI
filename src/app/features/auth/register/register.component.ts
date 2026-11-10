import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  roleName = 'CLIENT';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.auth.register({
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      roleName: this.roleName
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.roleName.includes('CLIENT')) {
          this.router.navigate(['/dashboard/client']);
        } else {
          this.router.navigate(['/dashboard/freelance']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Inscription échouée. Vérifiez vos données.';
      }
    });
  }
}
