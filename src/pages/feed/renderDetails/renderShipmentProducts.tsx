import { Descriptions, Input } from "antd";
import {
  ArrivalDepartureInformation,
  BunkeringActivity,
  BunkerIntakeSpecifications,
  CargoOperationsActivity,
  ShipmentProduct,
} from "../../../types";

export const renderShipmentProducts = (
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
    specIndex?: number
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
