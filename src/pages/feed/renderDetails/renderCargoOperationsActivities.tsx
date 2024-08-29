import { Descriptions, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import {
  ArrivalDepartureInformation,
  BunkeringActivity,
  BunkerIntakeSpecifications,
  CargoOperationsActivity,
  ShipmentProduct,
} from "../../../types";
import { renderShipmentProducts } from "./renderShipmentProducts";
import { formatDateToLocalString } from "../../../utils/dateTimeUtils";

const missingInformation = "Please Indicate the Information";

const RenderCargoOperationsActivities: React.FC<{
  activities: CargoOperationsActivity[];
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
          title={`Cargo Operations Activity ${index + 1}`}
          bordered
          className="styled-descriptions"
          column={2}
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
            {activity.customer_name}
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
            "cargo_operations",
            activity.shipment_product,
            index,
            handleChange,
            isEditing
          )}
          <Descriptions.Item label="Arrival Displacement">
            {isEditing ? (
              <Input
                value={
                  activity.arrival_departure_information.arrival_displacement
                }
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
            ) : activity.arrival_departure_information
                .departure_displacement === -1 ? (
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
            ) : activity.arrival_departure_information.departure_draft ===
              -1 ? (
              `Departure Draft: ${missingInformation}`
            ) : (
              `${activity.arrival_departure_information.departure_draft} metres`
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Arrival Mast Height">
            {isEditing ? (
              <Input
                value={
                  activity.arrival_departure_information.arrival_mast_height
                }
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
                value={
                  activity.arrival_departure_information.departure_mast_height
                }
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
                format="YYYY-MM-DD HH:mm"
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
                  handleChange(
                    "cargo_operations",
                    "etb",
                    date.toISOString(),
                    index
                  )
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
                  handleChange(
                    "cargo_operations",
                    "etd",
                    date.toISOString(),
                    index
                  )
                }
                showTime
                format="YYYY-MM-DD HH:mm"
              />
            ) : (
              formatDateToLocalString(activity.etd)
            )}
          </Descriptions.Item>
        </Descriptions>
      ))}
    </>
  );
};

export default RenderCargoOperationsActivities;
