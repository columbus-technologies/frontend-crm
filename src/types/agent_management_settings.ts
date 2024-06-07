export interface Agent {
  name: string;
  email: string;
  contact: string;
  created_at?: string; // Optional to match the Golang struct behavior
  updated_at?: string; // Optional to match the Golang struct behavior
}

export interface AgentResponse {
  ID: string;
  name: string;
  email: string;
  contact: string;
  created_at: string;
  updated_at: string;
}
