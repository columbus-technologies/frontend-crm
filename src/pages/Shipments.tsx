import React, { useEffect, useState } from "react";
import { Card, Typography, Tabs } from "antd";

const { Title } = Typography;
const { TabPane } = Tabs;

const Shipments: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch("https://cat-fact.herokuapp.com/facts", requestOptions)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        setShipments(data);
      })
      .catch((error) => {
        setErrorMessage(error.toString());
        console.error("There was an error!", error);
      });
  }, []);

  const renderContent = (content: string) => (
    <div>
      <p>{content}</p>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Shipments</Title>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Feed" key="1">
              {renderContent("Feed content...")}
            </TabPane>
            <TabPane tab="Shipment Details" key="2">
              {renderContent("Shipment Details content...")}
            </TabPane>
            <TabPane tab="Vessel" key="3">
              {renderContent("Vessel content...")}
            </TabPane>
            <TabPane tab="Customer" key="4">
              {renderContent("Customer content...")}
            </TabPane>
            <TabPane tab="Audit" key="5">
              {renderContent("Audit content...")}
            </TabPane>
            <TabPane tab="Documents" key="6">
              {renderContent("Documents content...")}
            </TabPane>
            <TabPane tab="Accounting" key="7">
              {renderContent("Accounting content...")}
            </TabPane>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default Shipments;
