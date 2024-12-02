import React, { useState } from "react";
import {
  Button,
  Descriptions,
  Input,
  InputNumber,
  DatePicker,
  message,
} from "antd";
import dayjs from "dayjs";

interface PreArrivalDetailsProps {
  data: any;
}

const PreArrivalDetails: React.FC<PreArrivalDetailsProps> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);

  if (!editedData || !editedData.form) {
    return <p>No data available.</p>;
  }

  const { form } = editedData;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Simulate onSave function
      console.log("Saved Data:", editedData);
      message.success("Details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to save changes. Please try again.");
    }
  };

  const handleChange = (field: string, value: any) => {
    setEditedData((prevData: any) => ({
      ...prevData,
      form: {
        ...prevData.form,
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={isEditing ? handleSaveClick : handleEditClick}
          style={{ marginBottom: 16, marginLeft: 10 }}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <Descriptions
        bordered
        title="General Information"
        className="styled-descriptions"
        size="middle"
      >
        <Descriptions.Item label="Name">
          {isEditing ? (
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            form.name || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {isEditing ? (
            <DatePicker
              value={form.date ? dayjs(form.date) : null}
              onChange={(date) =>
                handleChange("date", date?.format("YYYY-MM-DD") || "")
              }
            />
          ) : (
            form.date || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Time">
          {isEditing ? (
            <Input
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          ) : (
            form.time || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Master">
          {isEditing ? (
            <Input
              value={form.master}
              onChange={(e) => handleChange("master", e.target.value)}
            />
          ) : (
            form.master || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Crew">
          {isEditing ? (
            <InputNumber
              value={form.crew}
              onChange={(value) => handleChange("crew", value)}
            />
          ) : (
            form.crew || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Owner Agent Appointed">
          {isEditing ? (
            <Input
              value={form.ownerAgentAppointed}
              onChange={(e) =>
                handleChange("ownerAgentAppointed", e.target.value)
              }
            />
          ) : (
            form.ownerAgentAppointed || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Freeboard">
          {isEditing ? (
            <InputNumber
              value={form.freeboard}
              onChange={(value) => handleChange("freeboard", value)}
            />
          ) : (
            form.freeboard || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Alongside">
          {isEditing ? (
            <Input
              value={form.alongside}
              onChange={(e) => handleChange("alongside", e.target.value)}
            />
          ) : (
            form.alongside || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Last Port">
          {isEditing ? (
            <Input
              value={form.lport}
              onChange={(e) => handleChange("lport", e.target.value)}
            />
          ) : (
            form.lport || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Next Port">
          {isEditing ? (
            <Input
              value={form.nport}
              onChange={(e) => handleChange("nport", e.target.value)}
            />
          ) : (
            form.nport || "N/A"
          )}
        </Descriptions.Item>
      </Descriptions>

      {form.Data.find((item: any) => item.terminal) && (
        <Descriptions
          bordered
          title="Terminal Details"
          size="middle"
          className="styled-descriptions"
        >
          {form.Data.find((item: any) => item.terminal).terminal.map(
            (terminal: any, index: number) => (
              <Descriptions.Item
                key={index}
                label={`Terminal ${terminal.$?.number || index + 1}`}
                span={3}
              >
                <div>
                  {isEditing ? (
                    <>
                      <p>
                        <strong>Arrival Draft:</strong>{" "}
                        <InputNumber
                          value={terminal.arrivalDraft}
                          onChange={(value) =>
                            handleChange(`Data[${index}].arrivalDraft`, value)
                          }
                        />
                      </p>
                      <p>
                        <strong>Arrival Mast Height:</strong>{" "}
                        <InputNumber
                          value={terminal.arrivalMastHeight}
                          onChange={(value) =>
                            handleChange(
                              `Data[${index}].arrivalMastHeight`,
                              value
                            )
                          }
                        />
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Arrival Draft:</strong>{" "}
                        {terminal.arrivalDraft || "N/A"}
                      </p>
                      <p>
                        <strong>Arrival Mast Height:</strong>{" "}
                        {terminal.arrivalMastHeight || "N/A"}
                      </p>
                    </>
                  )}
                </div>
              </Descriptions.Item>
            )
          )}
        </Descriptions>
      )}
      {form.Data.find((item: any) => item.cargo) && (
        <Descriptions
          bordered
          title="Cargo Details"
          size="middle"
          className="styled-descriptions"
        >
          {form.Data.find((item: any) => item.cargo).cargo.map(
            (cargo: any, index: number) => (
              <Descriptions.Item
                key={index}
                label={`Cargo ${cargo.$?.number || index + 1}`}
                span={3}
              >
                <div>
                  <p>
                    <strong>Type of Cargo:</strong> {cargo.typeofcargo || "N/A"}
                  </p>
                  <p>
                    <strong>Quantity of Cargo:</strong>{" "}
                    {cargo.quantityofcargo || "N/A"}
                  </p>
                  <p>
                    <strong>Type of Cargo (Departure):</strong>{" "}
                    {cargo.typeofcargodep || "N/A"}
                  </p>
                  <p>
                    <strong>Quantity of Cargo (Departure):</strong>{" "}
                    {cargo.quantityofcargodep || "N/A"}
                  </p>
                </div>
              </Descriptions.Item>
            )
          )}
        </Descriptions>
      )}
      {form.Data.find((item: any) => item.bunker) && (
        <Descriptions
          bordered
          title="Bunker Details"
          size="middle"
          className="styled-descriptions"
        >
          {form.Data.find((item: any) => item.bunker).bunker.map(
            (bunker: any, index: number) => (
              <Descriptions.Item
                key={index}
                label={`Bunker ${bunker.$?.number || index + 1}`}
                span={3}
              >
                <div>
                  <p>
                    <strong>Product:</strong> {bunker.bunkerprod || "N/A"}
                  </p>
                  <p>
                    <strong>Quantity Intake:</strong>{" "}
                    {bunker.quantityintake || "N/A"}
                  </p>
                  <p>
                    <strong>Bunker Size:</strong> {bunker.bunkersize || "N/A"}
                  </p>
                </div>
              </Descriptions.Item>
            )
          )}
        </Descriptions>
      )}
    </div>
  );
};

export default PreArrivalDetails;
