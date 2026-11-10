import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { UserService } from '../../core/services/user.service';
import { ProjectService } from '../../core/services/project.service';
import { ReviewService, ReviewResponse } from '../../core/services/review.service';
import { AIService, AIResponse } from '../../core/services/ai.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private userService = inject(UserService);
  private projectService = inject(ProjectService);
  private reviewService = inject(ReviewService);
  private aiService = inject(AIService);
  private authService = inject(AuthService);

  user: any = null;
  reviews: ReviewResponse[] = [];
  completedProjects: any[] = [];
  averageRating = 0;

  loading = true;
  loadingProjects = false;
  saving = false;
  error = '';
  successMsg = '';

  isOwnProfile = true;
  targetUserId: number | null = null;

  // Edit mode
  editMode = false;
  editFirstname = '';
  editLastname = '';
  editBio = '';

  // AI Enhancement
  enhancing = false;
  enhancedBio = '';
  showEnhancedPreview = false;

  get completedCount(): number {
    if (!this.completedProjects || this.completedProjects.length === 0) return 0;
    const closed = this.completedProjects.filter(p => p.status === 'CLOSED').length;
    return closed > 0 ? closed : this.completedProjects.length;
  }

  get inProgressCount(): number {
    if (!this.completedProjects) return 0;
    return this.completedProjects.filter(p => p.status === 'IN_PROGRESS').length;
  }

  get totalDeliveredVolume(): number {
    if (!this.completedProjects) return 0;
    return this.completedProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.targetUserId = Number(idParam);
        const currentUser = this.authService.getCurrentUser();
        this.isOwnProfile = currentUser ? Number(currentUser.userId) === this.targetUserId : false;
        this.loadProfileById(this.targetUserId);
      } else {
        this.isOwnProfile = true;
        this.targetUserId = null;
        this.loadMyProfile();
      }
    });
  }

  loadMyProfile(): void {
    this.loading = true;
    this.error = '';

    this.userService.getMyProfile().subscribe({
      next: (data: any) => {
        this.user = data;
        this.loading = false;
        this.editFirstname = data.firstname || '';
        this.editLastname = data.lastname || '';
        this.editBio = data.bio || '';

        if (data.id) {
          this.loadFreelanceData(data.id);
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Impossible de charger votre profil.';
      }
    });
  }

  loadProfileById(id: number): void {
    this.loading = true;
    this.error = '';

    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.user = data;
        this.loading = false;
        this.editFirstname = data.firstname || '';
        this.editLastname = data.lastname || '';
        this.editBio = data.bio || '';

        this.loadFreelanceData(id);
      },
      error: () => {
        this.loading = false;
        this.error = 'Profil utilisateur introuvable ou inaccessible.';
      }
    });
  }

  loadFreelanceData(userId: number): void {
    // 1. Avis & Notation moyenne
    this.reviewService.getByFreelance(userId).subscribe({
      next: (data: ReviewResponse[]) => {
        this.reviews = data || [];
      },
      error: () => {}
    });

    this.reviewService.getAverageRating(userId).subscribe({
      next: (avg: number) => {
        this.averageRating = avg || 0;
      },
      error: () => {}
    });

    // 2. Projets réalisés / confiés
    this.loadingProjects = true;
    this.projectService.getByFreelance(userId).subscribe({
      next: (projects: any[]) => {
        this.completedProjects = projects || [];
        this.loadingProjects = false;
      },
      error: () => {
        this.loadingProjects = false;
      }
    });
  }

  getReviewForProject(projectId: number): ReviewResponse | undefined {
    return this.reviews.find(r => r.projectId === projectId);
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard/client']);
    }
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    if (this.editMode && this.user) {
      this.editFirstname = this.user.firstname || '';
      this.editLastname = this.user.lastname || '';
      this.editBio = this.user.bio || '';
    }
  }

  saveProfile(): void {
    this.saving = true;
    this.error = '';
    this.successMsg = '';

    this.userService.updateProfile({
      firstname: this.editFirstname,
      lastname: this.editLastname,
      bio: this.editBio
    }).subscribe({
      next: () => {
        this.saving = false;
        this.editMode = false;
        this.successMsg = 'Profil mis à jour avec succès !';
        if (this.targetUserId) {
          this.loadProfileById(this.targetUserId);
        } else {
          this.loadMyProfile();
        }
        setTimeout(() => (this.successMsg = ''), 4000);
      },
      error: (err: any) => {
        this.saving = false;
        this.error = err?.error?.message || 'Erreur lors de la mise à jour.';
      }
    });
  }

  // 🤖 IA : Améliorer la bio
  enhanceBio(): void {
    if (!this.editBio?.trim()) {
      this.error = 'Veuillez écrire quelque chose dans votre bio avant de l\'améliorer.';
      return;
    }
    this.enhancing = true;
    this.aiService.enhanceProfile(this.editBio).subscribe({
      next: (res: AIResponse) => {
        this.enhancedBio = res.generatedText;
        this.showEnhancedPreview = true;
        this.enhancing = false;
      },
      error: () => {
        this.enhancing = false;
        this.error = 'Erreur lors de l\'amélioration IA.';
      }
    });
  }

  applyEnhancedBio(): void {
    this.editBio = this.enhancedBio;
    this.showEnhancedPreview = false;
  }

  getInitial(): string {
    return this.user?.firstname?.charAt(0)?.toUpperCase() || 'U';
  }

  getRoleLabel(): string {
    return this.user?.roleName?.replace('ROLE_', '') || 'MEMBRE';
  }

  getStars(rating: number): number[] {
    const r = Math.round(rating) || 0;
    return Array(Math.max(1, Math.min(5, r))).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    const r = Math.round(rating) || 0;
    return Array(Math.max(0, 5 - r)).fill(0);
  }
}
