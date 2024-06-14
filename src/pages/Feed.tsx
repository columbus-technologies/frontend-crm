import React, { useEffect, useState } from "react";
import { Card, Typography, Tabs } from "antd";

const { Title } = Typography;
const { TabPane } = Tabs;

const Feed: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const renderContent = (content: string) => (
    <div>
      <p>{content}</p>
    </div>
  );

  return (
    <div className="settings-management-container">
      <Title level={2}>Feed</Title>
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

export default Feed;
