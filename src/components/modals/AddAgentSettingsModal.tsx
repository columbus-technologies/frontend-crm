import React from "react";
import { Modal, Form, message } from "antd";
import { createAgent } from "../../api";
import { Agent } from "../../types";
import AgentForm from "../forms/AgentSettingsForm";

interface AddAgentModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  loadAgents: () => void;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({
  visible,
  onOk,
  onCancel,
  loadAgents,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload: Agent = {
        ...values,
        contact: values.phoneCode + " " + values.contact,
      };

      console.log("Form values:", payload);

      await createAgent(payload);

      loadAgents();

      onOk();
      form.resetFields();
      message.success("Agent added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add agent setting:", error.message);
        if (error.message === "Duplicate key error") {
          message.error("Agent with this email already exists.");
        } else {
          message.error("Server error. Please try again.");
        }
      }
    }
  };

  return (
    <Modal
      title="Add Agent"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      className="custom-modal"
    >
      <AgentForm form={form} />
    </Modal>
  );
};

export default AddAgentModal;
