import { Button, Descriptions, Input, message, DatePicker } from "antd";
import { formatDateToLocalString } from "../../utils/dateTimeUtils";
import {
  ArrivalDepartureInformation,
  BunkeringActivity,
  BunkerIntakeSpecifications,
  CargoOperationsActivity,
  ShipmentProduct,
  ShipmentResponse,
} from "../../types";
import { useEffect, useState } from "react";
import { getShipmentById, updateShipment } from "../../api";
import dayjs from "dayjs";

const renderShipmentProducts = (
  products: ShipmentProduct[],
  index: number,
  handleChange: (
    section: "cargo_operations" | "bunkering",
    key:
      | keyof BunkeringActivity
      | keyof CargoOperationsActivity
      | keyof BunkerIntakeSpecifications
      | keyof ShipmentProduct,
    value: string,
    index?: number,
    specIndex?: number // Additional index for nested bunker intake specifications
  ) => void,
  isEditing: boolean
) => {
  return (
    <Descriptions.Item label="Product Quantity">
      <div className="shipment-products">
        {products.map((product, specIndex) => (
          <div className="shipment-product" key={specIndex}>
            <div>
              Sub-Product{" "}
              {isEditing ? (
                <Input
                  value={product.sub_product_type}
                  onChange={(e) =>
                    handleChange(
                      "cargo_operations",
                      "sub_product_type",
                      e.target.value,
                      index,
                      specIndex
                    )
                  }
                />
              ) : (
                product.sub_product_type
              )}
            </div>

            <div>
              {isEditing ? (
                <>
                  <div> Approx. Qty:</div>
                  <Input
                    value={product.quantity}
                    onChange={(e) =>
                      handleChange(
                        "cargo_operations",
                        "quantity",
                        e.target.value,
                        index,
                        specIndex
                      )
                    }
                  />
                </>
              ) : (
                `Approx. Qty: ${product.quantity} ${product.quantity_code}`
              )}
            </div>
          </div>
        ))}
      </div>
    </Descriptions.Item>
  );
};

const missingInformation = "Please Indicate the Information";

const renderCargoOperationsActivities = (
  activities: CargoOperationsActivity[],
  handleChange: (
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
  ) => void,
  isEditing: boolean
) => {
  return activities.map((activity, index) => (
    <Descriptions
      key={index}
      title={`Cargo Operations Activity ${index + 1}`}
      bordered
      className="styled-descriptions"
      column={2} // Set the number of columns to 2
    >
      <Descriptions.Item label="Activity Type">
        {isEditing ? (
          <Input
            value={activity.activity_type}
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "activity_type",
                e.target.value,
                index
              )
            }
          />
        ) : (
          activity.activity_type
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Customer Name">
        {isEditing ? (
          <Input
            value={activity.customer_name}
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "customer_name",
                e.target.value,
                index
              )
            }
          />
        ) : (
          activity.customer_name
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Terminal">
        {isEditing ? (
          <Input
            value={activity.terminal_name}
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "terminal_name",
                e.target.value,
                index
              )
            }
          />
        ) : (
          activity.terminal_name
        )}
      </Descriptions.Item>
      {renderShipmentProducts(
        activity.shipment_product,
        index,
        handleChange,
        isEditing
      )}
      <Descriptions.Item label="Arrival Displacement">
        {isEditing ? (
          <Input
            value={activity.arrival_departure_information.arrival_displacement}
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "arrival_displacement",
                e.target.value,
                index
              )
            }
          />
        ) : activity.arrival_departure_information.arrival_displacement ===
          -1 ? (
          `Arrival Displacement: ${missingInformation}`
        ) : (
          `${activity.arrival_departure_information.arrival_displacement} tonnes`
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Departure Displacement">
        {isEditing ? (
          <Input
            value={
              activity.arrival_departure_information.departure_displacement
            }
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "departure_displacement",
                e.target.value,
                index
              )
            }
          />
        ) : activity.arrival_departure_information.departure_displacement ===
          -1 ? (
          `Departure Displacement: ${missingInformation}`
        ) : (
          `${activity.arrival_departure_information.departure_displacement} tonnes`
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Arrival Draft">
        {isEditing ? (
          <Input
            value={activity.arrival_departure_information.arrival_draft}
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "arrival_draft",
                e.target.value,
                index
              )
            }
          />
        ) : activity.arrival_departure_information.arrival_draft === -1 ? (
          `Arrival Draft: ${missingInformation}`
        ) : (
          `${activity.arrival_departure_information.arrival_draft} metres`
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Departure Draft">
        {isEditing ? (
          <Input
            value={activity.arrival_departure_information.departure_draft}
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "departure_draft",
                e.target.value,
                index
              )
            }
          />
        ) : activity.arrival_departure_information.departure_draft === -1 ? (
          `Departure Draft: ${missingInformation}`
        ) : (
          `${activity.arrival_departure_information.departure_draft} metres`
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Arrival Mast Height">
        {isEditing ? (
          <Input
            value={activity.arrival_departure_information.arrival_mast_height}
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "arrival_mast_height",
                e.target.value,
                index
              )
            }
          />
        ) : activity.arrival_departure_information.arrival_mast_height ===
          -1 ? (
          `Arrival Mast Height: ${missingInformation}`
        ) : (
          `${activity.arrival_departure_information.arrival_mast_height} metres`
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Departure Mast Height">
        {isEditing ? (
          <Input
            value={activity.arrival_departure_information.departure_mast_height}
            onChange={(e) =>
              handleChange(
                "cargo_operations",
                "departure_mast_height",
                e.target.value,
                index
              )
            }
          />
        ) : activity.arrival_departure_information.departure_mast_height ===
          -1 ? (
          `Departure Mast Height: ${missingInformation}`
        ) : (
          `${activity.arrival_departure_information.departure_mast_height} metres`
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Readiness">
        {isEditing ? (
          <DatePicker
            style={{ width: "100%" }}
            value={dayjs(activity.readiness)}
            onChange={(date) =>
              handleChange(
                "cargo_operations",
                "readiness",
                date.toISOString(),
                index
              )
            }
            showTime
            format="YYYY-MM-DD HH:mm" // Specify the format you want to use
          />
        ) : (
          formatDateToLocalString(activity.readiness)
        )}
      </Descriptions.Item>
      <Descriptions.Item label="ETB">
        {isEditing ? (
          <DatePicker
            style={{ width: "100%" }}
            value={dayjs(activity.etb)}
            onChange={(date) =>
              handleChange("cargo_operations", "etb", date.toISOString(), index)
            }
            showTime
            format="YYYY-MM-DD HH:mm"
          />
        ) : (
          formatDateToLocalString(activity.etb)
        )}
      </Descriptions.Item>
      <Descriptions.Item label="ETD">
        {isEditing ? (
          <DatePicker
            style={{ width: "100%" }}
            value={dayjs(activity.etd)}
            onChange={(date) =>
              handleChange("cargo_operations", "etd", date.toISOString(), index)
            }
            showTime
            format="YYYY-MM-DD HH:mm"
          />
        ) : (
          formatDateToLocalString(activity.etd)
        )}
      </Descriptions.Item>
    </Descriptions>
  ));
};

