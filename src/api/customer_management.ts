import { Customer, CustomerResponse } from "../types";
import { prepareAuthHeaders } from "../utils/auth";

const CUSTOMER_MANAGEMENT_SETTINGS_URL =
  "http://localhost:8080/customer_management";

export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
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
