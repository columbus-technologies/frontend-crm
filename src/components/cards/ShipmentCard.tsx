import React from "react";
import { Card, Button, Carousel, Tag } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined,
  UserAddOutlined,
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
import { useNavigate } from "react-router-dom";

interface ShipmentCardProps {
  shipment: ShipmentResponse;
}

const contentStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: "10px",
  color: "#000", // Change font color to black
  lineHeight: "15px",
  textAlign: "center",
  background: "#F6F7FB", // Light grayish blue background color
  overflow: "auto",
  padding: "15px",
  border: "2px solid #1777FF", // Adding a thin black border
  borderRadius: "20px", // Optional: Adding slight rounding to the corners
};

const onChange = (currentSlide: number) => {
  console.log(currentSlide, "slide");
};

const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment }) => {
  const statusColours = useStatusColours();
  const statusColour = statusColours[shipment.current_status] || "default";
  const navigate = useNavigate();

  let activities: CargoOperationsActivity[] | BunkeringActivity[] = [];

  if (shipment.shipment_type.cargo_operations.cargo_operations) {
    activities =
      shipment.shipment_type.cargo_operations.cargo_operations_activity;
  } else if (shipment.shipment_type.bunkering.bunkering) {
    activities = shipment.shipment_type.bunkering.bunkering_activity;
  }

  const viewShipment = () => {
    navigate("/feed/" + shipment.ID);
  };

  const isCargoOperations = (
    activity: any
  ): activity is CargoOperationsActivity => {
    return "activity_type" in activity;
  };

  return (
    <Card
      title={
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px", // Adjust this to control spacing
            }}
          >
            <div>
              <Tag color={statusColour}> {shipment.current_status} </Tag>
              {shipment.shipment_type.cargo_operations.cargo_operations && (
                <Tag color="blue"> Cargo Operations </Tag>
              )}
              {shipment.shipment_type.bunkering.bunkering && (
                <Tag color="green"> Bunkering </Tag>
              )}
            </div>
          </div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <ClockCircleOutlined /> {shipment.vessel_specifications.imo_number},{" "}
            {shipment.vessel_specifications.vessel_name}
          </div>
        </>
      }
      style={{
        marginBottom: "20px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", // Adding shadow to the card
        borderRadius: "8px", // Adding some border radius for better look
      }}
    >
      <div style={{ marginTop: "-10px" }}>
        <ClockCircleOutlined />
        {" ETA: "}
        {moment(shipment.ETA).format("DD-MMM-YYYY, dddd, HH:mm")} HRS
      </div>
      {shipment.shipment_details?.agent_details && (
        <>
          <div style={{ marginBottom: "10px" }}>
            <UserAddOutlined />
            {" Agent: "}
            {shipment.shipment_details.agent_details.name}{" "}
            {shipment.shipment_details.agent_details.contact}
          </div>
        </>
      )}
      <Carousel afterChange={onChange} dots={{ className: "custom-dots" }}>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index}>
              <h5 style={contentStyle}>
                <StatusTag activity={activity} />
                {isCargoOperations(activity) ? (
                  <>
                    <h2>Activity</h2>
                    {activity.shipment_product.map((product, idx) => (
                      <div key={idx}>
                        <p>
                          {activity.activity_type}{" "}
                          <SubProductTypes
                            subProductType={product.sub_product_type}
                          />{" "}
                          {product.quantity} {product.quantity_code} at{" "}
                          {activity.terminal_name}
                        </p>
                      </div>
                    ))}
                    <p>Location: {activity.anchorage_location} </p>
                    <p>Customer: {activity.customer_name} </p>
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
                  ETD: {moment(activity.etd).format("DD-MMM-YYYY, dddd, HH:mm")}{" "}
                  HRS
                </p>
              </h5>
            </div>
          ))
        ) : (
          <div>
            <h5 style={contentStyle}>
              <p>Pending Activities</p>
            </h5>
          </div>
        )}
      </Carousel>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // marginTop: "10px",
        }}
      >
        <div
          style={{
            textAlign: "right",
            marginBottom: "10px", // Adjust this to control spacing
          }}
        >
          <Button
            type="primary"
            icon={<EyeOutlined />}
            style={{ marginRight: "8px" }}
            onClick={viewShipment}
          >
            View Shipment
          </Button>
          <Button type="default" icon={<EditOutlined />}>
            Edit Shipment
          </Button>
        </div>
      </div>
      <span
        style={{
          fontSize: "12px",
          color: "#888",
        }}
      >
        Updated:{" "}
        {moment(shipment.updated_at).format("DD-MMM-YYYY, dddd, HH:mm")} HRS
      </span>
    </Card>
  );
};

export default ShipmentCard;
