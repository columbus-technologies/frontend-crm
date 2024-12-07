export interface PreArrivalDetails {
  [key: string]: string; // Allows any string key with a string value
}

export interface PreArrivalTerminal {
  number: string;
  terminalname: string;
  arrivalDraft: string;
  arrivalMastHeight: string;
  arrivalDisplacement: string;
  departureDraft: string;
  departureMastHeight: string;
  departureDisplacement: string;
}

export interface Cargo {
  number: string;
  typeofcargo: string;
  quantityofcargo: string;
  typeofcargodep: string;
  quantityofcargodep: string;
}

export interface Bunker {
  number: string;
  bunkerprod: string;
  quantityintake: string;
  bunkersize: string;
}

export interface PreArrivalDetailsResponse {
  ID: string;
  name: string;
  date: string;
  time: string;
  lport: string;
  nport: string;
  master: string;
  crew: string;
  ownerAgentAppointed: string;
  alongside: string;
  freeboard: string;
  multiplegrade: string;
  lubeoil: string;
  underwater: string;
  pre_arrival_terminals: PreArrivalTerminal[];
  cargos: Cargo[];
  bunkers: Bunker[];
  tenant: string;
  shipment_id: string;
  created_at: string;
  updated_at: string;
}
