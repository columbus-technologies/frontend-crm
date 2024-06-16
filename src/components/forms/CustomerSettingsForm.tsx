import React from "react";
import { Form, Input } from "antd";
import ContactInput from "../common/ContactNumberCountryCodeInput";
import { validateEmail } from "../../utils/validationUtils";

interface CustomerFormProps {
  form: any;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="customer"
        label="Customer"
        rules={[{ required: true, message: "Please input the Customer name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="company"
        label="Company"
        rules={[{ required: true, message: "Please input the Company!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input the Email!" },
          { validator: validateEmail },
        ]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item label="Contact">
        <ContactInput />
      </Form.Item>
    </Form>
  );
};

export default CustomerForm;
