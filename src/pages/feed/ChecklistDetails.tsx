import React, { useState } from "react";
import {
  ChecklistResponse,
  ShipmentResponse,
  ChecklistInformation,
} from "../../types";
import { Table, Button, Modal, message, Input, Select } from "antd";
import { getChecklistById, updateChecklist } from "../../api";

const { Option } = Select;

// Define the columns structure for the table
const getTableColumns = (
  isEditing: boolean,
  onChange: (key: string, field: string, value: any) => void,
  isEditable: (key: string) => boolean
) => [
  {
    title: "Service",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: any) =>
      isEditing && isEditable(record.key) ? (
        <Input
          value={text}
          onChange={(e) => onChange(record.key, "name", e.target.value)}
        />
      ) : (
        text // Display as text for non-editable rows
      ),
  },
  {
    title: "Supplier",
    dataIndex: "supplier",
    key: "supplier",
    render: (text: string, record: any) =>
      isEditing ? (
        <Input
          value={text}
          onChange={(e) => onChange(record.key, "supplier", e.target.value)}
        />
      ) : (
        text
      ),
  },
  {
    title: "Provided",
    dataIndex: "serviceProvided",
    key: "service_provided",
    render: (text: boolean, record: any) =>
      isEditing ? (
        <Select
          value={text ? "Yes" : "No"}
          onChange={(value) => onChange(record.key, "service_provided", value)}
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </Select>
      ) : text ? (
        "Yes"
      ) : (
        "No"
      ),
  },
];

// Helper function to generate the data source for the table
const getChecklistData = (checklist: ChecklistResponse | null) => {
  if (!checklist) return [];

  const createChecklistRow = (
    key: string,
    label: string,
    info: ChecklistInformation
  ) => ({
    name: key,
    key: label,
    serviceProvided: info?.service_provided,
    supplier: info?.supplier || "N/A",
    editable: false, // Non-editable for pre-existing checklist rows
  });

  // Generate data for pre-existing fields
  const data = [
    createChecklistRow("Port Dues", "port_dues", checklist.port_dues),
    createChecklistRow("Pilotage", "pilotage", checklist.pilotage),
    createChecklistRow(
      "Service Launch",
      "service_launch",
      checklist.service_launch
    ),
    createChecklistRow("Logistics", "logistics", checklist.logistics),
    createChecklistRow(
      "Hotel Charges",
      "hotel_charges",
      checklist.hotel_charges
    ),
    createChecklistRow("Air Tickets", "air_tickets", checklist.air_tickets),
    createChecklistRow(
      "Transport Charges",
      "transport_charges",
      checklist.transport_charges
    ),
    createChecklistRow(
      "Medicine Supplies",
      "medicine_supplies",
      checklist.medicine_supplies
    ),
    createChecklistRow(
      "Fresh Water Supply",
      "fresh_water_supply",
      checklist.fresh_water_supply
    ),
    createChecklistRow(
      "Marine Advisory",
      "marine_advisory",
      checklist.marine_advisory
    ),
    createChecklistRow(
      "Courier Services",
      "courier_services",
      checklist.courier_services
    ),
    createChecklistRow(
      "Cross Harbour Fees",
      "cross_harbour_fees",
      checklist.cross_harbour_fees
    ),
    createChecklistRow("Supply Boat", "supply_boat", checklist.supply_boat),
    createChecklistRow(
      "Deslopping",
      "deslopping",
      checklist.repairs.deslopping
    ),
    createChecklistRow(
      "Lift Repair",
      "lift_repair",
      checklist.repairs.lift_repair
    ),
    createChecklistRow("UW Clean", "uw_clean", checklist.repairs.uw_clean),
  ];

  // Generate data for dynamically added extras
  const extrasData = Object.keys(checklist.extras).map((key) => ({
    service: key,
    key,
    name: checklist.extras[key].name,
    serviceProvided: checklist.extras[key].service_provided,
    supplier: checklist.extras[key].supplier || "",
    editable: true, // Allow editing for dynamically added rows
  }));
  console.log(extrasData, "extrasData");
  return [...data, ...extrasData];
};

