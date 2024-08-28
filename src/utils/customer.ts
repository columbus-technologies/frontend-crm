import { ShipmentResponse, CustomerResponse } from "../types";
import { getCustomerByName } from "../api";

const fetchCustomerDataByShipment = async (
  selectedShipment: ShipmentResponse
): Promise<CustomerResponse[] | null> => {
  const customerNames: string[] = [];

  // Collect customer names from the shipment's bunkering activity
  const bunkeringCustomerNames =
    selectedShipment.shipment_type.bunkering?.bunkering_activity?.map(
      (activity) => activity.customer_name
    );
  if (bunkeringCustomerNames) {
    customerNames.push(...bunkeringCustomerNames);
  }

  // Collect customer names from the shipment's cargo operations activity
  const cargoOperationsCustomerNames =
    selectedShipment.shipment_type.cargo_operations?.cargo_operations_activity?.map(
      (activity) => activity.customer_name
    );
  if (cargoOperationsCustomerNames) {
    customerNames.push(...cargoOperationsCustomerNames);
  }

  if (customerNames.length > 0) {
    try {
      // Fetch customer data for all customer names concurrently
      const customerDataPromises = customerNames.map((name) =>
        getCustomerByName(name)
      );

      const customerDataList = await Promise.all(customerDataPromises);
      return customerDataList;
    } catch (error) {
      console.error("Failed to fetch customer data", error);
      return null;
    }
  }

  return null;
};

export default fetchCustomerDataByShipment;
