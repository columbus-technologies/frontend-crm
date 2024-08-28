import { Descriptions } from "antd";
import { CustomerResponse } from "../../types";

const renderCustomerDetails = (customerDataList: CustomerResponse[] | null) => {
  if (!customerDataList || customerDataList.length === 0) {
    return <p>No customers selected.</p>;
  }

  return customerDataList.map((customerData, index) => (
    <Descriptions
      key={index}
      bordered
      title={`Customer Details ${index + 1}`}
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
  ));
};

export default renderCustomerDetails;
