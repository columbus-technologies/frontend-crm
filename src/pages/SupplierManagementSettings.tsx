import React, { useEffect, useState } from "react";
import { Card, Typography, Table, Button, message, Modal } from "antd";
import { SupplierResponse } from "../types";
import {
  fetchSuppliers,
  createSupplier,
  deleteSupplier,
  getSupplierById,
  updateSupplier,
} from "../api";
import "../styles/index.css"; // Ensure the CSS file is imported
import AddSupplierModal from "../components/modals/AddSupplierSettingsModal";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";

const { Title } = Typography;

const SupplierManagementSettings: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);

  const loadSuppliers = async () => {
    try {
      const data = await fetchSuppliers();
      console.log("Fetched suppliers data:", data);
      setSuppliers(data);
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

  useEffect(() => {
    loadSuppliers(); // Initial fetch
  }, []);

  const columns = [
    {
      title: "Supplier Name",
      dataIndex: ["supplier_specifications", "name"],
      key: "supplier_name",
    },
    // Comment out first since do not need vessel names
    // {
    //   title: "Vessel",
    //   dataIndex: ["supplier_specifications", "vessels"],
    //   key: "supplier_vessel",
    //   render: (vessels: string[]) => {
    //     console.log("Rendering vessels:", vessels);
    //     return (
    //       <div>
    //         {vessels.map((vessel, index) => (
    //           <div key={index}>{vessel}</div>
    //         ))}
    //       </div>
    //     );
    //   },
    // },

    {
      title: "Email",
      dataIndex: ["supplier_specifications", "email"],
      key: "supplier_email",
    },
    {
      title: "Contact",
      dataIndex: ["supplier_specifications", "contact"],
      key: "supplier_contact",
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: SupplierResponse) => (
        <Button type="primary" danger onClick={() => handleDelete(record.ID)}>
          Delete
        </Button>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting Supplier with ID: ${id}`); // Debugging deletion

      await deleteSupplier(id);
      loadSuppliers();
      message.success("Supplier deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to delete Supplier:", error.message);
        message.error("Failed to delete Supplier. Please try again.");
      }
    }
  };

  return (
    <div className="settings-management-container">
      <Title level={2} className="settings-management-title">
        Supplier Settings
      </Title>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button type="primary" onClick={showModal}>
          Add Supplier Setting
        </Button>
      </div>
      <Card>
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <Table dataSource={suppliers} columns={columns} />
        )}
      </Card>
      <AddSupplierModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        loadSuppliers={loadSuppliers}
      />
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default SupplierManagementSettings;
