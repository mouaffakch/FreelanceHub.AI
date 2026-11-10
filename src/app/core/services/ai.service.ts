import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AIPromptRequest {
  prompt: string;
  context?: string;
}

export interface AIResponse {
  generatedText: string;
  type: string;
  extractedSkills: string[];
  confidence: number;
}

export interface SmartProjectResponse {
  suggestedTitle: string;
  fullDescription: string;
  estimatedBudget: number;
  suggestedDurationDays: number;
  recommendedSkills: string[];
  recommendedSkillIds: number[];
  architectureType: string;
  keyFeatures: string[];
}

export interface RecommendationResponse {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  clientName: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

@Injectable({ providedIn: 'root' })
export class AIService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ai`;

  // ✨ Assistant Projet Complet
  generateSmartProject(idea: string, platform?: string): Observable<SmartProjectResponse> {
    return this.http.post<SmartProjectResponse>(`${this.apiUrl}/smart-project`, { idea, platform });
  }

  // 📄 Générateur de Proposition Commerciale pour Freelance
  generateProposal(projectId: number, additionalNotes?: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(`${this.apiUrl}/generate-proposal`, { projectId, additionalNotes });
  }

  // 📝 Description
  generateDescription(prompt: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(`${this.apiUrl}/generate-description`, { prompt });
  }

  // ✨ Amélioration Profil
  enhanceProfile(bio: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(`${this.apiUrl}/enhance-profile`, { prompt: bio });
  }

  // 🔍 Extraction Compétences
  extractSkills(text: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(`${this.apiUrl}/extract-skills`, { prompt: text });
  }

  // 🎯 Recommandations Smart Matching
  getRecommendations(limit: number = 10): Observable<RecommendationResponse[]> {
    return this.http.get<RecommendationResponse[]>(`${this.apiUrl}/recommendations?limit=${limit}`);
  }
}
