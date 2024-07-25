import { ShipmentResponse, CustomerResponse } from "../types";
import { getCustomerByName } from "../api";

const fetchCustomerDataByShipment = async (
  selectedShipment: ShipmentResponse
): Promise<CustomerResponse | null> => {
  const customerName =
    selectedShipment.shipment_type.bunkering?.bunkering_activity?.[0]
      ?.customer_name ||
    selectedShipment.shipment_type.cargo_operations
      ?.cargo_operations_activity?.[0]?.customer_name ||
    "";

  if (customerName) {
    try {
      const customerDataByName = await getCustomerByName(customerName);
      return customerDataByName;
    } catch (error) {
      console.error("Failed to fetch customer data", error);
      return null;
    }
  }

  return null;
};

export default fetchCustomerDataByShipment;
