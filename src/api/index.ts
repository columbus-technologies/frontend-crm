import {
  Agent,
  AgentResponse,
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
const AGENT_SETTINGS_URL = "http://localhost:8080/agent_management";

const SHIPMENT_STATUSES_URL = "http://localhost:8080/shipments/statuses";

export const prepareAuthHeaders = () => {
  const token = sessionStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return headers;
};

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
  console.log("Sending payload to backend:", shipment); // Debugging payload

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

export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
  // const response = await fetch(VESSEL_SETTINGS_URL, {

  const response = await fetch(CUSTOMER_MANAGEMENT_SETTINGS_URL, {
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
    if (response.status === 409) {
      throw new Error("Duplicate key error");
    }
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
  // Ensuring the correct data structure in the fetchVessels function is crucial because the Table component
  // from Ant Design expects the data in a specific format to correctly map the dataIndex values in the columns
  // to the corresponding fields in the data.

  // If the API response is nested, you need
  // to transform it to match the flat structure expected by the Table component:
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

// Get all agents
export const getAllAgents = async (): Promise<AgentResponse[]> => {
  const response = await fetch(AGENT_SETTINGS_URL, {
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

  return data.agents;
};

// Create a new agent
export const createAgent = async (payload: Agent): Promise<void> => {
  const response = await fetch(AGENT_SETTINGS_URL, {
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

// Delete an agent by ID
export const deleteAgent = async (id: string): Promise<void> => {
  console.log("Deleting agent with ID:", id);
  const response = await fetch(`${AGENT_SETTINGS_URL}/${id}`, {
    method: "DELETE",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    const error = (await response.json()).message || response.statusText;
    throw new Error(error);
  }
};

// Get an agent by ID
export const getAgentById = async (id: string): Promise<AgentResponse> => {
  const response = await fetch(`${AGENT_SETTINGS_URL}/${id}`, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