const renderBunkerIntakeSpecifications = (
  specifications: BunkerIntakeSpecifications[],
  index: number,
  handleChange: (
    section: "cargo_operations" | "bunkering",
    key:
      | keyof BunkeringActivity
      | keyof CargoOperationsActivity
      | keyof BunkerIntakeSpecifications,
    value: string,
    index?: number,
    specIndex?: number // Additional index for nested bunker intake specifications
  ) => void,
  isEditing: boolean
) => {
  return (
    <Descriptions.Item label="Product Maximum Intake and Hose Size">
      <div className="bunker-intake-specifications">
        {specifications.map((specification, specIndex) => (
          <div className="bunker-intake-specification" key={specIndex}>
            <div>
              Sub-Product:{" "}
              {isEditing ? (
                <Input
                  value={specification.sub_product_type}
                  onChange={(e) =>
                    handleChange(
                      "bunkering",
                      "sub_product_type", // key
                      e.target.value,
                      index,
                      specIndex
                    )
                  }
                />
              ) : (
                specification.sub_product_type
              )}
            </div>
            <div>
              {isEditing ? (
                <>
                  <div> Maximum Quantity Intake </div>
                  <Input
                    value={specification.maximum_quantity_intake}
                    onChange={(e) =>
                      handleChange(
                        "bunkering",
                        "maximum_quantity_intake",
                        e.target.value,
                        index,
                        specIndex
                      )
                    }
                  />
                </>
              ) : specification.maximum_quantity_intake === -1 ? (
                `Maximum Quantity Intake: ${missingInformation}`
              ) : (
                `Maximum Quantity Intake: ${specification.maximum_quantity_intake} m³/hr`
              )}
            </div>
            <div>
              {isEditing ? (
                <>
                  <div>Maximum Hose Size</div>
                  <Input
                    value={specification.maximum_hose_size}
                    onChange={(e) =>
                      handleChange(
                        "bunkering",
                        "maximum_hose_size",
                        e.target.value,
                        index,
                        specIndex
                      )
                    }
                  />
                </>
              ) : specification.maximum_hose_size === -1 ? (
                `Maximum Hose Size: ${missingInformation}`
              ) : (
                `Maximum Hose Size: ${specification.maximum_hose_size} inches`
              )}
            </div>
          </div>
        ))}
      </div>
    </Descriptions.Item>
  );
};

