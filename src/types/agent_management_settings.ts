export interface Agent {
  name: string;
  email: string;
  contact: string;
}

export interface AgentResponse {
  ID: string;
  name: string;
  email: string;
  contact: string;
  created_at: string;
  updated_at: string;
}
