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

export interface CargoOperationsActivity {
  activity_type: string;
  customer_name: string;
  anchorage_location: string;
  terminal_name: string;
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

export interface CargoOperations {
  cargo_operations: boolean;
  cargo_operations_activity: CargoOperationsActivity[];
}

export interface BunkeringActivity {
  supplier: string;
  supplier_contact: string;
  appointed_surveyor: string;
  docking: Docking;
  supplier_vessel: string;
  bunker_intake_product: ShipmentProduct;
  bunker_hose_product: ShipmentProduct;
  freeboard: number;
  readiness: string;
  etb: string;
  etd: string;
}

export interface Docking {
  starboard: boolean;
  port: boolean;
}

export interface Bunkering {
  bunkering: boolean;
  bunkering_activity: BunkeringActivity[];
}

export interface OwnerMatters {
  owner_matters: boolean;
  activity: Activity[];
}

export interface Activity {
  activity_type: string;
  customer_name: string;
  anchorage_location: string;
  terminal_name: string;
  shipment_product: ShipmentProduct;
  readiness: string;
  etb: string;
  etd: string;
  arrival_departure_information: ArrivalDepartureInformation;
}

export interface ShipmentType {
  cargo_operations: CargoOperations;
  bunkering: Bunkering;
  owner_matters: OwnerMatters;
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
  activity: CargoOperationsActivity[];
  created_at: string;
  updated_at: string;
}
