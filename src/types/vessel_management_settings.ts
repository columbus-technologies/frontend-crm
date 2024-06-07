export interface VesselSpecifications {
  imo_number: number;
  vessel_name: string;
  call_sign: string;
  sdwt: number;
  nrt: number;
  flag: string;
  grt: number;
  loa: number;
}

export interface VesselResponse {
  ID: string;
  vessel_specifications: VesselSpecifications;
  created_at: string;
  updated_at: string;
}

export interface Vessel {
  vessel_specifications: VesselSpecifications;
}
