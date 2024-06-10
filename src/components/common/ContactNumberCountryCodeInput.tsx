// src/util/ContactInput.tsx
import React from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const countryCodes = [
  { code: "+65", country: "Singapore" },
  { code: "+60", country: "Malaysia" },
  { code: "+1", country: "United States" },
  { code: "+44", country: "United Kingdom" },
  { code: "+91", country: "India" },
  // Add more country codes as needed
];

const ContactInput: React.FC = () => {
  return (
    <Input.Group compact>
      <Form.Item
        name="phoneCode"
        noStyle
        rules={[{ required: true, message: "Please select the Phone Code!" }]}
      >
        <Select style={{ width: "30%" }} placeholder="Select Country">
          {countryCodes.map(({ code, country }) => (
            <Option key={code} value={code}>
              {`${country} (${code})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="contact"
        noStyle
        rules={[{ required: true, message: "Please input the Contact!" }]}
      >
        <Input style={{ width: "70%" }} />
      </Form.Item>
    </Input.Group>
  );
};

export default ContactInput;
