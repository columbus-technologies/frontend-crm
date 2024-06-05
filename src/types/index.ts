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
  ID: string;
  vessel_specifications: VesselSpecifications;
  created_at: string;
  updated_at: string;
}

export interface Vessel {
  vessel_specifications: VesselSpecifications;
}

export interface SubProduct {
  sub_product: string;
}

export interface Product {
  product: string;
  sub_products: SubProduct[];
}

export interface QuantityDimensions {
  KG: number;
  G: number;
}

export interface ShipmentProduct {
  products: Product[];
  quantity: number;
  dimensions: QuantityDimensions;
  percentage: number;
}

export interface ArrivalDepartureInformation {
  arrival_displacement: number;
  departure_displacement: number;
  arrival_draft: number;
  departure_draft: number;
  arrival_mast_height: number;
  departure_mast_height: number;
}

export interface CustomerSpecifications {
  customer: string;
  company: string;
  email: string;
  contact: string;
}

export interface Activity {
  activity_type: string;
  customer_specifications: CustomerSpecifications;
  anchorage_location: string;
  terminal_location: string;
  shipment_product: ShipmentProduct;
  readiness: string; // Use string type for date-time fields
  etb: string;
  etd: string;
  arrival_departure_information: ArrivalDepartureInformation;
}

export interface ShipmentType {
  cargo_operations: boolean;
  bunkering: boolean;
  owner_matters: boolean;
}

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

export interface Agent {
  name: string;
  email: string;
  agent_contact: string;
}

export interface ShipmentDetails {
  agent_details: Agent;
}

export interface Shipment {
  master_email: string;
  ETA: string;
  voyage_number: string;
  current_status: string;
  shipment_type: ShipmentType;
  vessel_specifications: VesselSpecifications;
  shipment_details: ShipmentDetails;
  activity: Activity[];
}

export interface ShipmentResponse {
  ID: string;
  master_email: string;
  ETA: string;
  voyage_number: string;
  current_status: string;
  shipment_type: ShipmentType;
  vessel_specifications: VesselSpecifications;
  shipment_details: ShipmentDetails;
  activity: Activity[];
  created_at: string;
  updated_at: string;
}
