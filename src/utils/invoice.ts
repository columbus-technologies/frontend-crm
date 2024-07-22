import { ShipmentResponse } from "../types";

const getPilotageFees = (
  pilotage: { max: number; min: number; value: number }[],
  selectedShipment: ShipmentResponse
): number => {
  let low = 0;
  let high = pilotage.length - 1;

  const pilotageGRTValue = selectedShipment.vessel_specifications.grt;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const currentPilotage = pilotage[mid];

    if (
      pilotageGRTValue >= currentPilotage.min &&
      pilotageGRTValue < currentPilotage.max
    ) {
      return currentPilotage.value;
    } else if (pilotageGRTValue < currentPilotage.min) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  throw new Error("Size out of range");
};

export default getPilotageFees;
