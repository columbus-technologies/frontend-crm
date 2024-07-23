import React, { useState } from "react";
import {
  Layout,
  Card,
  Typography,
  Button,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Divider,
} from "antd";
import { FilePdfOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { createInvoice, editInvoice } from "../../api";
import { InvoicePricing, ShipmentResponse } from "../../types";

import InvoiceImage from "../../assets/bluShipping.png"; // Import the image

import "../../styles/InvoicingPage.css";
import getLatestETD from "../../utils/dateTimeUtils";
import useInvoiceData from "../../hooks/useInvoiceData";

const { Title } = Typography;

interface InvoicingProps {
  selectedShipment: ShipmentResponse;
}

const Invoicing: React.FC<InvoicingProps> = ({ selectedShipment }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [hasCurrentInvoice, setHasCurrentInvoice] = useState(false);

  const [form] = Form.useForm();
  const { hasExistingInvoice, tenantInformation, invoiceData } = useInvoiceData(
    selectedShipment,
    form
  );

  const handleSaveInvoice = async () => {
    setIsEditing(!isEditing);

    try {
      const values = await form.validateFields();
      const stringValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, String(value)])
      );
      console.log(stringValues, "string");
      const payload: InvoicePricing = {
        tenant: tenantInformation || "",
        shipment_id: selectedShipment.ID,
        invoice_pricing_details: stringValues,
        created_at: invoiceData?.created_at || new Date().toISOString(), // Use a default value if created_at is undefined
      };
      console.log(hasExistingInvoice, "hasexisting");
      if (hasExistingInvoice || hasCurrentInvoice) {
        await editInvoice(selectedShipment.ID, payload);
        console.log("Invoice edited successfully");
      } else {
        await createInvoice(payload);
        console.log("Invoice saved successfully");
        setHasCurrentInvoice(true);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save or edit invoice", error);
    }
  };

  const handleEditPDA = () => {
    setIsEditing(true);
  };

  const handleExportPDF = () => {
    // Logic to handle exporting as PDF
    console.log("Export as PDF clicked");
  };

  const calculateUnitsWithUnitPrice = (units: number, unitPrice: number) => {
    return units * unitPrice;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    if (
      changedValues.port_dues_units !== undefined ||
      changedValues.port_dues_unitPrice !== undefined
    ) {
      const newPortDues = calculateUnitsWithUnitPrice(
        allValues.port_dues_units,
        allValues.port_dues_unitPrice
      );
      console.log("SDA");
      form.setFieldsValue({
        port_dues_price: newPortDues,
        port_dues_remarks: `Basis ${
          allValues.port_dues_units
        } Units @ ${allValues.port_dues_unitPrice.toFixed(2)} Per Unit`,
      });
    }

    if (
      changedValues.pilotage_hours !== undefined ||
      changedValues.pilotage_hourlyRate !== undefined
    ) {
      const newPilotage = calculateUnitsWithUnitPrice(
        allValues.pilotage_hours,
        allValues.pilotage_hourlyRate
      );
      form.setFieldsValue({
        pilotage_price: newPilotage,
        pilotage_remarks: `Basis ${
          allValues.pilotage_hours
        } Hours @ ${allValues.pilotage_hourlyRate.toFixed(2)} Per Hour`,
      });
    }

    if (
      changedValues.service_launch_trips !== undefined ||
      changedValues.service_launch_hourlyRate !== undefined
    ) {
      const newServiceLaunch = calculateUnitsWithUnitPrice(
        allValues.service_launch_trips,
        allValues.service_launch_hourlyRate
      );
      form.setFieldsValue({
        service_launch_price: newServiceLaunch,
        service_launch_remarks: `Estimated Basis ${allValues.service_launch_trips} Trips`,
      });
    }

    if (
      changedValues.towage_tugRate !== undefined ||
      changedValues.towage_tugs !== undefined ||
      changedValues.towage_hours !== undefined ||
      changedValues.towage_bafRate !== undefined ||
      changedValues.towage_price !== undefined
    ) {
      const newTowage =
        allValues.towage_tugRate *
        allValues.towage_tugs *
        allValues.towage_hours *
        (allValues.towage_bafRate / 100 + 1);
      form.setFieldsValue({
        towage_price: newTowage,
        towage_remarks: `Estimated Basis SGD ${allValues.towage_tugRate}/Tug/Hr x ${allValues.towage_tugs} Tugs
        x ${allValues.towage_hours} Hrs + ${allValues.towage_bafRate} % BAF`,
      });
    }

    if (changedValues.agency_fee_price !== undefined) {
      form.setFieldsValue({
        agency_fee_price: allValues.agency_fee_price,
      });
    }
  };

  return (
    <Layout>
      <Card>
        <Row justify="space-between" style={{ marginBottom: "20px" }}>
          <Title level={2}>Invoicing</Title>
          <div>
            {isEditing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleSaveInvoice}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditPDA}
                style={{ marginRight: "10px" }}
              >
                Edit PDA
              </Button>
            )}
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleExportPDF}
            >
              Export as PDF
            </Button>
          </div>
        </Row>
        <Card>
          <Form
            form={form}
            initialValues={{
              customerName:
                (selectedShipment.shipment_type.bunkering?.bunkering_activity
                  ?.length > 0 &&
                  selectedShipment.shipment_type.bunkering.bunkering_activity[0]
                    .customer_name) ||
                (selectedShipment.shipment_type.cargo_operations
                  ?.cargo_operations_activity?.length > 0 &&
                  selectedShipment.shipment_type.cargo_operations
                    .cargo_operations_activity[0].customer_name) ||
                "",
              voyageNumber: selectedShipment.voyage_number,
              vesselName: selectedShipment.vessel_specifications.vessel_name,
              callSign: selectedShipment.vessel_specifications.call_sign,
              grt: selectedShipment.vessel_specifications.grt,
              nrt: selectedShipment.vessel_specifications.nrt + " metres",
              dwt: selectedShipment.vessel_specifications.sdwt,
              loa: selectedShipment.vessel_specifications.loa + " metres",
              eta: new Date(selectedShipment.ETA),
              etd: getLatestETD(selectedShipment),
              imoNumber: selectedShipment.vessel_specifications.imo_number,
              location: "Location",
              fax: "Fax",
              purpose: "Purpose",
              port_dues_description: "Port Dues",
              pilotage_description: "Pilotage",
              service_launch_description: "Service Launch",
              towage_description: "Towage",
              mooring_description: "Mooring",
              agency_fee_description: "Agency Fee",
            }}
            onValuesChange={onValuesChange}
          >
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={8}>
                <Form.Item label="Name" name="customerName">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Fax" name="fax">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="IMO Number" name="imoNumber">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Vessel Name" name="vesselName">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Voyage Number" name="voyageNumber">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Call Sign" name="callSign">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Location" name="location">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Purpose" name="purpose">
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Contact Number" name="contactNumber">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="GRT" name="grt">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="NRT" name="nrt">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="DWT" name="dwt">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="LOA" name="loa">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="ETA" name="eta">
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="ETD" name="etd">
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                <img src={InvoiceImage} alt="Company Logo" />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={6}>
                <Form.Item label="Description" name="port_dues_description">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Units" name="port_dues_units">
                  <InputNumber min={0} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Unit Price" name="port_dues_unitPrice">
                  <InputNumber min={0} step={0.1} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="SGD Price" name="port_dues_price">
                  <InputNumber min={0} step={0.01} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Form.Item label="Remarks" name="port_dues_remarks">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={6}>
                <Form.Item label="Description" name="pilotage_description">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hours" name="pilotage_hours">
                  <InputNumber min={0} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hourly Rate" name="pilotage_hourlyRate">
                  <InputNumber min={0} step={0.1} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="SGD Price" name="pilotage_price">
                  <InputNumber min={0} step={0.01} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Form.Item label="Remarks" name="pilotage_remarks">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={6}>
                <Form.Item
                  label="Description"
                  name="service_launch_description"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Trips" name="service_launch_trips">
                  <InputNumber min={0} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hourly Rate" name="service_launch_hourlyRate">
                  <InputNumber min={0} step={0.1} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="SGD Price" name="service_launch_price">
                  <InputNumber min={0} step={0.01} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Form.Item label="Remarks" name="service_launch_remarks">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={6}>
                <Form.Item label="Description" name="towage_description">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Tug Rate" name="towage_tugRate">
                  <InputNumber min={0} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Tugs" name="towage_tugs">
                  <InputNumber min={0} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Hours" name="towage_hours">
                  <InputNumber min={0} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="BAF Rate (%)" name="towage_bafRate">
                  <InputNumber min={0} step={0.1} disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="SGD Price" name="towage_price">
                  <InputNumber min={0} step={0.1} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={16}>
                <Form.Item label="Remarks" name="towage_remarks">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={6}>
                <Form.Item label="Description" name="mooring_description">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="SGD Price" name="mooring_price">
                  <InputNumber min={0} disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={16}>
                <Form.Item label="Remarks" name="mooring_remarks">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Form.Item label="Description" name="agency_fee_description">
                  <Input defaultValue="Agency Fee" disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="SGD Price" name="agency_fee_price">
                  <InputNumber min={0} step={0.01} disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col span={12}>
              <Title level={4}>Banking Details</Title>
              <p>
                <strong>Bank Name:</strong> XXXXXXXX
              </p>
              <p>
                <strong>Swift Code:</strong> XXXXXXXX
              </p>
            </Col>
            <Col span={12}>
              <Title level={4}>Remarks</Title>
              <p>XXXXXXXXXXXXXXXXXXXX</p>
              <p>XXXXXXXXXXXXXXXXXXXX</p>
            </Col>
          </Row>
        </Card>
      </Card>
    </Layout>
  );
};

export default Invoicing;
