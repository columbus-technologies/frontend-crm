import { Shipment, ShipmentResponse } from "../types";

import { BACKEND_URL } from "../config";

const SHIPMENTS_URL = `${BACKEND_URL}shipments`;
const SHIPMENT_STATUSES_URL = `${BACKEND_URL}shipments/statuses`;
const SHIPMENT_STATUSES_WITH_COLOURS_URL = `${BACKEND_URL}shipments/statuses_with_colours`;

export const getShipmentStatuses = async (): Promise<string[]> => {
  const response = await fetch(SHIPMENT_STATUSES_URL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.shipment_statuses;
};

export const getShipmentStatusesWithColours = async (): Promise<
  Map<string, string>
> => {
  const response = await fetch(SHIPMENT_STATUSES_WITH_COLOURS_URL, {
    method: "GET",
    credentials: "include",
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
    credentials: "include",
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

export const createShipment = async (shipment: Shipment): Promise<any> => {
  const response = await fetch(SHIPMENTS_URL, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(shipment),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Duplicate key error");
    }
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();

  return data.data;
};

export const deleteShipment = async (id: string): Promise<void> => {
  const response = await fetch(`${SHIPMENTS_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
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
    credentials: "include",
    body: JSON.stringify(shipment),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 409) {
      throw new Error("Duplicate key error");
    }
    const error = errorData.status || response.statusText;
    throw new Error(error);
  }
};

export const getShipmentById = async (
  id: string
): Promise<ShipmentResponse> => {
  const response = await fetch(`${SHIPMENTS_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
