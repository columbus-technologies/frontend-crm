import { Supplier, SupplierResponse } from "../types";

import { BACKEND_URL } from "../config";

const SUPPLIER_SETTINGS_URL = `${BACKEND_URL}supplier_management`;

export const fetchSuppliers = async (): Promise<SupplierResponse[]> => {
  const response = await fetch(SUPPLIER_SETTINGS_URL, {
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

  // Check if data and data.suppliers are not empty
  if (!data || !Array.isArray(data.suppliers) || data.suppliers.length === 0) {
    return [];
  }

  console.log("data", data);

  return data.suppliers;
};

export const createSupplier = async (payload: Supplier): Promise<void> => {
  const response = await fetch(SUPPLIER_SETTINGS_URL, {
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

// Update an existing supplier
export const updateSupplier = async (
  id: string,
  supplier: Supplier
): Promise<void> => {
  const response = await fetch(`${SUPPLIER_SETTINGS_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(supplier),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
};

export const deleteSupplier = async (id: string): Promise<void> => {
  const response = await fetch(`${SUPPLIER_SETTINGS_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = (await response.json()).message || response.statusText;
    throw new Error(error);
  }
};

export const getSupplierById = async (
  id: string
): Promise<SupplierResponse> => {
  const response = await fetch(`${SUPPLIER_SETTINGS_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
