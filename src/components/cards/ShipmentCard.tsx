import React from "react";
import { Card, Button, Carousel, Tag } from "antd";
import {
  EyeOutlined,
  // EditOutlined,
  ClockCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { GiCargoShip } from "react-icons/gi";
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
import "../../styles/ShipmentCard.css";

interface ShipmentCardProps {
  shipment: ShipmentResponse;
}

type ShipmentActivity = CargoOperationsActivity | BunkeringActivity;

const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment }) => {
  const statusColours = useStatusColours();
  const statusColour = statusColours[shipment.current_status] || "default";
  const navigate = useNavigate();

  let activities: ShipmentActivity[] = [];
  const w = window.innerWidth;
  const h = window.innerHeight;
  console.log("width:", w, "height:", h);
  activities = [
    ...(shipment.shipment_type.cargo_operations.cargo_operations_activity ||
      []),
    ...(shipment.shipment_type.bunkering.bunkering_activity || []),
  ];

  const viewShipment = () => {
    navigate("/feed/" + shipment.ID);
  };

  const onChange = (currentSlide: number) => {
    console.log(currentSlide, "slide");
  };

  const isCargoOperations = (
    activity: CargoOperationsActivity | BunkeringActivity
  ): activity is CargoOperationsActivity => {
    return "activity_type" in activity;
  };

  const initialETA = moment(shipment.initial_ETA).format(
    "DD-MMM-YYYY, dddd, HH:mm"
  );
  const updatedETA = moment(shipment.current_ETA).format(
    "DD-MMM-YYYY, dddd, HH:mm"
  );
  const sameETA = initialETA === updatedETA;

  return (
    <Card
      title={
        <>
          <div className="titleStyle">
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
          <div className="infoStyle">
            <GiCargoShip /> {shipment.vessel_specifications.imo_number},{" "}
            {shipment.vessel_specifications.vessel_name}
          </div>
        </>
      }
      className="cardStyle"
    >
      <div style={{ marginTop: "-10px" }}>
        {sameETA ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ClockCircleOutlined
              style={{ marginRight: "5px", color: "#1890ff" }}
            />
            <span>
              <strong>ETA: </strong>
              {updatedETA} HRS
            </span>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ClockCircleOutlined
                style={{ marginRight: "5px", color: "#f5222d" }} // Red color for Updated ETA
              />
              <span>
                <strong>Updated ETA: </strong>
                {updatedETA} HRS
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                color: "#888", // Grey color for Initial ETA
              }}
            >
              <ClockCircleOutlined
                style={{ marginRight: "5px", color: "#888" }} // Grey color for Initial ETA
              />
              <span>
                <strong>Initial ETA: </strong>
                {initialETA} HRS
              </span>
            </div>
          </div>
        )}
      </div>
      {shipment.shipment_details?.agent_details && (
        <div className="agentStyle">
          <UserAddOutlined />
          {" Agent: "}
          {shipment.shipment_details.agent_details.name}{" "}
          {shipment.shipment_details.agent_details.contact}
        </div>
      )}

      <Carousel
        afterChange={onChange}
        dots={activities.length > 1} // only display dots if activities length > 1
        className="custom-dots"
      >
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index}>
              <h5 className="contentStyle">
                <StatusTag activity={activity} />
                {isCargoOperations(activity) ? (
                  <>
                    <h2>Cargo Ops Activity</h2>
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
                    <h2>Bunkering Activity</h2>

                    {"bunker_intake_specifications" in activity && (
                      <div>
                        {(
                          activity as BunkeringActivity
                        ).bunker_intake_specifications?.map(
                          (spec: BunkerIntakeSpecifications, idx: number) => (
                            <p key={idx}>
                              Loading {spec.sub_product_type}{" "}
                              {/* {spec.maximum_quantity_intake} */}
                            </p>
                          )
                        )}
                      </div>
                    )}
                    <p>Supplier: {activity.supplier} </p>
                    <p>Barge Vessel: {activity.supplier_vessel} </p>
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
            <h5 className="contentStyle">
              <p>Pending Activities</p>
            </h5>
          </div>
        )}
      </Carousel>

      <div className="actionsStyle">
        <div className="buttonContainerStyle">
          <Button type="primary" icon={<EyeOutlined />} onClick={viewShipment}>
            View Shipment
          </Button>
          {/* <Button type="default" icon={<EditOutlined />}>
            Edit Shipment
          </Button> */}
        </div>
      </div>
      <span className="updatedTextStyle">
        Updated:{" "}
        {moment(shipment.updated_at).format("DD-MMM-YYYY, dddd, HH:mm")} HRS
      </span>
    </Card>
  );
};

export default ShipmentCard;
