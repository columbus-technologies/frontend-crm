import { FeedEmailResponse } from "../types/feed";

import { BACKEND_URL } from "../config";

const FEED_URL = `${BACKEND_URL}feed`;

// Get feed emails by shipment ID
export const getFeedEmailsByShipmentID = async (
  id: string
): Promise<FeedEmailResponse> => {
  const response = await fetch(`${FEED_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
