import { ActivityType, ActivityTypeResponse } from "../types";
import { prepareAuthHeaders } from "../utils/auth";

const CATEGORY_MANAGEMENT_ACTIVITY_TYPE_URL =
  "http://localhost:8080/category_management/activity_type";

// Get all activity types
export const getAllActivityTypes = async (): Promise<
  ActivityTypeResponse[]
> => {
  const response = await fetch(CATEGORY_MANAGEMENT_ACTIVITY_TYPE_URL, {
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
  return data.activity_types;
};

// Create a new activity type
export const createActivityType = async (
  payload: ActivityType
): Promise<void> => {
  const response = await fetch(CATEGORY_MANAGEMENT_ACTIVITY_TYPE_URL, {
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

// Delete an activity type by ID
export const deleteActivityType = async (id: string): Promise<void> => {
  const response = await fetch(
    `${CATEGORY_MANAGEMENT_ACTIVITY_TYPE_URL}/${id}`,
    {
      method: "DELETE",
      headers: prepareAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = (await response.json()).message || response.statusText;
    throw new Error(error);
  }
};

// Get an activity type by ID
export const getActivityTypeById = async (
  id: string
): Promise<ActivityTypeResponse> => {
  const response = await fetch(
    `${CATEGORY_MANAGEMENT_ACTIVITY_TYPE_URL}/${id}`,
    {
      method: "GET",
      headers: prepareAuthHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
