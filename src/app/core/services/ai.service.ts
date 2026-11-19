import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export interface AIConnectionTestResult {
  connected: boolean;
  provider: string;
  model?: string;
  latencyMs?: number;
  message: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AIService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ai`;

  private readonly STORAGE_KEY = 'fh_ai_api_key';
  private readonly STORAGE_PROVIDER = 'fh_ai_provider';

  getApiKey(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.STORAGE_KEY) || '';
    }
    return '';
  }

  setApiKey(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (key && key.trim()) {
        localStorage.setItem(this.STORAGE_KEY, key.trim());
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  getProvider(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.STORAGE_PROVIDER) || 'gemini';
    }
    return 'gemini';
  }

  setProvider(provider: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_PROVIDER, provider || 'gemini');
    }
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const key = this.getApiKey();
    const provider = this.getProvider();
    if (key) {
      headers = headers.set('X-AI-API-KEY', key);
    }
    if (provider) {
      headers = headers.set('X-AI-PROVIDER', provider);
    }
    return headers;
  }

  // ✨ Assistant Projet Complet
  generateSmartProject(idea: string, platform?: string): Observable<SmartProjectResponse> {
    return this.http.post<SmartProjectResponse>(
      `${this.apiUrl}/smart-project`,
      { idea, platform },
      { headers: this.getHeaders() }
    );
  }

  // 📄 Générateur de Proposition Commerciale pour Freelance
  generateProposal(projectId: number, additionalNotes?: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(
      `${this.apiUrl}/generate-proposal`,
      { projectId, additionalNotes },
      { headers: this.getHeaders() }
    );
  }

  // 📝 Description
  generateDescription(prompt: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(
      `${this.apiUrl}/generate-description`,
      { prompt },
      { headers: this.getHeaders() }
    );
  }

  // ✨ Amélioration Profil
  enhanceProfile(bio: string, tone: string = 'IMPACT'): Observable<AIResponse> {
    return this.http.post<AIResponse>(
      `${this.apiUrl}/enhance-profile`,
      { prompt: bio, tone },
      { headers: this.getHeaders() }
    );
  }

  // 🔍 Extraction Compétences
  extractSkills(text: string): Observable<AIResponse> {
    return this.http.post<AIResponse>(
      `${this.apiUrl}/extract-skills`,
      { prompt: text },
      { headers: this.getHeaders() }
    );
  }

  // 🎯 Recommandations Smart Matching
  getRecommendations(limit: number = 10): Observable<RecommendationResponse[]> {
    return this.http.get<RecommendationResponse[]>(
      `${this.apiUrl}/recommendations?limit=${limit}`,
      { headers: this.getHeaders() }
    );
  }

  // 🧪 Test de Connexion LLM
  testConnection(key?: string, provider?: string): Observable<AIConnectionTestResult> {
    const payload = {
      key: key !== undefined ? key : this.getApiKey(),
      provider: provider || this.getProvider()
    };
    return this.http.post<AIConnectionTestResult>(
      `${this.apiUrl}/test-connection`,
      payload
    );
  }

  // ℹ️ Statut du Moteur IA
  getAiStatus(): Observable<{ hasExternalKey: boolean; provider: string; mode: string }> {
    return this.http.get<{ hasExternalKey: boolean; provider: string; mode: string }>(
      `${this.apiUrl}/status`,
      { headers: this.getHeaders() }
    );
  }
}
