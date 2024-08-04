import {
  GetInvoiceFeesFromPortAuthorityResponse,
  GetInvoiceTenantResponse,
  InvoicePricing,
  InvoicePricingResponse,
} from "../types";
import { prepareAuthHeaders } from "../utils/auth";
import { BACKEND_URL } from "../config";

const INVOICE_URL = `${BACKEND_URL}invoice`;

// Create a new invoice
export const createInvoice = async (payload: InvoicePricing): Promise<void> => {
  const response = await fetch(`${INVOICE_URL}/pda`, {
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

// Edit an existing invoice
export const editInvoice = async (
  id: string,
  payload: InvoicePricing
): Promise<void> => {
  console.log(payload, "pp");
  const response = await fetch(`${INVOICE_URL}/pda/${id}`, {
    method: "PUT",
    headers: prepareAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
};

// Get an invoice by ID
export const getInvoiceById = async (
  id: string
): Promise<InvoicePricingResponse> => {
  const response = await fetch(`${INVOICE_URL}/pda/${id}`, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  console.log(data, "lala");
  return data;
};

// Get an invoice fees information by tenant
export const getInvoiceFeesFromPortAuthority =
  async (): Promise<GetInvoiceFeesFromPortAuthorityResponse> => {
    const response = await fetch(`${INVOICE_URL}/fees`, {
      method: "GET",
      headers: prepareAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data, "data?");
    return data;
  };

// Get tenant information from invoice
export const getInvoiceTenant = async (): Promise<GetInvoiceTenantResponse> => {
  const response = await fetch(`${INVOICE_URL}/tenant`, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
