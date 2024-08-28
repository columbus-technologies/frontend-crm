import { Button, message } from "antd";
import { useEffect, useState } from "react";
import {
  ArrivalDepartureInformation,
  BunkeringActivity,
  BunkerIntakeSpecifications,
  CargoOperationsActivity,
  ShipmentProduct,
  ShipmentResponse,
} from "../../types";
import { getShipmentById, updateShipment } from "../../api";
import RenderCargoOperationsActivities from "./renderDetails/renderCargoOperationsActivities";
import RenderBunkeringActivity from "./renderDetails/renderBunkeringActivity";

const RenderShipmentDetails: React.FC<{
  selectedShipment: ShipmentResponse | null;
}> = ({ selectedShipment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedShipment, setEditedShipment] = useState<ShipmentResponse | null>(
    selectedShipment
  );

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
        if (error instanceof Error) {
          message.error(error.message);
        }
      }
    }
  };

  const handleChange = (
    section: "cargo_operations" | "bunkering",
    key:
      | keyof BunkeringActivity
      | keyof CargoOperationsActivity
      | keyof BunkerIntakeSpecifications
      | keyof ArrivalDepartureInformation
      | keyof ShipmentProduct,
    value: string,
    index?: number,
    specIndex?: number // Additional index for nested bunker intake specifications
  ) => {
    // all values that come in are strings, but we need to convert
    // them to the proper types . For etc string or integer
    let convertedValue;

    if (value[value.length - 1] !== ".") {
      // Try to convert to a number if the last character is not a decimal point
      convertedValue =
        typeof value === "string" &&
        !isNaN(parseFloat(value)) &&
        isFinite(Number(value))
          ? Number(value)
          : value;
      console.log(convertedValue, "s");
    } else {
      // If the last character is a decimal point, keep the value as a string
      convertedValue = value;
    }
    if (editedShipment) {
      const updatedShipment = { ...editedShipment };
      if (section === "cargo_operations" && index !== undefined) {
        // Handle nested shipment product specifications
        if (specIndex !== undefined && typeof key === "string") {
          console.log(key, "key");
          (updatedShipment.shipment_type.cargo_operations
            .cargo_operations_activity[index].shipment_product[specIndex][
            key as keyof ShipmentProduct
          ] as string | number) = convertedValue;
        } else {
          console.log(convertedValue, "Value");
          console.log(index, "Index");
          console.log(key, "Key");

          // Ensure convertedValue is correctly typed as string or number
          (updatedShipment.shipment_type.cargo_operations
            .cargo_operations_activity[index][
            key as keyof CargoOperationsActivity
          ] as string | number) = convertedValue;
          (updatedShipment.shipment_type.cargo_operations
            .cargo_operations_activity[index].arrival_departure_information[
            key as keyof ArrivalDepartureInformation
          ] as string | number) = convertedValue;
        }
      }

      if (section === "bunkering" && index !== undefined) {
        if (specIndex !== undefined && typeof key === "string") {
          console.log(specIndex, "specIndex");

          console.log(convertedValue, "Value");
          console.log(index, "Index");
          console.log(key, "Key");
          // Handle nested bunker intake specifications
          (updatedShipment.shipment_type.bunkering.bunkering_activity[index]
            .bunker_intake_specifications[specIndex][
            key as keyof BunkerIntakeSpecifications
          ] as string | number) = convertedValue;
        } else {
          // Ensure convertedValue is correctly typed as string or number
          (updatedShipment.shipment_type.bunkering.bunkering_activity[index][
            key as keyof BunkeringActivity
          ] as string | number) = convertedValue;
        }
      }

      setEditedShipment(updatedShipment);
    }
  };

  if (!selectedShipment) return <p>No shipment selected.</p>;

  return (
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
      <div>
        {editedShipment && (
          <RenderCargoOperationsActivities
            activities={
              editedShipment.shipment_type.cargo_operations
                .cargo_operations_activity
            }
            handleChange={handleChange}
            isEditing={isEditing}
          />
        )}
        {editedShipment && (
          <RenderBunkeringActivity
            activities={
              editedShipment.shipment_type.bunkering.bunkering_activity
            }
            handleChange={handleChange}
            isEditing={isEditing}
          />
        )}
      </div>
    </>
  );
};

export default RenderShipmentDetails;
