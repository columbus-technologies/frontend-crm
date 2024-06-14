export interface Customer {
  customer: string;
  company: string;
  email: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerResponse {
  ID: string;
  customer: string;
  company: string;
  email: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}
