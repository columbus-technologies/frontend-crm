import React, { useEffect, useState } from "react";
import { Descriptions, Button, Input, message } from "antd";
import { ShipmentResponse } from "../../types";
import { getShipmentById, updateShipment } from "../../api"; // Import the updateShipment function
import UnauthorizedModal from "../../components/modals/UnauthorizedModal";

const RenderVesselDetails: React.FC<{
  selectedShipment: ShipmentResponse | null;
}> = ({ selectedShipment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedShipment, setEditedShipment] = useState<ShipmentResponse | null>(
    selectedShipment
  );
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // This effect will trigger when selectedShipment changes
  useEffect(() => {
    setEditedShipment(selectedShipment);
  }, [selectedShipment]);

  const handleSaveClick = async () => {
    if (editedShipment && editedShipment.ID) {
      try {
        await updateShipment(editedShipment.ID, editedShipment);
        message.success("Shipment updated successfully!");
        setIsEditing(false);

        // Re-fetch updated shipment data
        const updatedShipment = await getShipmentById(editedShipment.ID);
        setEditedShipment(updatedShipment);
      } catch (error) {
        message.error("Failed to update shipment. Please try again.");
      }
    }
  };

  const handleChange = (key: string, value: string | number) => {
    if (editedShipment) {
      setEditedShipment({
        ...editedShipment,
        vessel_specifications: {
          ...editedShipment.vessel_specifications,
          [key]: value,
        },
      });
    }
  };

  if (!selectedShipment) return <p>No shipment selected.</p>;

  return (
    <>
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <Button
            type="primary"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            style={{ marginBottom: 16, marginLeft: 10 }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
        <Descriptions
          bordered
          title="Vessel Specifications"
          className="styled-descriptions"
          column={2}
        >
          <Descriptions.Item label="IMO Number">
            {isEditing ? (
              <Input
                value={editedShipment?.vessel_specifications.imo_number}
                onChange={(e) => handleChange("imo_number", e.target.value)}
              />
            ) : (
              editedShipment?.vessel_specifications.imo_number
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Call Sign">
            {isEditing ? (
              <Input
                value={editedShipment?.vessel_specifications.call_sign}
                onChange={(e) => handleChange("call_sign", e.target.value)}
              />
            ) : (
              editedShipment?.vessel_specifications.call_sign
            )}
          </Descriptions.Item>
          <Descriptions.Item label="DWT">
            {isEditing ? (
              <Input
                value={editedShipment?.vessel_specifications.sdwt}
                onChange={(e) => handleChange("sdwt", Number(e.target.value))}
              />
            ) : (
              editedShipment?.vessel_specifications.sdwt
            )}
          </Descriptions.Item>
          <Descriptions.Item label="NRT">
            {isEditing ? (
              <Input
                value={editedShipment?.vessel_specifications.nrt}
                onChange={(e) => handleChange("nrt", Number(e.target.value))}
              />
            ) : (
              editedShipment?.vessel_specifications.nrt
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Vessel Name">
            {isEditing ? (
              <Input
                value={editedShipment?.vessel_specifications.vessel_name}
                onChange={(e) => handleChange("vessel_name", e.target.value)}
              />
            ) : (
              editedShipment?.vessel_specifications.vessel_name
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Flag">
            {isEditing ? (
              <Input
                value={editedShipment?.vessel_specifications.flag}
                onChange={(e) => handleChange("flag", e.target.value)}
              />
            ) : (
              editedShipment?.vessel_specifications.flag
            )}
          </Descriptions.Item>
          <Descriptions.Item label="LOA">
            {isEditing ? (
              <Input
                value={editedShipment?.vessel_specifications.loa}
                onChange={(e) => handleChange("loa", Number(e.target.value))}
              />
            ) : (
              editedShipment?.vessel_specifications.loa
            )}
          </Descriptions.Item>
          <Descriptions.Item label="GRT">
            {isEditing ? (
              <Input
                value={editedShipment?.vessel_specifications.grt}
                onChange={(e) => handleChange("grt", Number(e.target.value))}
              />
            ) : (
              editedShipment?.vessel_specifications.grt
            )}
          </Descriptions.Item>
        </Descriptions>
      </>
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </>
  );
};

export default RenderVesselDetails;
