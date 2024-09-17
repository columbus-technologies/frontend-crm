export interface Checklist {
  shipment_id: string;
  port_dues: ChecklistInformation;
  pilotage: ChecklistInformation;
  service_launch: ChecklistInformation;
  logistics: ChecklistInformation;
  hotel_charges: ChecklistInformation;
  air_tickets: ChecklistInformation;
  transport_charges: ChecklistInformation;
  medicine_supplies: ChecklistInformation;
  fresh_water_supply: ChecklistInformation;
  marine_advisory: ChecklistInformation;
  courier_services: ChecklistInformation;
  cross_harbour_fees: ChecklistInformation;
  supply_boat: ChecklistInformation;
  repairs: Repairs;
  crew_change: CrewChange;
  extras: { [key: string]: ExtrasInformation };
}

export interface ChecklistResponse {
  ID: string;
  tenant: string;
  port_dues: ChecklistInformation;
  pilotage: ChecklistInformation;
  service_launch: ChecklistInformation;
  logistics: ChecklistInformation;
  hotel_charges: ChecklistInformation;
  air_tickets: ChecklistInformation;
  transport_charges: ChecklistInformation;
  medicine_supplies: ChecklistInformation;
  fresh_water_supply: ChecklistInformation;
  marine_advisory: ChecklistInformation;
  courier_services: ChecklistInformation;
  cross_harbour_fees: ChecklistInformation;
  supply_boat: ChecklistInformation;
  repairs: Repairs;
  crew_change: CrewChange;
  extras: { [key: string]: ExtrasInformation };
  shipment_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistInformation {
  supplier: string;
  service_provided: boolean;
}

export interface ExtrasInformation {
  name: string;
  supplier: string;
  service_provided: boolean;
}

export interface Repairs {
  deslopping: ChecklistInformation;
  lift_repair: ChecklistInformation;
  uw_clean: ChecklistInformation;
}

export interface CrewChange {
  sign_on: string[];
  sign_off: string[];
}
