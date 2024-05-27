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
  customer: Customer;
}

// src/types/index.ts

// Base type for vessel specifications
export interface VesselSpecifications {
  imo_number: number;
  vessel_name: string;
  call_sign: string;
  sdwt: string;
  nrt: string;
  flag: string;
  grt: string;
  loa: string;
}

// Type for the response from the server
export interface VesselResponse {
  _id: string;
  vessel_specifications: VesselSpecifications;
  created_at: string;
  updated_at: string;
}

export interface Vessel {
  vessel_specifications: VesselSpecifications;
}
