// src/components/VesselSettings.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { Vessel, VesselResponse } from "../types";
import { fetchVessels, createVessel, deleteVessel } from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported

const { Title } = Typography;

const VesselSettings: React.FC = () => {
  const [vessels, setVessels] = useState<VesselResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const loadVessels = async () => {
    try {
      const data = await fetchVessels();
      console.log(data);
      setVessels(data);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(String(error));
      }
      console.error("There was an error!", error);
    }
  };

  useEffect(() => {
    loadVessels(); // Initial fetch
  }, []);

  const columns = [
    { title: "IMO Number", dataIndex: "imo_number", key: "imo_number" },
    { title: "Vessel Name", dataIndex: "vessel_name", key: "vessel_name" },
    { title: "Call Sign", dataIndex: "call_sign", key: "call_sign" },
    { title: "SDWT", dataIndex: "sdwt", key: "sdwt" },
    { title: "NRT", dataIndex: "nrt", key: "nrt" },
    { title: "Flag", dataIndex: "flag", key: "flag" },
    { title: "GRT", dataIndex: "grt", key: "grt" },
    { title: "LOA", dataIndex: "loa", key: "loa" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: VesselResponse) => (
        <Button type="primary" danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload: Vessel = {
        vessel_specifications: {
          ...values,
          imo_number: parseInt(values.imo_number, 10),
        },
      };

      console.log("Form values:", payload);

      await createVessel(payload);

      loadVessels();

      setIsModalVisible(false);
      form.resetFields();
      message.success("Vessel added successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add vessel setting:", error.message);
        // message.error('Failed to add vessel setting. Please try again.');
        if (error.message === "Duplicate key error") {
          message.error("Vessel with this IMO number already exists.");
        } else {
          message.error("Server error. Please try again.");
        }
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting vessel with ID: ${id}`); // Debugging deletion

      await deleteVessel(id);
      loadVessels();
      message.success("Vessel deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete vessel:", error.message);
        message.error("Failed to delete vessel. Please try again.");
      }
    }
  };

  return (
    <div className="vessel-settings-container">
      <Title level={2} className="vessel-settings-title">
        Vessel Settings
      </Title>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={showModal}>
          Add Vessel Setting
        </Button>
      </div>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Table dataSource={vessels} columns={columns} />
        )}
      </Card>
      <Modal
        title="Add Vessel Setting"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="imo_number"
            label="IMO Number"
            rules={[
              { required: true, message: "Please input the IMO Number!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="vessel_name"
            label="Vessel Name"
            rules={[
              { required: true, message: "Please input the Vessel Name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="call_sign"
            label="Call Sign"
            rules={[{ required: true, message: "Please input the Call Sign!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sdwt"
            label="SDWT"
            rules={[{ required: true, message: "Please input the SDWT!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nrt"
            label="NRT"
            rules={[{ required: true, message: "Please input the NRT!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="flag"
            label="Flag"
            rules={[{ required: true, message: "Please input the Flag!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="grt"
            label="GRT"
            rules={[{ required: true, message: "Please input the GRT!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="loa"
            label="LOA"
            rules={[{ required: true, message: "Please input the LOA!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VesselSettings;