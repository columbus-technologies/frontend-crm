import { Agent } from "./agent_management_settings";
import { VesselSpecifications } from "./vessel_management_settings";

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

export interface ShipmentProduct {
  product_type: string;
  sub_products_type: string[];
  quantity: number;
  dimensions: string;
  percentage: number;
}

export interface ShipmentType {
  cargo_operations: boolean;
  bunkering: boolean;
  owner_matters: boolean;
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
