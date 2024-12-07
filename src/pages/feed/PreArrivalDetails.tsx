import React, { useEffect, useState } from "react";
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
  const [processedData, setProcessedData] = useState<any>(null);

  useEffect(() => {
    // Process the data to ensure consistent structure
    const transformData = (rawData: any) => {
      // Check if the data is wrapped inside a "form" key
      const isFormWrapped = !!rawData.form;
      const source = isFormWrapped ? rawData.form : rawData;

      // Extract pre-arrival terminals
      const terminals =
        source.pre_arrival_terminals || // Second format
        source.Data?.filter((item: any) => item.terminal)?.flatMap(
          (item: any) =>
            item.terminal.map((terminal: any) => ({
              number: terminal["$"]?.number || terminal.number,
              ...terminal,
            }))
        ) ||
        [];

      // Extract cargo arrivals
      const cargosArrival =
        source.cargos_arrival || // Second format
        source.Data?.filter((item: any) => item.cargo_arrival)?.flatMap(
          (item: any) =>
            item.cargo_arrival.map((cargo: any) => ({
              number: cargo["$"]?.number || cargo.number,
              ...cargo,
            }))
        ) ||
        [];

      // Extract cargo departures
      const cargosDeparture =
        source.cargos_departure || // Second format
        source.Data?.filter((item: any) => item.cargo_departure)?.flatMap(
          (item: any) =>
            item.cargo_departure.map((cargo: any) => ({
              number: cargo["$"]?.number || cargo.number,
              ...cargo,
            }))
        ) ||
        [];

      // Extract bunkers
      const bunkers =
        source.bunkers || // Second format
        source.Data?.filter((item: any) => item.bunker)?.flatMap((item: any) =>
          item.bunker.map((bunker: any) => ({
            number: bunker["$"]?.number || bunker.number,
            ...bunker,
          }))
        ) ||
        [];

      return {
        ...source,
        pre_arrival_terminals: terminals,
        cargos_arrival: cargosArrival,
        cargos_departure: cargosDeparture,
        bunkers: bunkers,
      };
    };

    const transformedData = transformData(data);
    setProcessedData(transformedData);
    console.log("Processed Data:", transformedData);
  }, [data]);

  if (!processedData) {
    return <p>No data available.</p>;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      console.log("Saved Data:", processedData);
      message.success("Details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to save changes. Please try again.");
    }
  };

  const handleChange = (field: string, value: any) => {
    setProcessedData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const {
    name,
    date,
    time,
    master,
    crew,
    ownerAgentAppointed,
    freeboard,
    alongside,
    lport,
    nport,
    pre_arrival_terminals = [],
    cargos_arrival = [],
    cargos_departure = [],
    bunkers = [],
  } = processedData;

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

      {/* General Information */}
      <Descriptions
        bordered
        title="General Information"
        className="styled-descriptions"
        size="middle"
      >
        <Descriptions.Item label="Name">
          {isEditing ? (
            <Input
              value={name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            name || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="ETA Date">
          {isEditing ? (
            <DatePicker
              value={date ? dayjs(date) : null}
              onChange={(date) =>
                handleChange("date", date?.format("YYYY-MM-DD") || "")
              }
            />
          ) : (
            date || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="ETA Time">
          {isEditing ? (
            <Input
              value={time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          ) : (
            time || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Master">
          {isEditing ? (
            <Input
              value={master}
              onChange={(e) => handleChange("master", e.target.value)}
            />
          ) : (
            master || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Crew">
          {isEditing ? (
            <InputNumber
              value={crew}
              onChange={(value) => handleChange("crew", value)}
            />
          ) : (
            crew || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Owner Agent Appointed">
          {isEditing ? (
            <Input
              value={ownerAgentAppointed}
              onChange={(e) =>
                handleChange("ownerAgentAppointed", e.target.value)
              }
            />
          ) : (
            ownerAgentAppointed || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Freeboard">
          {isEditing ? (
            <InputNumber
              value={freeboard}
              onChange={(value) => handleChange("freeboard", value)}
            />
          ) : (
            freeboard || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Alongside">
          {isEditing ? (
            <Input
              value={alongside === "null" ? "" : alongside} // Handle "null" as an empty string in edit mode
              onChange={(e) => handleChange("alongside", e.target.value)}
            />
          ) : alongside && alongside !== "null" ? (
            alongside
          ) : (
            "N/A"
          ) // Handle "null" as "N/A" in view mode
          }
        </Descriptions.Item>
        <Descriptions.Item label="Last Port">
          {isEditing ? (
            <Input
              value={lport}
              onChange={(e) => handleChange("lport", e.target.value)}
            />
          ) : (
            lport || "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Next Port">
          {isEditing ? (
            <Input
              value={nport}
              onChange={(e) => handleChange("nport", e.target.value)}
            />
          ) : (
            nport || "N/A"
          )}
        </Descriptions.Item>
      </Descriptions>

      {pre_arrival_terminals.length > 0 && (
        <Descriptions
          bordered
          title="Terminal Details"
          size="middle"
          className="styled-descriptions"
        >
          {pre_arrival_terminals.map((terminal: any, index: number) => (
            <Descriptions.Item
              key={index}
              label={`Terminal ${terminal.number || index + 1}`}
              span={3}
            >
              <div>
                {isEditing ? (
                  <>
                    <p>
                      <strong>Terminal Name:</strong>{" "}
                      <Input
                        value={terminal.terminalname || ""}
                        onChange={(e) =>
                          handleChange(
                            `pre_arrival_terminals[${index}].terminalname`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Arrival Draft:</strong>{" "}
                      <Input
                        value={terminal.arrivalDraft || ""}
                        onChange={(e) =>
                          handleChange(
                            `pre_arrival_terminals[${index}].arrivalDraft`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Arrival Mast Height:</strong>{" "}
                      <Input
                        value={terminal.arrivalMastHeight || ""}
                        onChange={(e) =>
                          handleChange(
                            `pre_arrival_terminals[${index}].arrivalMastHeight`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Arrival Displacement:</strong>{" "}
                      <Input
                        value={terminal.arrivalDisplacement || ""}
                        onChange={(e) =>
                          handleChange(
                            `pre_arrival_terminals[${index}].arrivalDisplacement`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Departure Draft:</strong>{" "}
                      <Input
                        value={terminal.departureDraft || ""}
                        onChange={(e) =>
                          handleChange(
                            `pre_arrival_terminals[${index}].departureDraft`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Departure Mast Height:</strong>{" "}
                      <Input
                        value={terminal.departureMastHeight || ""}
                        onChange={(e) =>
                          handleChange(
                            `pre_arrival_terminals[${index}].departureMastHeight`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Departure Displacement:</strong>{" "}
                      <Input
                        value={terminal.departureDisplacement || ""}
                        onChange={(e) =>
                          handleChange(
                            `pre_arrival_terminals[${index}].departureDisplacement`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Terminal Name:</strong>{" "}
                      {terminal.terminalname || "N/A"}
                    </p>
                    <p>
                      <strong>Arrival Draft:</strong>{" "}
                      {terminal.arrivalDraft || "N/A"}
                    </p>
                    <p>
                      <strong>Arrival Mast Height:</strong>{" "}
                      {terminal.arrivalMastHeight || "N/A"}
                    </p>
                    <p>
                      <strong>Arrival Displacement:</strong>{" "}
                      {terminal.arrivalDisplacement || "N/A"}
                    </p>
                    <p>
                      <strong>Departure Draft:</strong>{" "}
                      {terminal.departureDraft || "N/A"}
                    </p>
                    <p>
                      <strong>Departure Mast Height:</strong>{" "}
                      {terminal.departureMastHeight || "N/A"}
                    </p>
                    <p>
                      <strong>Departure Displacement:</strong>{" "}
                      {terminal.departureDisplacement || "N/A"}
                    </p>
                  </>
                )}
              </div>
            </Descriptions.Item>
          ))}
        </Descriptions>
      )}

      {/* Cargo Arrivals */}
      {cargos_arrival.length > 0 && (
        <Descriptions
          bordered
          title="Cargo Arrivals"
          size="middle"
          className="styled-descriptions"
        >
          {cargos_arrival.map((cargo: any, index: number) => (
            <Descriptions.Item
              key={index}
              label={`Cargo Arrival ${cargo.number || index + 1}`}
              span={3}
            >
              <div>
                {isEditing ? (
                  <>
                    <p>
                      <strong>Type of Cargo:</strong>{" "}
                      <Input
                        value={cargo.typeofcargo || ""}
                        onChange={(e) =>
                          handleChange(
                            `cargos_arrival[${index}].typeofcargo`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Quantity of Cargo:</strong>{" "}
                      <InputNumber
                        value={cargo.quantityofcargo || ""}
                        onChange={(value) =>
                          handleChange(
                            `cargos_arrival[${index}].quantityofcargo`,
                            value
                          )
                        }
                      />
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Type of Cargo:</strong>{" "}
                      {cargo.typeofcargo || "N/A"}
                    </p>
                    <p>
                      <strong>Quantity of Cargo:</strong>{" "}
                      {cargo.quantityofcargo || "N/A"}
                    </p>
                  </>
                )}
              </div>
            </Descriptions.Item>
          ))}
        </Descriptions>
      )}

      {/* Cargo Departures */}
      {cargos_departure.length > 0 && (
        <Descriptions
          bordered
          title="Cargo Departures"
          size="middle"
          className="styled-descriptions"
        >
          {cargos_departure.map((cargo: any, index: number) => (
            <Descriptions.Item
              key={index}
              label={`Cargo Departure ${cargo.number || index + 1}`}
              span={3}
            >
              <div>
                {isEditing ? (
                  <>
                    <p>
                      <strong>Type of Cargo:</strong>{" "}
                      <Input
                        value={cargo.typeofcargodep || ""}
                        onChange={(e) =>
                          handleChange(
                            `cargos_departure[${index}].typeofcargodep`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Quantity of Cargo:</strong>{" "}
                      <InputNumber
                        value={cargo.quantityofcargodep || ""}
                        onChange={(value) =>
                          handleChange(
                            `cargos_departure[${index}].quantityofcargodep`,
                            value
                          )
                        }
                      />
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Type of Cargo:</strong>{" "}
                      {cargo.typeofcargodep || "N/A"}
                    </p>
                    <p>
                      <strong>Quantity of Cargo:</strong>{" "}
                      {cargo.quantityofcargodep || "N/A"}
                    </p>
                  </>
                )}
              </div>
            </Descriptions.Item>
          ))}
        </Descriptions>
      )}

      {/* Bunkers */}
      {bunkers.length > 0 && (
        <Descriptions
          bordered
          title="Bunker Details"
          size="middle"
          className="styled-descriptions"
        >
          {bunkers.map((bunker: any, index: number) => (
            <Descriptions.Item
              key={index}
              label={`Bunker ${bunker.number || index + 1}`}
              span={3}
            >
              <div>
                {isEditing ? (
                  <>
                    <p>
                      <strong>Product:</strong>{" "}
                      <Input
                        value={bunker.bunkerprod || ""}
                        onChange={(e) =>
                          handleChange(
                            `bunkers[${index}].bunkerprod`,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Quantity Intake:</strong>{" "}
                      <InputNumber
                        value={bunker.quantityintake || ""}
                        onChange={(value) =>
                          handleChange(
                            `bunkers[${index}].quantityintake`,
                            value
                          )
                        }
                      />
                    </p>
                    <p>
                      <strong>Bunker Size:</strong>{" "}
                      <InputNumber
                        value={bunker.bunkersize || ""}
                        onChange={(value) =>
                          handleChange(`bunkers[${index}].bunkersize`, value)
                        }
                      />
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </Descriptions.Item>
          ))}
        </Descriptions>
      )}
    </div>
  );
};

export default PreArrivalDetails;
