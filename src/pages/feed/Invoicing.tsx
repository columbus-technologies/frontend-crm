import React, { useEffect, useState } from "react";
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
import {
  createInvoice,
  editInvoice,
  getCustomerByName,
  getInvoiceById,
  getInvoiceFeesFromPortAuthority,
} from "../../api";
import {
  CustomerResponse,
  GetInvoiceFeesFromPortAuthorityResponse,
  InvoicePricing,
  ShipmentResponse,
} from "../../types";

import InvoiceImage from "../../assets/bluShipping.png"; // Import the image

import "../../styles/InvoicingPage.css";
import getLatestETD from "../../utils/dateTimeUtils";
import getPilotageFees from "../../utils/invoice";

const { Title } = Typography;

interface InvoicingProps {
  selectedShipment: ShipmentResponse;
}

const Invoicing: React.FC<InvoicingProps> = ({ selectedShipment }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true);
  const [hasExistingInvoice, setHasExistingInvoice] = useState(false);

  const [form] = Form.useForm();
  const [invoiceFeesData, setInvoiceFeesData] =
    useState<GetInvoiceFeesFromPortAuthorityResponse | null>(null);
  const [customerData, setCustomerData] = useState<CustomerResponse | null>(
    null
  );
  const [tenantInformation, setTenantInformation] = useState<
    string | undefined
  >(undefined);

  const fetchData = async () => {
    try {
      const fetchedInvoiceFeesData = await getInvoiceFeesFromPortAuthority();
      console.log(fetchedInvoiceFeesData, "Fetched Invoice Fees Data");
      setInvoiceFeesData(fetchedInvoiceFeesData);
      setTenantInformation(fetchedInvoiceFeesData.tenant);
      const customerDataByName = await getCustomerByName(
        selectedShipment.shipment_type.bunkering.bunkering_activity[0]
          .customer_name ||
          selectedShipment.shipment_type.cargo_operations
            .cargo_operations_activity[0].customer_name ||
          ""
      );
      console.log(customerDataByName);
      setCustomerData(customerDataByName);
      console.log(customerData, "YYY");
    } catch (error) {
      console.error("Failed to fetch invoice fees data", error);
    }

    try {
      console.log(selectedShipment, "Selected Shipment");
      const data = await getInvoiceById(selectedShipment.ID);
      console.log(data);
      form.setFieldsValue(data);
      // get customer information
      form.setFieldsValue({
        customerName: data.invoice_pricing_details["customerName"],
        fax: data.invoice_pricing_details["fax"],
        imoNumber: data.invoice_pricing_details["imoNumber"],
        vessleName: data.invoice_pricing_details["vesselName"],
        voyageNumber: data.invoice_pricing_details["voyageNumber"],
        callSign: data.invoice_pricing_details["callSign"],
        location: data.invoice_pricing_details["location"],
        purpose: data.invoice_pricing_details["purpose"],
        contactNumber: data.invoice_pricing_details["contactNumber"],
        email: data.invoice_pricing_details["email"],
        grt: data.invoice_pricing_details["grt"],
        nrt: data.invoice_pricing_details["nrt"],
        dwt: data.invoice_pricing_details["dwt"],
        loa: data.invoice_pricing_details["loa"],
        eta: data.invoice_pricing_details["eta"],
        etd: data.invoice_pricing_details["etd"],
        port_dues_description:
          data.invoice_pricing_details["port_dues_description"],
        port_dues_units: data.invoice_pricing_details["port_dues_units"],
        port_dues_unitPrice:
          data.invoice_pricing_details["port_dues_unitPrice"],
        port_dues_price: data.invoice_pricing_details["port_dues_price"],
        port_dues_remarks: data.invoice_pricing_details["port_dues_remarks"],
        pilotage_description:
          data.invoice_pricing_details["pilotage_description"],
        pilotage_hours: data.invoice_pricing_details["pilotage_hours"],
        pilotage_hourlyRate:
          data.invoice_pricing_details["pilotage_hourlyRate"],
        pilotage_price: data.invoice_pricing_details["pilotage_price"],
        pilotage_remarks: data.invoice_pricing_details["pilotage_remarks"],
        service_launch_description:
          data.invoice_pricing_details["service_launch_description"],
        service_launch_trips:
          data.invoice_pricing_details["service_launch_trips"],
        service_launch_hourlyRate:
          data.invoice_pricing_details["service_launch_hourlyRate"],
        service_launch_price:
          data.invoice_pricing_details["service_launch_price"],
        service_launch_remarks:
          data.invoice_pricing_details["service_launch_remarks"],
        towage_description: data.invoice_pricing_details["towage_description"],
        towage_tugRate: data.invoice_pricing_details["towage_tugRate"],
        towage_tugs: data.invoice_pricing_details["towage_tugs"],
        towage_hours: data.invoice_pricing_details["towage_hours"],
        towage_bafRate: data.invoice_pricing_details["towage_bafRate"],
        towage_price: data.invoice_pricing_details["towage_price"],
        towage_remarks: data.invoice_pricing_details["towage_remarks"],
        mooring_description:
          data.invoice_pricing_details["mooring_description"],
        mooring_price: data.invoice_pricing_details["mooring_price"],
        mooring_remarks: data.invoice_pricing_details["mooring_remarks"],
        agency_fee_description:
          data.invoice_pricing_details["agency_fee_description"],
        agency_fee_price: data.invoice_pricing_details["agency_fee_price"],
      });
      setIsEditing(false);
      setHasExistingInvoice(true);
    } catch (error) {
      console.error("Failed to fetch PDA invoice data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedShipment, form]);

  useEffect(() => {
    if (invoiceFeesData) {
      const latestETD = getLatestETD(selectedShipment);
      const pilotageFees = getPilotageFees(
        invoiceFeesData.invoiceFees.pilotage,
        selectedShipment
      );

      // default values for invoicing
      const pilotageDefaultHours = 7;
      const serviceLaunchDefaultTrips = 2;
      const towageDefaultBafPercentRate = 5;

      // Get terminal name if available
      const cargoOperationsActivity =
        selectedShipment.shipment_type.cargo_operations
          ?.cargo_operations_activity;
      const terminalName =
        cargoOperationsActivity && cargoOperationsActivity.length > 0
          ? cargoOperationsActivity[0].terminal_name
          : "default";
      // Update info once invoiceFeesData is available
      console.log(customerData, "ZZZ");
      form.setFieldsValue({
        agency_fee_price: invoiceFeesData.invoiceFees.agencyFee.fees,
        mooring_price: invoiceFeesData.invoiceFees.mooring[terminalName],
        pilotage_hourlyRate: pilotageFees,
        pilotage_hours: pilotageDefaultHours,
        pilotage_price: pilotageFees * pilotageDefaultHours,
        pilotage_remarks: `Basis ${pilotageDefaultHours} Hours @ ${pilotageFees} Per Hour`,
        service_launch_trips: serviceLaunchDefaultTrips,
        service_launch_hourlyRate:
          invoiceFeesData.invoiceFees.serviceLaunch["hourlyRate"],
        service_launch_price:
          serviceLaunchDefaultTrips *
          invoiceFeesData.invoiceFees.serviceLaunch["hourlyRate"],
        service_launch_remarks: `Estimated Basis ${serviceLaunchDefaultTrips} Trips`,
        towage_bafRate: towageDefaultBafPercentRate,
        towage_remarks: `Estimated Basis SGD /Tug/Hr x  Tugs
        x  Hrs +  % 5 BAF`,
        mooring_remarks: `Estimated Basis Universal Terminal Tariff`,
        contactNumber: customerData?.contact,
        email: customerData?.email,
        eta: new Date(selectedShipment.ETA),
        etd: getLatestETD(selectedShipment),
      });

      const etaDate = new Date(selectedShipment.ETA);

      // divide the difference by the no. of milliseconds in a day
      const numOfDaysShipmentStayed = Math.ceil(
        (latestETD.getTime() - etaDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Size of Vessel (per 100 Gross Tonnage);
      // https://www.mpa.gov.sg/finance-e-services/tariff-fees-and-charges/ocean-going-vessels
      const sizeOfVessel = selectedShipment.vessel_specifications.grt / 100;

      if (
        selectedShipment.shipment_type.cargo_operations.cargo_operations &&
        !selectedShipment.shipment_type.bunkering.bunkering
      ) {
        const cargoPortDuesPrice =
          invoiceFeesData.invoiceFees.cargo_operations[numOfDaysShipmentStayed];
        form.setFieldsValue({
          port_dues_units: sizeOfVessel,
          port_dues_price: cargoPortDuesPrice * sizeOfVessel,
          port_dues_unitPrice: cargoPortDuesPrice,
          port_dues_remarks: `Basis ${sizeOfVessel} Units @ ${cargoPortDuesPrice?.toFixed(
            2
          )} Per Unit`,
        });
      }

      if (
        selectedShipment.shipment_type.bunkering.bunkering &&
        !selectedShipment.shipment_type.cargo_operations.cargo_operations
      ) {
        console.log("Bunkering only");
        const bunkeringPortDuesPrice =
          invoiceFeesData.invoiceFees.bunkering[numOfDaysShipmentStayed];
        console.log(bunkeringPortDuesPrice, "Bunkering Port Dues Price");
        form.setFieldsValue({
          port_dues_units: sizeOfVessel,

          port_dues_price: bunkeringPortDuesPrice * sizeOfVessel,
          port_dues_unitPrice: bunkeringPortDuesPrice,
          port_dues_remarks: `Basis ${sizeOfVessel} Units @ ${bunkeringPortDuesPrice?.toFixed(
            2
          )} Per Unit`,
        });
      }
      // to be further confimed and modified
      if (
        selectedShipment.shipment_type.bunkering.bunkering &&
        selectedShipment.shipment_type.cargo_operations.cargo_operations
      ) {
        console.log("Both Bunkering and Cargo Operations");
        const bunkeringPortDuesPrice =
          invoiceFeesData.invoiceFees.bunkering[numOfDaysShipmentStayed];
        form.setFieldsValue({
          port_dues_units: sizeOfVessel,
          port_dues_price: bunkeringPortDuesPrice * sizeOfVessel,
          port_dues_unitPrice: bunkeringPortDuesPrice, // Adjust this value according to your logic
          port_dues_remarks: `Basis ${sizeOfVessel} Units @ ${bunkeringPortDuesPrice?.toFixed(
            2
          )} Per Unit`,
        });
      }
      //3rd scenario neither bunkering nor cargo ops, then resume default
    }
  }, [invoiceFeesData, customerData, selectedShipment, form]);

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
      };
      if (hasExistingInvoice) {
        await editInvoice(selectedShipment.ID, payload);
        console.log("Invoice edited successfully");
      } else {
        await createInvoice(payload);
        console.log("Invoice saved successfully");
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
