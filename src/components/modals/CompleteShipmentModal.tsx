import React from "react";
import { message, Modal } from "antd";
import { updateShipment } from "../../api"; // Adjust the import path based on your project structure
import { ShipmentResponse } from "../../types";
import Enum from "../../utils/enum";

interface CompleteShipmentModalProps {
  shipmentId: string;
  selectedShipment: ShipmentResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

const CompleteShipmentModal: React.FC<CompleteShipmentModalProps> = ({
  shipmentId,
  selectedShipment,
  onSuccess,
  onCancel,
}) => {
  const handleCompleteShipment = async () => {
    try {
      if (selectedShipment) {
        selectedShipment.current_status = Enum.COMPLETED_STATUS;
      }

      console.log(selectedShipment, "selssectedShipment");
      await updateShipment(shipmentId, selectedShipment);
      message.success("Shipment completed successfully!");

      onSuccess();
    } catch (error) {
      message.error("Error completing, please try again later");
    }
  };

  Modal.confirm({
    title: "Are you sure you want to complete this shipment?",
    content: "Completing this shipment will mark it as COSP.",
    onOk: handleCompleteShipment,
    onCancel,
  });

  return null; // This component doesn't render anything directly
};

export default CompleteShipmentModal;
