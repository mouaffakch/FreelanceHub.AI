import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ProjectService, ProjectRequest } from '../../../core/services/project.service';
import { AIService, SmartProjectResponse } from '../../../core/services/ai.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  private projectService = inject(ProjectService);
  private aiService = inject(AIService);
  private adminService = inject(AdminService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Form Fields
  title = '';
  description = '';
  budget: number = 3000;
  deadline = '';
  status = 'OPEN';
  selectedSkillIds: Set<number> = new Set();

  // All available skills in DB
  availableSkills: any[] = [];

  // AI Assistant state
  aiPrompt = '';
  aiGenerating = false;
  aiGenerated = false;
  aiResult: SmartProjectResponse | null = null;
  aiError = '';

  loading = false;
  error = '';
  success = '';
  isEdit = false;
  projectId: number | null = null;

  ngOnInit(): void {
    this.loadSkills();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.projectId = +id;
      this.projectService.getById(this.projectId).subscribe({
        next: (p: any) => {
          this.title = p.title ?? '';
          this.description = p.description ?? '';
          this.budget = p.budget ?? 0;
          this.deadline = p.deadline ? String(p.deadline).substring(0, 10) : '';
          this.status = p.status ?? 'OPEN';
        },
        error: () => (this.error = 'Projet introuvable.')
      });
    } else {
      // Default deadline: +30 days
      const d = new Date();
      d.setDate(d.getDate() + 30);
      this.deadline = d.toISOString().substring(0, 10);
    }
  }

  loadSkills(): void {
    this.adminService.getSkills().subscribe({
      next: (skills) => {
        this.availableSkills = skills || [];
      },
      error: () => {}
    });
  }

  // ✨ IA : Génération intelligente du projet complet
  generateWithAI(): void {
    if (!this.aiPrompt.trim()) return;

    this.aiGenerating = true;
    this.aiError = '';

    this.aiService.generateSmartProject(this.aiPrompt).subscribe({
      next: (res: SmartProjectResponse) => {
        this.aiResult = res;
        this.aiGenerating = false;
        this.aiGenerated = true;

        // Pré-remplir instantanément les champs du formulaire !
        this.title = res.suggestedTitle;
        this.description = res.fullDescription;
        this.budget = res.estimatedBudget;

        // Calculer la date selon les jours suggérés
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + (res.suggestedDurationDays || 30));
        this.deadline = targetDate.toISOString().substring(0, 10);

        // Sélectionner les compétences recommandées
        if (res.recommendedSkillIds && res.recommendedSkillIds.length > 0) {
          res.recommendedSkillIds.forEach(id => this.selectedSkillIds.add(id));
        } else if (res.recommendedSkills) {
          this.availableSkills.forEach(s => {
            if (res.recommendedSkills.some(name => name.toLowerCase() === s.name.toLowerCase())) {
              this.selectedSkillIds.add(s.id);
            }
          });
        }
      },
      error: (err) => {
        this.aiGenerating = false;
        this.aiError = err?.error?.message || 'Erreur lors de la génération IA.';
      }
    });
  }

  toggleSkill(skillId: number): void {
    if (this.selectedSkillIds.has(skillId)) {
      this.selectedSkillIds.delete(skillId);
    } else {
      this.selectedSkillIds.add(skillId);
    }
  }

  isSkillSelected(skillId: number): boolean {
    return this.selectedSkillIds.has(skillId);
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.title.trim() || !this.description.trim()) {
      this.error = 'Veuillez renseigner le titre et la description.';
      return;
    }

    this.loading = true;

    const payload: ProjectRequest = {
      title: this.title.trim(),
      description: this.description.trim(),
      budget: Number(this.budget),
      deadline: this.deadline ? this.deadline : undefined,
      status: this.status,
      skillIds: Array.from(this.selectedSkillIds)
    };

    const req$ = this.isEdit && this.projectId
      ? this.projectService.update(this.projectId, payload)
      : this.projectService.create(payload);

    req$.subscribe({
      next: () => {
        this.loading = false;
        this.success = this.isEdit ? 'Projet mis à jour avec succès !' : 'Projet publié avec succès !';
        setTimeout(() => this.router.navigate(['/client']), 600);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erreur lors de l\'enregistrement du projet.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/client']);
  }
}
