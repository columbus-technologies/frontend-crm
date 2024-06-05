import {
  Customer,
  CustomerResponse,
  Shipment,
  ShipmentResponse,
} from "../types";
import { Vessel, VesselResponse } from "../types";

const CUSTOMER_MANAGEMENT_SETTINGS_URL =
  "http://localhost:8080/customer_management";
const VESSEL_SETTINGS_URL = "http://localhost:8080/vessel_management";

const SHIPMENTS_URL = "http://localhost:8080/shipments";

export const prepareAuthHeaders = () => {
  const token = sessionStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return headers;
};

export const getAllShipments = async (): Promise<ShipmentResponse[]> => {
  const response = await fetch(SHIPMENTS_URL, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.shipments;
};

export const createShipment = async (shipment: Shipment): Promise<void> => {
  console.log("Sending payload to backend:", shipment); // Debugging payload

  const response = await fetch(SHIPMENTS_URL, {
    method: "POST",
    headers: prepareAuthHeaders(),
    body: JSON.stringify(shipment),
  });
  if (!response.ok) {
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

export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
  // const response = await fetch(VESSEL_SETTINGS_URL, {

  const response = await fetch(CUSTOMER_MANAGEMENT_SETTINGS_URL, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.customers;
};

export const createCustomer = async (customer: Customer): Promise<void> => {
  console.log("Sending payload to backend:", customer); // Debugging payload

  const response = await fetch(CUSTOMER_MANAGEMENT_SETTINGS_URL, {
    method: "POST",
    headers: prepareAuthHeaders(),
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
};

export const updateCustomer = async (
  id: string,
  customer: Customer
): Promise<void> => {
  console.log(`Updating customer ${id} with payload:`, customer); // Debugging payload
  const response = await fetch(`${CUSTOMER_MANAGEMENT_SETTINGS_URL}/${id}`, {
    method: "PUT",
    headers: prepareAuthHeaders(),
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  console.log(`Deleting customer with ID: ${id}`); // Debugging deletion
  const response = await fetch(`${CUSTOMER_MANAGEMENT_SETTINGS_URL}/${id}`, {
    method: "DELETE",
    headers: prepareAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
};

export const getCustomerById = async (
  id: string
): Promise<CustomerResponse> => {
  const response = await fetch(`${CUSTOMER_MANAGEMENT_SETTINGS_URL}/${id}`, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const fetchVessels = async (): Promise<VesselResponse[]> => {
  // const token = sessionStorage.getItem("jwtToken");

  // Prepare the headers, including the Authorization header with the token
  // const headers = {
  //   "Content-Type": "application/json",
  //   ...(token && { Authorization: `Bearer ${token}` }),
  // };

  const response = await fetch(VESSEL_SETTINGS_URL, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();

  // Transform the response to flatten the vessel_specifications
  const vessels: VesselResponse[] = data.vessels.map(
    (vessel: VesselResponse) => ({
      ID: vessel.ID,
      ...vessel.vessel_specifications,
      created_at: vessel.created_at,
      updated_at: vessel.updated_at,
    })
  );

  // console.log(data.vessels)
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
    console.log(response);
    if (response.status === 409) {
      throw new Error("Duplicate key error");
    }
    const error = errorData.message || response.statusText;
    throw new Error(error);
  }
};

export const deleteVessel = async (id: string): Promise<void> => {
  console.log("Asdsadas", id);
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
