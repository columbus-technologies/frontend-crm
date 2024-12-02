import { Descriptions, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import {
  ArrivalDepartureInformation,
  BunkeringActivity,
  BunkerIntakeSpecifications,
  CargoOperationsActivity,
  ShipmentProduct,
} from "../../../types";
import { renderBunkerIntakeSpecifications } from "./renderBunkerIntakeSpecifications";
import { formatDateToLocalString } from "../../../utils/dateTimeUtils";
import { renderShipmentProducts } from "./renderShipmentProducts";

const missingInformation = "Please Indicate the Information";

const RenderBunkeringActivity: React.FC<{
  activities: BunkeringActivity[];
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
  ) => void;
  isEditing: boolean;
}> = ({ activities, handleChange, isEditing }) => {
  return (
    <>
      {activities.map((activity, index) => (
        <Descriptions
          key={index}
          title={`Bunkering ${index + 1}`}
          bordered
          className="styled-descriptions"
          column={2}
        >
          <Descriptions.Item label="Customer">
            {activity.customer_name}
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
          {renderShipmentProducts(
            "bunkering",
            activity.shipment_product,
            index,
            handleChange,
            isEditing,
            "shipment_product"
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
          {/* <Descriptions.Item label="Readiness">
            {isEditing ? (
              <DatePicker
                style={{ width: "100%" }}
                value={dayjs(activity.readiness)}
                onChange={(date) =>
                  handleChange(
                    "bunkering",
                    "readiness",
                    date.toISOString(),
                    index
                  )
                }
                showTime
                format="YYYY-MM-DD HH:mm"
              />
            ) : (
              formatDateToLocalString(activity.readiness)
            )}
          </Descriptions.Item> */}
          {/* <Descriptions.Item label="ETB">
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
          </Descriptions.Item> */}
          <Descriptions.Item label="ETD">
            {isEditing ? (
              <DatePicker
                style={{ width: "100%" }}
                value={dayjs(activity.etd)}
                onChange={(date) =>
                  handleChange("bunkering", "etd", date.toISOString(), index)
                }
                showTime
                format="YYYY-MM-DD HH:mm"
              />
            ) : activity.etd ? (
              formatDateToLocalString(activity.etd)
            ) : (
              "Pending"
            )}
          </Descriptions.Item>
        </Descriptions>
      ))}
    </>
  );
};

export default RenderBunkeringActivity;
