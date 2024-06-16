import React, { useEffect } from "react";
import { Card, Button, Carousel, Tag } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { ShipmentResponse } from "../../types";
import StatusTag from "../common/StatusTag";
import ProductTypes from "../common/ProductTypes";
import { useStatusColours } from "../../context/StatusColoursContext";

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

  console.log(statusColour, "statcolor");

  return (
    <Card
      title={
        <>
          <div>
            <Tag color={statusColour}> {shipment.current_status} </Tag>
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
        {moment(shipment.ETA).format("DD-MMM-YYYY, dddd, HH:mm")}
        HRS
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
        {shipment.activity.map((activity, index) => (
          <div key={index}>
            <h5 style={contentStyle}>
              <StatusTag activity={shipment.activity[0]} />
              <p>Activity Type: {activity.activity_type} </p>
              <p>Anchorage Location: {activity.anchorage_location} </p>
              <p>Customer: {activity.customer_name} </p>
              <p>
                <ProductTypes
                  productType={activity.shipment_product.product_type}
                  subProductsType={activity.shipment_product.sub_products_type}
                />
              </p>
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
