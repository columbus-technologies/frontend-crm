import React from "react";
import { Modal, Form, message } from "antd";
import { createVessel } from "../../api";
import { Vessel } from "../../types";
import VesselForm from "../forms/VesselSettingsForm";

interface AddVesselModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  loadVessels: () => void;
}

const AddVesselModal: React.FC<AddVesselModalProps> = ({
  visible,
  onOk,
  onCancel,
  loadVessels,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload: Vessel = {
        vessel_specifications: {
          ...values,
          imo_number: parseInt(values.imo_number, 10),
          sdwt: parseInt(values.sdwt, 10),
          nrt: parseInt(values.nrt, 10),
          grt: parseInt(values.grt, 10),
          loa: parseFloat(values.loa),
        },
      };

      console.log("Form values:", payload);

      await createVessel(payload);

      loadVessels();

      onOk();
      form.resetFields();
      message.success("Vessel added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add vessel setting:", error.message);
        if (error.message === "Duplicate key error") {
          message.error("Vessel with this IMO number already exists.");
        } else {
          message.error("Server error. Please try again.");
        }
      }
    }
  };

  return (
    <Modal
      title="Add Vessel Setting"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      className="custom-modal"
    >
      <VesselForm form={form} />
    </Modal>
  );
};

export default AddVesselModal;
