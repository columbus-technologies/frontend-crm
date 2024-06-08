import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Row, Col, Tag, Carousel, Modal } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "../styles/index.css"; // Ensure the CSS file is imported
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
import { Activity, Product, ShipmentResponse } from "../types";
import { getAllShipments } from "../api";

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllShipments();
        console.log(data);
        setShipments(data);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
            setIsUnauthorizedModalVisible(true);
          }
          setErrorMessage(error.message);
        } else {
          setErrorMessage(String(error));
        }
        console.error("There was an error!", error);
      }
    };

    fetchData(); // Initial fetch
  }, []);

  const handleUnauthorizedModalOk = () => {
    setIsUnauthorizedModalVisible(false);
    navigate("/login");
  };

  const getStatusTag = (activity: Activity) => {
    const now = moment();
    const readiness = activity.readiness ? moment(activity.readiness) : null;
    const etb = activity.etb ? moment(activity.etb) : null;
    const etd = activity.etd ? moment(activity.etd) : null;

    if (!readiness) {
      return <Tag color="red">No Readiness</Tag>;
    }
    if (now.isBefore(readiness)) {
      return <Tag color="blue">Planned</Tag>;
    }
    if (now.isBetween(readiness, etb)) {
      return <Tag color="brown">Activity Commenced</Tag>;
    }
    if (now.isBetween(etb, etd)) {
      return <Tag color="yellow">Ongoing</Tag>;
    }
    if (now.isAfter(etd)) {
      return <Tag color="green">Completed</Tag>;
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
      <Modal
        title="Credentials Expired"
        visible={isUnauthorizedModalVisible}
        maskClosable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleUnauthorizedModalOk}>
            OK
          </Button>,
        ]}
      >
        <p>Credentials Expired. Please login again.</p>
      </Modal>
      <Title level={2}>Ongoing Shipments</Title>
      {shipments && shipments.length > 0 ? (
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
                      <div
                        style={{
                          marginTop: "5px",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        <span>
                          Updated:{" "}
                          {moment(shipment.updated_at).format(
                            "DD-MMM-YYYY, dddd, HH:mm"
                          )}{" "}
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
                            Customer:{" "}
                            {activity.customer_specifications.customer}{" "}
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
      ) : (
        <p>No ongoing shipments available.</p>
      )}
    </div>
  );
};

export default Dashboard;
