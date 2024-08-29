import { Descriptions, Input } from "antd";
import {
  ArrivalDepartureInformation,
  BunkeringActivity,
  BunkerIntakeSpecifications,
  CargoOperationsActivity,
  ShipmentProduct,
} from "../../../types";

export const renderShipmentProducts = (
  activityType: "cargo_operations" | "bunkering",
  products: ShipmentProduct[],
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
    specIndex?: number,
    type?: "shipment_product" | "bunker_intake"
  ) => void,
  isEditing: boolean,
  type?: "shipment_product" | "bunker_intake" // Add the 'type' variable declaration
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
                      activityType,
                      "sub_product_type",
                      e.target.value,
                      index,
                      specIndex,
                      type
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
                        activityType,
                        "quantity",
                        e.target.value,
                        index,
                        specIndex,
                        type
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
