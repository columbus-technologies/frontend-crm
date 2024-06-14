export interface TerminalSpecifications {
  name: string;
  email: string;
  address: string;
  contact: number;
}

export interface TerminalResponse {
  ID: string;
  name: string;
  address: string;
  email: string;
  contact: string;
  created_at: string;
  updated_at: string;
}

export interface Terminal {
  terminal_specifications: TerminalSpecifications;
}