const renderBunkeringActivity = (
  activities: BunkeringActivity[],
  handleChange: (
    section: "cargo_operations" | "bunkering",
    key:
      | keyof BunkeringActivity
      | keyof CargoOperationsActivity
      | keyof BunkerIntakeSpecifications,

    value: string,
    index?: number,
    specIndex?: number // Additional index for nested bunker intake specifications
  ) => void,
  isEditing: boolean
) => {
  return activities.map((activity, index) => (
    <Descriptions
      key={index}
      title={`Bunkering ${index + 1}`}
      bordered
      className="styled-descriptions"
      column={2} // Set the number of columns to 2
    >
      <Descriptions.Item label="Customer">
        {isEditing ? (
          <Input
            value={activity.customer_name}
            onChange={(e) =>
              handleChange("bunkering", "customer_name", e.target.value, index)
            }
          />
        ) : (
          activity.customer_name
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Supplier">
        {isEditing ? (
          <Input
            value={activity.supplier}
            onChange={(e) =>
              handleChange("bunkering", "supplier", e.target.value, index)
            }
          />
        ) : (
          activity.supplier
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Supplier Contact">
        {isEditing ? (
          <Input
            value={activity.supplier_contact}
            onChange={(e) =>
              handleChange(
                "bunkering",
                "supplier_contact",
                e.target.value,
                index
              )
            }
          />
        ) : (
          activity.supplier_contact
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Appointed Surveyor">
        {isEditing ? (
          <Input
            value={activity.appointed_surveyor}
            onChange={(e) =>
              handleChange(
                "bunkering",
                "appointed_surveyor",
                e.target.value,
                index
              )
            }
          />
        ) : (
          activity.appointed_surveyor
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Docking">
        {isEditing ? (
          <Input
            value={activity.docking}
            onChange={(e) =>
              handleChange("bunkering", "docking", e.target.value, index)
            }
          />
        ) : (
          activity.docking
        )}
      </Descriptions.Item>
      {renderBunkerIntakeSpecifications(
        activity.bunker_intake_specifications,
        index,
        handleChange,
        isEditing
      )}

      <Descriptions.Item label="Freeboard">
        {isEditing ? (
          <Input
            value={activity.freeboard}
            onChange={(e) =>
              handleChange("bunkering", "freeboard", e.target.value, index)
            }
          />
        ) : activity.freeboard === -1 ? (
          `${missingInformation}`
        ) : (
          `${activity.freeboard} metres`
        )}
      </Descriptions.Item>

      <Descriptions.Item label="Readiness">
        {isEditing ? (
          <DatePicker
            style={{ width: "100%" }}
            value={dayjs(activity.readiness)}
            onChange={(date) =>
              handleChange("bunkering", "readiness", date.toISOString(), index)
            }
            showTime
            format="YYYY-MM-DD HH:mm" // Specify the format you want to use
          />
        ) : (
          formatDateToLocalString(activity.readiness)
        )}
      </Descriptions.Item>
      <Descriptions.Item label="ETB">
        {isEditing ? (
          <DatePicker
            style={{ width: "100%" }}
            value={dayjs(activity.etb)}
            onChange={(date) =>
              handleChange("bunkering", "etb", date.toISOString(), index)
            }
            showTime
            format="YYYY-MM-DD HH:mm"
          />
        ) : (
          formatDateToLocalString(activity.etb)
        )}
      </Descriptions.Item>
      <Descriptions.Item label="ETD">
        {isEditing ? (
          <DatePicker
            value={dayjs(activity.etd)}
            style={{ width: "100%" }}
            onChange={(date) =>
              handleChange("bunkering", "etd", date.toISOString(), index)
            }
            showTime
            format="YYYY-MM-DD HH:mm"
          />
        ) : (
          formatDateToLocalString(activity.etd)
        )}
      </Descriptions.Item>
    </Descriptions>
  ));
};

const RenderShipmentDetails: React.FC<{
  selectedShipment: ShipmentResponse | null;
}> = ({ selectedShipment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedShipment, setEditedShipment] = useState<ShipmentResponse | null>(
    selectedShipment
  );

  // const [editedBunkering, setBunkering] = useState<Bunkering>();

  // const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
  //   useState(false);

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
        console.log(editedShipment, "Edited");
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
        {editedShipment &&
          renderCargoOperationsActivities(
            editedShipment.shipment_type.cargo_operations
              .cargo_operations_activity,
            handleChange,
            isEditing
          )}
        {editedShipment &&
          renderBunkeringActivity(
            editedShipment.shipment_type.bunkering.bunkering_activity,
            handleChange,
            isEditing
          )}
      </div>
    </>
  );
};

export default RenderShipmentDetails;
