import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";
import { ShipmentResponse, CustomerResponse } from "../../types";
import fetchCustomerDataByShipment from "../../utils/customer";

interface CustomerDetailsTabProps {
  selectedShipment: ShipmentResponse | null;
}

const CustomerDetailsTab: React.FC<CustomerDetailsTabProps> = ({
  selectedShipment,
}) => {
  const [customerData, setCustomerData] = useState<CustomerResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (selectedShipment) {
        const data = await fetchCustomerDataByShipment(selectedShipment);
        setCustomerData(data);
      }
      setLoading(false);
    };

    fetchCustomerData();
  }, [selectedShipment]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!customerData) {
    return <p>No customer data available.</p>;
  }

  return (
    <Descriptions
      bordered
      title="Customer Details"
      className="styled-descriptions"
      column={2} // Set the number of columns to 2
    >
      <Descriptions.Item label="Customer Name">
        {customerData.customer}
      </Descriptions.Item>
      <Descriptions.Item label="Customer Company">
        {customerData.company}
      </Descriptions.Item>
      <Descriptions.Item label="Customer Email">
        {customerData.email}
      </Descriptions.Item>
      <Descriptions.Item label="Customer Contact">
        {customerData.contact}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default CustomerDetailsTab;
