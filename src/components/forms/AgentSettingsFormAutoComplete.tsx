import React, { useEffect, useState } from "react";
import { AutoComplete, Form, Input } from "antd";
import ContactInput from "../common/ContactNumberCountryCodeInput";
import { getAllAgents } from "../../api"; // Add this import to fetch vessel data

interface AgentFormProps {
  form: any;
}

const AgentFormAutoComplete: React.FC<AgentFormProps> = ({ form }) => {
  const [agentOptions, setAgentOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllAgents = async () => {
      try {
        const agents = await getAllAgents();
        setAgentOptions(agents);
      } catch (error) {
        console.error("Failed to fetch vessels:", error);
      }
    };

    fetchAllAgents();
  }, []);

  const handleAgentSelect = (value: string, option: any) => {
    const selectedAgent = agentOptions.find((agent) => agent.name === value);
    if (selectedAgent) {
      // Use regex to split the contact string
      const [phoneCode, ...contactParts] = selectedAgent.contact.split(" ");
      const contact = contactParts.join(" ");

      form.setFieldsValue({
        name: selectedAgent.name,
        email: selectedAgent.email,
        phoneCode: phoneCode,
        contact: contact,
      });
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the Name!" }]}
      >
        <AutoComplete
          options={agentOptions.map((agent) => ({
            value: agent.name,
          }))}
          onSelect={handleAgentSelect}
          placeholder="Select Agent"
        />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please input the Email!" }]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item label="Contact">
        <ContactInput />
      </Form.Item>
    </Form>
  );
};

export default AgentFormAutoComplete;