const RenderChecklistDetails: React.FC<{
  selectedShipment: ShipmentResponse;
  selectedChecklist: ChecklistResponse | null;
}> = ({ selectedShipment, selectedChecklist }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedChecklist, setEditedChecklist] =
    useState<ChecklistResponse | null>(selectedChecklist);

  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (editedChecklist && editedChecklist.ID) {
      try {
        await updateChecklist(editedChecklist.ID, editedChecklist);
        message.success("Checklist updated successfully!");
        setIsEditing(false);

        // Re-fetch updated checklist data
        const updatedChecklist = await getChecklistById(selectedShipment.ID);
        setEditedChecklist(updatedChecklist);
      } catch (error) {
        message.error("Failed to update checklist. Please try again.");
        if (error instanceof Error) {
          message.error(error.message);
        }
      }
    }
  };

  const handleAddRow = () => {
    const newExtraKey = `extra_${
      Object.keys(editedChecklist!.extras).length + 1
    }`;
    const newExtra = {
      name: "Please change accordingly",
      service_provided: false,
      supplier: "Please change accordingly",
    };
    setEditedChecklist({
      ...editedChecklist!,
      extras: {
        ...editedChecklist!.extras,
        [newExtraKey]: newExtra,
      },
    });
  };

  // Function to handle input changes in the table
  const handleInputChange = (key: string, field: string, value: any) => {
    console.log(
      `handleInputChange called with key: ${key}, field: ${field}, value: ${value}`
    );

    const updatedChecklist = { ...editedChecklist };

    if (key.includes("extra")) {
      // Since extras is now a dictionary, we can directly update or add new entries
      if (!updatedChecklist!.extras) {
        updatedChecklist!.extras = {};
      }

      if (!updatedChecklist!.extras[key]) {
        updatedChecklist!.extras[key] = {
          name: "n/A",
          service_provided: false,
          supplier: "N/A",
        };
      }

      // Update the specific field (like service_provided or supplier) in the extras
      if (field === "service_provided") {
        value = value === "Yes" ? true : false; // Convert Yes/No to boolean
        updatedChecklist!.extras[key][field] = value;
      } else {
        updatedChecklist!.extras[key][field] = value;
        console.log("f");
      }
    } else {
      // Handle pre-existing rows or repairs
      if (["lift_repair", "uw_clean", "deslopping"].includes(key)) {
        if (field === "service_provided") {
          value = value === "Yes" ? true : false; // Convert Yes/No to boolean
          updatedChecklist!.repairs[key][field] = value;
        } else {
          updatedChecklist!.repairs[key][field] = value;
        }
      } else {
        if (field === "service_provided") {
          value = value === "Yes" ? true : false;
          updatedChecklist![key][field] = value;
        }

        if (field === "supplier") {
          updatedChecklist![key][field] = value;
        }
      }
    }

    setEditedChecklist(updatedChecklist); // Update the checklist state
    console.log(editedChecklist, "editedChecklist");
  };

  // Function to check if a row is editable (only dynamic rows are editable)
  const isEditable = (key: string) => key.includes("extra");

  return (
    <>
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
        {isEditing && (
          <Button
            type="default"
            onClick={handleAddRow}
            style={{ marginBottom: 16, marginLeft: 10 }}
          >
            Add Row
          </Button>
        )}
      </div>

      <div>
        {/* Render Checklist Information as Table */}
        <Table
          className="styled-descriptions"
          columns={getTableColumns(isEditing, handleInputChange, isEditable)} // Pass isEditable function to the table columns
          dataSource={getChecklistData(editedChecklist)} // Use editedChecklist as the data source
          bordered
          pagination={false}
          title={() => "Checklist Details"}
        />

        {/* Unauthorized Modal */}
        <Modal
          title="Unauthorized"
          open={isUnauthorizedModalVisible}
          onCancel={() => setIsUnauthorizedModalVisible(false)}
          footer={null}
        >
          <p>You are not authorized to edit this checklist.</p>
        </Modal>
      </div>
    </>
  );
};

export default RenderChecklistDetails;
