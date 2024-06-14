import React from "react";
import { Modal, Form, message } from "antd";
import { createTerminal } from "../../api";
import { Terminal } from "../../types";
import TerminalForm from "../forms/TerminalSettingsForm";

interface AddTerminalModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  loadTerminals: () => void;
}

const AddTerminalModal: React.FC<AddTerminalModalProps> = ({
  visible,
  onOk,
  onCancel,
  loadTerminals,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload: Terminal = {
        terminal_specifications: {
          ...values,
          contact: values.phoneCode + " " + values.contact,
        },
      };

      console.log("Form values:", payload);

      await createTerminal(payload);

      loadTerminals();

      onOk();
      form.resetFields();
      message.success("Terminal added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add Terminal setting:", error.message);
        if (error.message === "Duplicate key error") {
          message.error("Terminal with this email already exists.");
        } else {
          message.error("Server error. Please try again.");
        }
      }
    }
  };

  return (
    <Modal
      title="Add Terminal"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      className="custom-modal"
    >
      <TerminalForm form={form} />
    </Modal>
  );
};

export default AddTerminalModal;
