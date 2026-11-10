import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { UserService } from '../../core/services/user.service';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './freelancer-list.component.html',
  styleUrl: './freelancer-list.component.scss'
})
export class FreelancerListComponent implements OnInit {
  private userService = inject(UserService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);

  freelancers: any[] = [];
  ratingsMap: { [userId: number]: { avg: number; count: number } } = {};
  loading = true;
  error = '';

  // Filtres
  searchTerm = '';
  selectedSkill = 'ALL';
  minRating = 0;
  availableSkills: string[] = ['Java', 'Spring Boot', 'Angular', 'Flutter', 'Python', 'Docker', 'Machine Learning', 'TypeScript'];

  get isClient(): boolean {
    return this.authService.getRole()?.includes('CLIENT') || false;
  }

  ngOnInit(): void {
    this.loadFreelancers();
  }

  loadFreelancers(): void {
    this.loading = true;
    this.userService.getFreelances().subscribe({
      next: (data: any[]) => {
        this.freelancers = data || [];
        this.loading = false;

        // Charger les ratings de chaque freelance
        this.freelancers.forEach(f => {
          this.reviewService.getAverageRating(f.id).subscribe({
            next: (avg: number) => {
              if (!this.ratingsMap[f.id]) {
                this.ratingsMap[f.id] = { avg: avg || 5.0, count: 0 };
              } else {
                this.ratingsMap[f.id].avg = avg || 5.0;
              }
            },
            error: () => {}
          });

          this.reviewService.getByFreelance(f.id).subscribe({
            next: (reviews: any[]) => {
              if (!this.ratingsMap[f.id]) {
                this.ratingsMap[f.id] = { avg: 5.0, count: reviews ? reviews.length : 0 };
              } else {
                this.ratingsMap[f.id].count = reviews ? reviews.length : 0;
              }
            },
            error: () => {}
          });
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erreur lors du chargement des talents.';
      }
    });
  }

  get filteredFreelancers(): any[] {
    let list = [...this.freelancers];

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(f =>
        (f.firstname && f.firstname.toLowerCase().includes(q)) ||
        (f.lastname && f.lastname.toLowerCase().includes(q)) ||
        (f.bio && f.bio.toLowerCase().includes(q))
      );
    }

    if (this.selectedSkill !== 'ALL') {
      list = list.filter(f => {
        if (!f.skills) return false;
        return f.skills.some((s: string) => s.toLowerCase() === this.selectedSkill.toLowerCase());
      });
    }

    if (this.minRating > 0) {
      list = list.filter(f => {
        const r = this.ratingsMap[f.id]?.avg || 0;
        return r >= this.minRating;
      });
    }

    return list;
  }

  getStars(rating: number): number[] {
    const r = Math.round(rating) || 5;
    return Array(Math.min(5, Math.max(1, r))).fill(0);
  }
}
