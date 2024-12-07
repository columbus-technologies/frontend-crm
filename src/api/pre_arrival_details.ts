import { PreArrivalDetails, PreArrivalDetailsResponse } from "../types";

import { BACKEND_URL } from "../config";

const PRE_ARRIVAL_DETAILS_SETTINGS_URL = `${BACKEND_URL}pre_arrival_details`;

export const fetchPreArrivalDetails = async (
  id: string
): Promise<PreArrivalDetailsResponse[]> => {
  const response = await fetch(`${PRE_ARRIVAL_DETAILS_SETTINGS_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    if (response.status === 500) return [];
    throw new Error(response.statusText);
  }

  const data = await response.json();

  console.log("data", data);

  return data;
};

export const createPreArrivalDetails = async (
  payload: PreArrivalDetails
): Promise<void> => {
  const response = await fetch(PRE_ARRIVAL_DETAILS_SETTINGS_URL, {
    method: "POST",
    credentials: "include",
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
