import React from "react";
import { Modal, Form, message } from "antd";
import { createCustomer } from "../../api";
import { Customer } from "../../types";
import CustomerForm from "../forms/CustomerSettingsForm";

interface AddCustomerModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  fetchData: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  visible,
  onOk,
  onCancel,
  fetchData,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Convert the fields to appropriate types
      const payload: Customer = {
        ...values,
        contact: values.phoneCode + " " + values.contact,
      };

      console.log("Payload before sending to backend:", payload); // Debugging payload

      // Perform the API call to save the new customer
      await createCustomer(payload);

      // Refresh the table data
      fetchData();

      onOk();
      form.resetFields();
      message.success("Customer added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add customer:", error.message);
        if (error.message === "Duplicate key error") {
          message.error("Customer with this name already exists.");
        } else {
          message.error("Server error. Please try again.");
        }
      }
    }
  };

  return (
    <Modal
      title="Add Customer"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      className="custom-modal"
    >
      <CustomerForm form={form} />
    </Modal>
  );
};

export default AddCustomerModal;
