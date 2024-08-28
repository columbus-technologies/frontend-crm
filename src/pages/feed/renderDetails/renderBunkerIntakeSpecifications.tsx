import { Descriptions, Input } from "antd";
import {
  ArrivalDepartureInformation,
  BunkeringActivity,
  BunkerIntakeSpecifications,
  CargoOperationsActivity,
  ShipmentProduct,
} from "../../../types";

export const renderBunkerIntakeSpecifications = (
  specifications: BunkerIntakeSpecifications[],
  index: number,
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
    specIndex?: number
  ) => void,
  isEditing: boolean
) => {
  const missingInformation = "Please Indicate the Information";

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
                      "sub_product_type",
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
