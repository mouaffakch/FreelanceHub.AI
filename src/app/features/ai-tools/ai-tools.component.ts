import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AIService, AIResponse, SmartProjectResponse, RecommendationResponse } from '../../core/services/ai.service';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-ai-tools',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './ai-tools.component.html',
  styleUrl: './ai-tools.component.scss'
})
export class AIToolsComponent implements OnInit {
  private aiService = inject(AIService);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  // Active tab
  activeTab: 'smart-project' | 'proposal' | 'profile' | 'skills' | 'recommendations' = 'smart-project';

  // 1. Smart Project Generator
  smartIdea = '';
  smartPlatform = 'Web';
  smartResult: SmartProjectResponse | null = null;
  smartLoading = false;

  // 2. Proposal Generator
  allProjects: any[] = [];
  selectedProjectId: number | null = null;
  proposalNotes = '';
  proposalResult: AIResponse | null = null;
  proposalLoading = false;

  // 3. Profile Enhancement
  profileBio = '';
  profileResult: AIResponse | null = null;
  profileLoading = false;

  // 4. Skill Extraction
  skillText = '';
  skillResult: AIResponse | null = null;
  skillLoading = false;

  // 5. Recommendations
  recommendations: RecommendationResponse[] = [];
  recoLoading = false;

  // AI Engine Settings State
  showAiConfig = false;
  aiProvider = 'gemini';
  aiApiKey = '';
  aiTesting = false;
  aiTestSuccess: boolean | null = null;
  aiTestMessage = '';

  error = '';
  copied = false;

  get isFreelance(): boolean {
    return this.authService.getRole()?.includes('FREELANCE') || false;
  }

  get hasActiveKey(): boolean {
    return !!this.aiApiKey && this.aiApiKey.trim().length > 0;
  }

  ngOnInit(): void {
    this.aiProvider = this.aiService.getProvider() || 'gemini';
    this.aiApiKey = this.aiService.getApiKey();
    this.loadProjectsList();
    if (this.isFreelance) {
      this.loadRecommendations();
    }
  }

  toggleAiConfig(): void {
    this.showAiConfig = !this.showAiConfig;
    if (this.showAiConfig) {
      this.aiProvider = this.aiService.getProvider() || 'gemini';
      this.aiApiKey = this.aiService.getApiKey();
      this.aiTestMessage = '';
      this.aiTestSuccess = null;
    }
  }

  saveAiConfig(): void {
    this.aiTesting = true;
    this.aiTestMessage = '';
    this.aiTestSuccess = null;

    if (!this.aiApiKey.trim()) {
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
          this.aiTestMessage = `Connexion établie avec succès avec ${res.provider} (Latence : ${res.latencyMs || 0} ms) ! L'Agent IA distant est maintenant actif.`;
        } else {
          this.aiTestSuccess = false;
          this.aiTestMessage = res.message || 'Échec de validation de la clé API.';
        }
      },
      error: (err) => {
        this.aiTesting = false;
        this.aiTestSuccess = false;
        this.aiTestMessage = err?.error?.message || 'Erreur lors du test de connexion.';
      }
    });
  }

  clearAiConfig(): void {
    this.aiApiKey = '';
    this.aiService.setApiKey('');
    this.aiTestSuccess = null;
    this.aiTestMessage = 'Clé supprimée. Retour au mode Agent Sémantique Local.';
  }

  loadProjectsList(): void {
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.allProjects = projects || [];
        if (this.allProjects.length > 0) {
          this.selectedProjectId = this.allProjects[0].id;
        }
      },
      error: () => {}
    });
  }

  setTab(tab: 'smart-project' | 'proposal' | 'profile' | 'skills' | 'recommendations') {
    this.activeTab = tab;
    this.error = '';
    if (tab === 'recommendations' && this.recommendations.length === 0) {
      this.loadRecommendations();
    }
  }

  // ✨ Smart Project Generator
  generateSmartProject(): void {
    if (!this.smartIdea.trim()) return;
    this.smartLoading = true;
    this.error = '';

    this.aiService.generateSmartProject(this.smartIdea, this.smartPlatform).subscribe({
      next: (res) => {
        this.smartResult = res;
        this.smartLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de la génération du projet.';
        this.smartLoading = false;
      }
    });
  }

  // 📄 Tailored Proposal
  generateProposal(): void {
    if (!this.selectedProjectId) return;
    this.proposalLoading = true;
    this.error = '';

    this.aiService.generateProposal(this.selectedProjectId, this.proposalNotes).subscribe({
      next: (res) => {
        this.proposalResult = res;
        this.proposalLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de la rédaction de la proposition.';
        this.proposalLoading = false;
      }
    });
  }

  // ✨ Profile Enhancement
  enhanceProfile(): void {
    if (!this.profileBio.trim()) return;
    this.profileLoading = true;
    this.error = '';

    this.aiService.enhanceProfile(this.profileBio).subscribe({
      next: (res) => {
        this.profileResult = res;
        this.profileLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur IA lors de l\'amélioration du profil.';
        this.profileLoading = false;
      }
    });
  }

  // 🔍 Skill Extraction
  extractSkills(): void {
    if (!this.skillText.trim()) return;
    this.skillLoading = true;
    this.error = '';

    this.aiService.extractSkills(this.skillText).subscribe({
      next: (res) => {
        this.skillResult = res;
        this.skillLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur IA lors de l\'extraction.';
        this.skillLoading = false;
      }
    });
  }

  // 🎯 Recommandations
  loadRecommendations(): void {
    this.recoLoading = true;
    this.error = '';
    this.aiService.getRecommendations(10).subscribe({
      next: (data) => {
        this.recommendations = data || [];
        this.recoLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors du calcul des recommandations.';
        this.recoLoading = false;
      }
    });
  }

  copyToClipboard(text: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    }
  }
}
