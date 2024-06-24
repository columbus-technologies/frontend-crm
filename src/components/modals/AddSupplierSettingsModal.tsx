import React from "react";
import { Modal, Form, message } from "antd";
import { createSupplier } from "../../api";
import { Supplier } from "../../types";
import SupplierForm from "../forms/SupplierSettingsForm";

interface AddSupplierModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  loadSuppliers: () => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({
  visible,
  onOk,
  onCancel,
  loadSuppliers,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Transform vessels to an array of strings
      const transformedValues = {
        ...values,
      };
      // const transformedValues = {
      //   ...values,
      //   vessels: values.vessels.map((v: { vessel: string }) => v.vessel),
      // };

      const payload: Supplier = {
        supplier_specifications: {
          ...transformedValues,
          contact: values.phoneCode + " " + values.contact,
        },
      };

      console.log("Form values:", payload);

      await createSupplier(payload);

      loadSuppliers();

      onOk();
      form.resetFields();
      message.success("Supplier added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add Supplier setting:", error.message);
        if (error.message === "Duplicate key error") {
          message.error("Supplier with this email already exists.");
        } else {
          message.error("Server error. Please try again.");
        }
      }
    }
  };

  return (
    <Modal
      title="Add Supplier"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      className="custom-modal"
    >
      <SupplierForm form={form} />
    </Modal>
  );
};

export default AddSupplierModal;
