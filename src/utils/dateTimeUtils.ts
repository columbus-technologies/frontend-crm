// src/utils/dateTimeUtils.ts
import { ShipmentResponse } from "../types";

export const formatDateToLocalString = (dateString: string): string => {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getLatestETD = (selectedShipment: ShipmentResponse): Date => {
  const { shipment_type, ETA } = selectedShipment;
  console.log(shipment_type, "ETA");
  const getLatestDate = (date1: Date, date2: Date): Date => {
    return new Date(Math.max(date1.getTime(), date2.getTime()));
  };

  let latestShipmentOverallETD: Date;

  const getLastActivityETD = (activities: any[]): Date => {
    if (activities && activities.length > 0) {
      const lastActivity = activities[activities.length - 1];
      if (lastActivity.etd) {
        return new Date(lastActivity.etd);
      }
    }
    return new Date(ETA);
  };

  if (shipment_type.cargo_operations?.cargo_operations) {
    if (shipment_type.bunkering?.bunkering) {
      const latestCargoOpsETD = getLastActivityETD(
        shipment_type.cargo_operations.cargo_operations_activity
      );
      const latestBunkeringETD = getLastActivityETD(
        shipment_type.bunkering.bunkering_activity
      );
      latestShipmentOverallETD = getLatestDate(
        latestCargoOpsETD,
        latestBunkeringETD
      );
    } else {
      latestShipmentOverallETD = getLastActivityETD(
        shipment_type.cargo_operations.cargo_operations_activity
      );
    }
  } else {
    if (shipment_type.bunkering?.bunkering) {
      latestShipmentOverallETD = getLastActivityETD(
        shipment_type.bunkering.bunkering_activity
      );
    } else {
      latestShipmentOverallETD = new Date(ETA);
      latestShipmentOverallETD.setDate(latestShipmentOverallETD.getDate() + 1);
    }
  }

  return latestShipmentOverallETD;
};

export default getLatestETD;
