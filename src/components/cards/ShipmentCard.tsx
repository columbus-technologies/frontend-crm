import React from "react";
import { Card, Button, Carousel, Tag } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  ShipmentResponse,
  CargoOperationsActivity,
  BunkeringActivity,
  BunkerIntakeSpecifications,
} from "../../types";
import StatusTag from "../common/StatusTag";
import { useStatusColours } from "../../context/StatusColoursContext";
import SubProductTypes from "../common/SubProductTypes";

interface ShipmentCardProps {
  shipment: ShipmentResponse;
}

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "320px",
  color: "#fff",
  lineHeight: "15px",
  textAlign: "center",
  background: "#364d79",
  overflow: "auto",
  padding: "15px",
};

const onChange = (currentSlide: number) => {
  console.log(currentSlide, "slide");
};

const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment }) => {
  const statusColours = useStatusColours();
  const statusColour = statusColours[shipment.current_status] || "default";

  let activities: CargoOperationsActivity[] | BunkeringActivity[] = [];

  if (shipment.shipment_type.cargo_operations.cargo_operations) {
    activities =
      shipment.shipment_type.cargo_operations.cargo_operations_activity;
  } else if (shipment.shipment_type.bunkering.bunkering) {
    activities = shipment.shipment_type.bunkering.bunkering_activity;
  }

  const isCargoOperations = (
    activity: any
  ): activity is CargoOperationsActivity => {
    return "activity_type" in activity;
  };

  return (
    <Card
      title={
        <>
          <div>
            <Tag color={statusColour}> {shipment.current_status} </Tag>
            {shipment.shipment_type.cargo_operations.cargo_operations && (
              <Tag color="blue"> Cargo Operations </Tag>
            )}
            {shipment.shipment_type.bunkering.bunkering && (
              <Tag color="green"> Bunkering </Tag>
            )}
          </div>
          <div style={{ marginTop: "10px" }}>
            <ClockCircleOutlined /> {shipment.vessel_specifications.imo_number}{" "}
            {shipment.vessel_specifications.vessel_name}
          </div>
          <div
            style={{
              marginTop: "5px",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            <span>
              Updated:{" "}
              {moment(shipment.updated_at).format("DD-MMM-YYYY, dddd, HH:mm")}{" "}
              HRS
            </span>
          </div>
        </>
      }
      style={{ marginBottom: "20px" }}
    >
      <p>
        <strong>ETA:</strong>{" "}
        {moment(shipment.ETA).format("DD-MMM-YYYY, dddd, HH:mm")} HRS
      </p>
      {shipment.shipment_details?.agent_details && (
        <>
          <p>
            <strong>Agent Name:</strong>{" "}
            {shipment.shipment_details.agent_details.name}
          </p>
          <p>
            <strong>Agent Email:</strong>{" "}
            {shipment.shipment_details.agent_details.email}
          </p>
          <p>
            <strong>Agent Contact:</strong>{" "}
            {shipment.shipment_details.agent_details.contact}
          </p>
        </>
      )}
      <Carousel afterChange={onChange} dots={{ className: "custom-dots" }}>
        {activities.map((activity, index) => (
          <div key={index}>
            <h5 style={contentStyle}>
              <StatusTag activity={activity} />
              {isCargoOperations(activity) ? (
                <>
                  <p>Activity Type: {activity.activity_type} </p>
                  <p>Anchorage Location: {activity.anchorage_location} </p>
                  <p>Customer: {activity.customer_name} </p>
                  {activity.shipment_product.map((product, idx) => (
                    <div key={idx}>
                      <p>
                        <SubProductTypes
                          subProductType={product.sub_product_type}
                        />
                      </p>
                      <p>Quantity Code: {product.dimensions}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Percentage: {product.percentage}</p>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p>Supplier: {activity.supplier} </p>
                  <p>Supplier Contact: {activity.supplier_contact} </p>
                  <p>Appointed Surveyor: {activity.appointed_surveyor} </p>
                  {"bunker_intake_specifications" in activity && (
                    <div>
                      {(
                        activity as BunkeringActivity
                      ).bunker_intake_specifications?.map(
                        (spec: BunkerIntakeSpecifications, idx: number) => (
                          <p key={idx}>
                            <strong>Bunker Intake {idx + 1}:</strong>
                            <br />
                            Product Type: {spec.sub_product_type}
                            <br />
                            Sub Product Type: {spec.sub_product_type}
                          </p>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
              <p>
                ETD: {moment(activity.etd).format("DD-MMM-YYYY, dddd, HH:mm")}
                HRS
              </p>
            </h5>
          </div>
        ))}
      </Carousel>
      <div style={{ textAlign: "right" }}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          style={{ marginRight: "8px" }}
        >
          View Shipment
        </Button>
        <Button type="default" icon={<EditOutlined />}>
          Edit Shipment
        </Button>
      </div>
    </Card>
  );
};

export default ShipmentCard;
