import { Shipment, ShipmentResponse } from "../types";
import { prepareAuthHeaders } from "../utils/auth";

const SHIPMENTS_URL = "http://localhost:8080/shipments";
const SHIPMENT_STATUSES_URL = "http://localhost:8080/shipments/statuses";

export const getShipmentStatuses = async (): Promise<string[]> => {
  const response = await fetch(SHIPMENT_STATUSES_URL, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.shipment_statuses;
};

export const getAllShipments = async (): Promise<ShipmentResponse[]> => {
  const response = await fetch(SHIPMENTS_URL, {
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
  return data.shipments;
};

export const createShipment = async (shipment: Shipment): Promise<void> => {
  const response = await fetch(SHIPMENTS_URL, {
    method: "POST",
    headers: prepareAuthHeaders(),
    body: JSON.stringify(shipment),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Duplicate key error");
    }
    throw new Error(`Error: ${response.statusText}`);
  }
};

export const deleteShipment = async (id: string): Promise<void> => {
  const response = await fetch(`${SHIPMENTS_URL}/${id}`, {
    method: "DELETE",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    const error = (await response.json()).message || response.statusText;
    throw new Error(error);
  }
};

export const updateShipment = async (
  id: string,
  shipment: Shipment
): Promise<void> => {
  const response = await fetch(`${SHIPMENTS_URL}/${id}`, {
    method: "PUT",
    headers: prepareAuthHeaders(),
    body: JSON.stringify(shipment),
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

export const getShipmentById = async (
  id: string
): Promise<ShipmentResponse> => {
  const response = await fetch(`${SHIPMENTS_URL}/${id}`, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
