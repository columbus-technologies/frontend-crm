import React from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const quantityCodes = [
  { code: "KB", unit: "Kilo Barrels" },
  { code: "MT", unit: "Metric Tonnes" },
  // Add more quantity codes as needed
];

interface QuantityInputProps {
  form: any;
  name: number;
  fieldKey: number;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  form,
  name,
  fieldKey,
}) => {
  return (
    <Input.Group compact>
      <Form.Item
        name={[name, "shipment_product", "quantityCode"]}
        noStyle
        rules={[
          { required: true, message: "Please select the Quantity Code!" },
        ]}
      >
        <Select style={{ width: "30%" }} placeholder="Select Unit">
          {quantityCodes.map(({ code, unit }) => (
            <Option key={code} value={code}>
              {`${unit} (${code})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={[name, "shipment_product", "quantity"]}
        noStyle
        rules={[{ required: true, message: "Please input the Quantity!" }]}
      >
        <Input style={{ width: "70%" }} placeholder="Quantity" />
      </Form.Item>
    </Input.Group>
  );
};

export default QuantityInput;
