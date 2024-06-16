import React from "react";
import { Form, Input } from "antd";
import ContactInput from "../common/ContactNumberCountryCodeInput";
import { validateEmail } from "../../utils/validationUtils";

interface AgentFormProps {
  form: any;
}

const AgentForm: React.FC<AgentFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the Name!" }]}
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

export default AgentForm;
