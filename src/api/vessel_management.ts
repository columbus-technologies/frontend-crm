import { Vessel, VesselResponse } from "../types";
import { prepareAuthHeaders } from "../utils/auth";

const VESSEL_SETTINGS_URL = "http://localhost:8080/vessel_management";

export const fetchVessels = async (): Promise<VesselResponse[]> => {
  const response = await fetch(VESSEL_SETTINGS_URL, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(response.statusText);
  }

  const data = await response.json();
  const vessels: VesselResponse[] = data.vessels.map((vessel: any) => ({
    ID: vessel.ID,
    imo_number: vessel.vessel_specifications.imo_number,
    vessel_name: vessel.vessel_specifications.vessel_name,
    call_sign: vessel.vessel_specifications.call_sign,
    sdwt: vessel.vessel_specifications.sdwt,
    nrt: vessel.vessel_specifications.nrt,
    flag: vessel.vessel_specifications.flag,
    grt: vessel.vessel_specifications.grt,
    loa: vessel.vessel_specifications.loa,
    created_at: vessel.created_at,
    updated_at: vessel.updated_at,
  }));
  return vessels;
};

export const createVessel = async (payload: Vessel): Promise<void> => {
  const response = await fetch(VESSEL_SETTINGS_URL, {
    method: "POST",
    headers: prepareAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 409) {
      throw new Error("Duplicate key error");
    }
    const error = errorData.message || response.statusText;
    throw new Error(error);
  }
};

export const deleteVessel = async (id: string): Promise<void> => {
  const response = await fetch(`${VESSEL_SETTINGS_URL}/${id}`, {
    method: "DELETE",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    const error = (await response.json()).message || response.statusText;
    throw new Error(error);
  }
};

export const getVesselById = async (id: string): Promise<VesselResponse> => {
  const response = await fetch(`${VESSEL_SETTINGS_URL}/${id}`, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
