import { Descriptions } from "antd";
import { CustomerResponse } from "../../types";

const renderCustomerDetails = (customerData: CustomerResponse | null) => {
  if (!customerData) return <p>No customer selected.</p>;
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

export default renderCustomerDetails;
