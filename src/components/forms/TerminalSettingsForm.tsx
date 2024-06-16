import React from "react";
import { Form, Input } from "antd";
import ContactInput from "../common/ContactNumberCountryCodeInput";
import { validateEmail } from "../../utils/validationUtils";

interface TerminalFormProps {
  form: any;
}

const TerminalForm: React.FC<TerminalFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Terminal Name"
        rules={[{ required: true, message: "Please input the Name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: "Please input the Address!" }]}
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

export default TerminalForm;
