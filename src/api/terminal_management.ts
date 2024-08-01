import { Terminal, TerminalResponse } from "../types";
import { prepareAuthHeaders } from "../utils/auth";

import { BACKEND_URL } from "../config";
const TERMINAL_SETTINGS_URL = `${BACKEND_URL}terminal_management`;

// Get all terminals
export const getAllTerminals = async (): Promise<TerminalResponse[]> => {
  const response = await fetch(TERMINAL_SETTINGS_URL, {
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
  const terminalsData = Array.isArray(data.terminals) ? data.terminals : [];

  const terminals: TerminalResponse[] = terminalsData.map((terminal: any) => ({
    ID: terminal.ID,
    name: terminal.terminal_specifications.name,
    address: terminal.terminal_specifications.address,
    email: terminal.terminal_specifications.email,
    contact: terminal.terminal_specifications.contact,
  }));

  return terminals;
};

// Create a new terminal
export const createTerminal = async (payload: Terminal): Promise<void> => {
  console.log(payload);
  const response = await fetch(TERMINAL_SETTINGS_URL, {
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

// Update an existing terminal
export const updateTerminal = async (
  id: string,
  terminal: Terminal
): Promise<void> => {
  const response = await fetch(`${TERMINAL_SETTINGS_URL}/${id}`, {
    method: "PUT",
    headers: prepareAuthHeaders(),
    body: JSON.stringify(terminal),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
};

// Delete a terminal by ID
export const deleteTerminal = async (id: string): Promise<void> => {
  const response = await fetch(`${TERMINAL_SETTINGS_URL}/${id}`, {
    method: "DELETE",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    const error = (await response.json()).message || response.statusText;
    throw new Error(error);
  }
};

// Get a terminal by ID
export const getTerminalById = async (
  id: string
): Promise<TerminalResponse> => {
  const response = await fetch(`${TERMINAL_SETTINGS_URL}/${id}`, {
    method: "GET",
    headers: prepareAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
