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

export interface VesselResponse {
  ID: string;
  vessel_specifications: VesselSpecifications;
  created_at: string;
  updated_at: string;
}

export interface Vessel {
  vessel_specifications: VesselSpecifications;
}
