import React from "react";
import { Form, Input, InputNumber, Row, Col, Divider, Typography } from "antd";
import { ShipmentResponse } from "../../types";
import getLatestETD from "../../utils/dateTimeUtils";
const { Title } = Typography;

interface InvoiceFormProps {
  form: any;
  selectedShipment: ShipmentResponse;
  isEditing: boolean;
  onValuesChange: (changedValues: any, allValues: any) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  form,
  selectedShipment,
  isEditing,
  onValuesChange,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
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
        style={{ maxWidth: "800px", width: "100%" }} // Adjust the maxWidth as needed
      >
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={12}>
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
          <Col span={12}>
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
            <Form.Item label="Description" name="service_launch_description">
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
      </Form>
    </div>
  );
};

export default InvoiceForm;
