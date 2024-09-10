import { Checklist, ChecklistResponse } from "../types";

import { BACKEND_URL } from "../config";
const CHECKLIST_URL = `${BACKEND_URL}checklist`;

export const createEmptyDefaultChecklistUponInitialize = async (
  checklist: Checklist
): Promise<void> => {
  const response = await fetch(CHECKLIST_URL, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(checklist),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Duplicate key error");
    }
    throw new Error(`Error: ${response.statusText}`);
  }
};

export const getAllChecklist = async (): Promise<ChecklistResponse[]> => {
  const response = await fetch(CHECKLIST_URL, {
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
  return data.checklists;
};

export const getChecklistById = async (
  id: string
): Promise<ChecklistResponse> => {
  const response = await fetch(`${CHECKLIST_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const updateChecklist = async (
  id: string,
  checklist: Checklist
): Promise<void> => {
  const response = await fetch(`${CHECKLIST_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(checklist),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
};
