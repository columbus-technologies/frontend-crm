import { Customer, CustomerResponse } from "../types";

const CUSTOMER_MANAGEMENT_SETTINGS_URL =
  "http://localhost:8080/customer_management";

export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
  const response = await fetch(CUSTOMER_MANAGEMENT_SETTINGS_URL);
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
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
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
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
};

export const getCustomerById = async (
  id: string
): Promise<CustomerResponse> => {
  const response = await fetch(`${CUSTOMER_MANAGEMENT_SETTINGS_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

// src/api/index.ts
import { Vessel, VesselResponse } from "../types";

const VESSEL_SETTINGS_URL = "http://localhost:8080/vessel_management";

export const fetchVessels = async (): Promise<VesselResponse[]> => {
  const response = await fetch(VESSEL_SETTINGS_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = (await response.json()).message || response.statusText;
    throw new Error(error);
  }

  const data = await response.json();

  // Transform the response to flatten the vessel_specifications
  const vessels: VesselResponse[] = data.vessels.map(
    (vessel: VesselResponse) => ({
      // _id: vessel.ID,
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
    headers: { "Content-Type": "application/json" },
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
  const response = await fetch(`${VESSEL_SETTINGS_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = (await response.json()).message || response.statusText;
    throw new Error(error);
  }
};
