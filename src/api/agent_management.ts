import { Agent, AgentResponse } from "../types";
import { prepareAuthHeaders } from "../utils/auth";
import { prodEnv } from "../utils/environment";

const AGENT_SETTINGS_URL = prodEnv + "agent_management";

// const AGENT_SETTINGS_URL = "http://localhost:8080/agent_management";

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
    if (response.status === 409) {
      throw new Error("Duplicate key error");
    }
    const error = errorData.message || response.statusText;
    throw new Error(error);
  }
};

// Delete an agent by ID
export const deleteAgent = async (id: string): Promise<void> => {
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
