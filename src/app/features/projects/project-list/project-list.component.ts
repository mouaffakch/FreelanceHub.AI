import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProjectService } from '../../../core/services/project.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AIService } from '../../../core/services/ai.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private applicationService = inject(ApplicationService);
  private aiService = inject(AIService);
  private authService = inject(AuthService);

  projects: any[] = [];
  appliedProjectIds: Set<number> = new Set();
  loading = true;
  error = '';
  successMsg = '';

  // Filtres & Recherche
  searchTerm = '';
  selectedSkill = 'ALL';
  sortBy = 'recent';
  availableSkills: string[] = ['Java', 'Spring Boot', 'Angular', 'Flutter', 'Python', 'Docker', 'Machine Learning', 'TypeScript'];

  // Modale de Candidature avec IA
  showApplyModal = false;
  targetProject: any = null;
  coverLetter = '';
  generatingProposal = false;
  submittingApplication = false;
  applyError = '';

  get isFreelance(): boolean {
    return this.authService.getRole()?.includes('FREELANCE') || false;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
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

    this.applicationService.getMyApplications().subscribe({
      next: (apps: any[]) => {
        if (apps) {
          apps.forEach(app => {
            const pId = app.projectId || app.project?.id;
            if (pId) {
              this.appliedProjectIds.add(Number(pId));
            }
          });
        }
      },
      error: () => {}
    });
  }

  get filteredProjects(): any[] {
    let result = [...this.projects];

    // Recherche par mot-clé
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.clientName && p.clientName.toLowerCase().includes(q))
      );
    }

    // Filtrage par compétence
    if (this.selectedSkill !== 'ALL') {
      result = result.filter(p => {
        if (!p.requiredSkills || p.requiredSkills.length === 0) return false;
        return p.requiredSkills.some((s: any) => {
          const name = typeof s === 'string' ? s : s.name;
          return name && name.toLowerCase() === this.selectedSkill.toLowerCase();
        });
      });
    }

    // Tri
    if (this.sortBy === 'budget_desc') {
      result.sort((a, b) => Number(b.budget || 0) - Number(a.budget || 0));
    } else if (this.sortBy === 'budget_asc') {
      result.sort((a, b) => Number(a.budget || 0) - Number(b.budget || 0));
    } else {
      // Recent first (by id or date)
      result.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    }

    return result;
  }

  // Ouverture modale candidature
  openApplyModal(project: any): void {
    if (project.status && project.status !== 'OPEN') {
      return;
    }
    this.targetProject = project;
    this.coverLetter = 'Bonjour, votre projet correspond particulièrement à mes compétences. Je suis disponible pour démarrer rapidement avec une méthodologie agile.';
    this.applyError = '';
    this.showApplyModal = true;
  }

  closeApplyModal(): void {
    this.showApplyModal = false;
    this.targetProject = null;
    this.applyError = '';
  }

  // ✨ IA : Rédiger proposition sur-mesure
  generateAiProposal(): void {
    if (!this.targetProject) return;

    this.generatingProposal = true;
    this.applyError = '';

    this.aiService.generateProposal(this.targetProject.id).subscribe({
      next: (res) => {
        this.coverLetter = res.generatedText;
        this.generatingProposal = false;
      },
      error: (err) => {
        this.generatingProposal = false;
        this.applyError = err?.error?.message || 'Erreur lors de la génération de proposition IA.';
      }
    });
  }

  submitApplication(): void {
    if (!this.targetProject) return;
    if (!this.coverLetter.trim()) {
      this.applyError = 'Veuillez saisir votre message de motivation.';
      return;
    }

    this.submittingApplication = true;
    this.applyError = '';

    this.applicationService.apply(this.targetProject.id, this.coverLetter.trim()).subscribe({
      next: () => {
        this.submittingApplication = false;
        this.appliedProjectIds.add(this.targetProject.id);
        const title = this.targetProject.title;
        this.closeApplyModal();
        this.successMsg = `🎉 Candidature envoyée avec succès pour "${title}" !`;
        setTimeout(() => (this.successMsg = ''), 4500);
      },
      error: (err: any) => {
        this.submittingApplication = false;
        this.applyError = err?.error?.message || 'Erreur lors de l\'envoi de la candidature.';
      }
    });
  }

  hasApplied(projectId: number): boolean {
    return this.appliedProjectIds.has(projectId);
  }

  getSkillNames(project: any): string[] {
    if (!project.requiredSkills) return [];
    return project.requiredSkills.map((s: any) => (typeof s === 'string' ? s : s.name));
  }
}
