import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Row, Col, Tag, Carousel } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "../styles/index.css"; // Ensure the CSS file is imported

const { Title } = Typography;
import { Activity, Product, ShipmentResponse } from "../types";
import { getAllShipments } from "../api";
// interface SubProduct {
//   sub_product: string;
// }

// interface Product {
//   product: string;
//   sub_products: SubProduct[];
// }

// interface QuantityDimensions {
//   KG: number;
//   G: number;
// }

// interface ShipmentProduct {
//   products: Product[];
//   quantity: number;
//   dimensions: QuantityDimensions;
//   percentage: number;
// }

// interface ArrivalDepartureInformation {
//   arrival_displacement: number;
//   departure_displacement: number;
//   arrival_draft: number;
//   departure_draft: number;
//   arrival_mast_height: number;
//   departure_mast_height: number;
// }

// interface CustomerSpecifications {
//   customer: string;
//   company: string;
//   email: string;
//   contact: string;
// }

// interface Activity {
//   activity_type: string;
//   customer_specifications: CustomerSpecifications;
//   anchorage_location: string;
//   shipment_product: ShipmentProduct;
//   readiness: string; // Use string type for date-time fields
//   etb: string;
//   etd: string;
//   arrival_departure_information: ArrivalDepartureInformation;
// }

// interface ShipmentType {
//   cargo_operations: boolean;
//   bunkering: boolean;
//   owner_matters: boolean;
// }

// interface VesselSpecifications {
//   imo_number: number;
//   vessel_name: string;
//   call_sign: string;
//   sdwt: string;
//   nrt: string;
//   flag: string;
//   grt: string;
//   loa: string;
// }

// interface Agent {
//   name: string;
//   email: string;
//   agent_contact: string;
// }

// interface ShipmentDetails {
//   agent_details: Agent;
// }

// interface Shipment {
//   _id: string;
//   shipment_type: ShipmentType;
//   vessel_specifications: VesselSpecifications;
//   shipment_details: ShipmentDetails;
//   activity: Activity[];
//   created_at: string;
//   updated_at: string;
// }

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllShipments();
        setShipments(data);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(String(error));
        }
        console.error("There was an error!", error);
      }
    };

    fetchData(); // Initial fetch
  }, []);

  const getStatusTag = (activity: Activity) => {
    const now = moment();
    const readiness = moment(activity.readiness);
    const etb = moment(activity.etb);
    const etd = moment(activity.etd);

    if (now.isBefore(readiness)) {
      return <Tag color="blue">Planned</Tag>;
    }
    if (now.isBetween(readiness, etb)) {
      return <Tag color="orange">Activity Commenced</Tag>;
    }
    if (now.isBetween(etb, etd)) {
      return <Tag color="green">Ongoing</Tag>;
    }
    if (now.isAfter(etd)) {
      return <Tag color="red">Completed</Tag>;
    }
    return <Tag>Unknown</Tag>;
  };

  const renderProductTypes = (products: Product[]) => {
    return products.map((product, index) => (
      <div key={index}>
        <p>
          <strong>Product:</strong> {product.product}
        </p>
        {product.sub_products.map((subProduct, subIndex) => (
          <p key={subIndex} style={{ marginLeft: "20px" }}>
            <strong>Sub Product:</strong> {subProduct.sub_product}
          </p>
        ))}
      </div>
    ));
  };

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "320px", //total height
    color: "#fff",
    lineHeight: "15px", // space between sentences
    textAlign: "center",
    background: "#364d79",
    overflow: "auto",
    padding: "15px",
  };
  const onChange = (currentSlide: number) => {
    console.log(currentSlide), "slide";
  };

  // return (
  //     <Carousel afterChange={onChange}>
  //         <div>
  //             <h3 style={contentStyle}>1</h3>
  //         </div>
  //         <div>
  //             <h3 style={contentStyle}>2</h3>
  //         </div>
  //             <div>
  //             <h3 style={contentStyle}>3</h3>
  //         </div>
  //         <div>
  //             <h3 style={contentStyle}>4</h3>
  //         </div>
  //     </Carousel>
  //     )
  // };
  // export default Dashboard;

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Ongoing Shipments</Title>
      <Row gutter={16}>
        {shipments.map((shipment) => {
          console.log(
            `Shipment ${shipment.ID} has ${shipment.activity.length} activities`
          );
          return (
            <Col span={8} key={shipment.ID}>
              <Card
                title={
                  <>
                    <p>{getStatusTag(shipment.activity[0])}</p>
                    <div style={{ marginTop: "10px" }}>
                      <ClockCircleOutlined />{" "}
                      {shipment.vessel_specifications.imo_number}{" "}
                      {shipment.vessel_specifications.vessel_name}
                    </div>
                    <div style={{ marginTop: "5px" }}>
                      <span>
                        Updated: {moment(shipment.updated_at).fromNow()}
                      </span>
                    </div>
                  </>
                }
                style={{ marginBottom: "20px" }}
              >
                <p>
                  <strong>ETB:</strong>{" "}
                  {moment(shipment.activity[0].etb).format(
                    "DD-MMM-YYYY, dddd, HH:mm"
                  )}
                  HRS
                </p>
                {/* <p><strong>Anchorage Location:</strong> {shipment.activity[0].anchorage_location}</p> */}
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
                      {shipment.shipment_details.agent_details.agent_contact}
                    </p>
                  </>
                )}
                <Carousel
                  afterChange={onChange}
                  dots={{ className: "custom-dots" }}
                  // style={{ paddingBottom: '5px' }} // Add padding here
                >
                  {shipment.activity.map((activity, index) => (
                    <div>
                      <h5 style={contentStyle}>
                        <p>Activity Type: {activity.activity_type} </p>
                        <p>
                          Anchorage Location: {activity.anchorage_location}{" "}
                        </p>
                        <p>
                          Customer: {activity.customer_specifications.customer}{" "}
                        </p>
                        <p>
                          {renderProductTypes(
                            activity.shipment_product.products
                          )}{" "}
                        </p>
                        <p>
                          ETD:{" "}
                          {moment(activity.etd).format(
                            "DD-MMM-YYYY, dddd, HH:mm"
                          )}
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
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Dashboard;
