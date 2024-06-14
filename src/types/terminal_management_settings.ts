export interface TerminalSpecifications {
  name: string;
  email: string;
  address: string;
  contact: number;
}

export interface TerminalResponse {
  ID: string;
  terminal_specifications: TerminalSpecifications;
  created_at: string;
  updated_at: string;
}

export interface Terminal {
  terminal_specifications: TerminalSpecifications;
}
