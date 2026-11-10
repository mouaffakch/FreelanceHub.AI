export interface Project {
  id?: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status?: string;
  clientId?: number;
  clientName?: string;
  requiredSkills?: string[];
}

export interface ProjectRequest {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillIds?: number[];
}