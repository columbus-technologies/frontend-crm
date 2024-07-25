import React, { useState } from "react";
import { Layout, Card, Typography, Button, Row, Form } from "antd";
import { FilePdfOutlined, EditOutlined } from "@ant-design/icons";
import { createInvoice, editInvoice } from "../../../api";
import { InvoicePricing, ShipmentResponse } from "../../../types";
import BluShipping_InvoiceForm from "../../../components/forms/invoices/BluShipping_InvoiceForm";
import BluShipping_InvoicePDF from "../../../components/pdf/BluShipping_InvoicePDF";
import InvoiceImage from "../../../assets/bluShipping.png";
import { PDFDownloadLink } from "@react-pdf/renderer";

import "../../../styles/InvoicingPage.css";
import useInvoiceData from "../../../hooks/invoice/BluShipping_useInvoiceData";

const { Title } = Typography;

interface InvoicingProps {
  selectedShipment: ShipmentResponse;
}

const Invoicing: React.FC<InvoicingProps> = ({ selectedShipment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasCurrentInvoice, setHasCurrentInvoice] = useState(false);
  const [displayPDF, setDisplayPDF] = useState(false);

  const [form] = Form.useForm();

  const {
    hasExistingInvoice,
    tenantInformation,
    invoiceData,
    terminalName,
    fetchInvoiceData,
  } = useInvoiceData(selectedShipment, form);

  const handleSaveInvoice = async () => {
    setIsEditing(!isEditing);

    try {
      const values = await form.validateFields();
      const stringValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, String(value)])
      );
      const payload: InvoicePricing = {
        tenant: tenantInformation || "",
        shipment_id: selectedShipment.ID,
        invoice_pricing_details: stringValues,
        created_at: invoiceData?.created_at || new Date().toISOString(),
      };
      if (hasExistingInvoice || hasCurrentInvoice) {
        await editInvoice(selectedShipment.ID, payload);
        console.log("invoice edited successfully");
      } else {
        await createInvoice(payload);

        console.log("invoice saved successfully");
      }
      setIsEditing(false);
      await fetchInvoiceData(); // Re-fetch data after saving so that user can generate PDF without refresh
      setHasCurrentInvoice(true);
      setDisplayPDF(true);
    } catch (error) {
      console.error("Failed to save or edit invoice", error);
    }
  };

  const handleEditPDA = () => {
    setIsEditing(true);
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    const calculateUnitsWithUnitPrice = (units: number, unitPrice: number) =>
      units * unitPrice;

    let newPortDues = Number(allValues.port_dues_price) || 0;
    let newPilotage = Number(allValues.pilotage_price) || 0;
    let newServiceLaunch = Number(allValues.service_launch_price) || 0;
    let newTowage = Number(allValues.towage_price) || 0;
    let mooringPrice = Number(allValues.mooring_price) || 0;
    let agencyFeePrice = Number(allValues.agency_fee_price) || 0;

    if (
      changedValues.port_dues_units !== undefined ||
      changedValues.port_dues_unitPrice !== undefined
    ) {
      newPortDues = calculateUnitsWithUnitPrice(
        Number(allValues.port_dues_units) || 0,
        Number(allValues.port_dues_unitPrice) || 0
      );
      allValues.port_dues_price = parseFloat(newPortDues.toFixed(2));
      // allValues.port_dues_price = newPortDues;
      allValues.port_dues_remarks = `Basis ${allValues.port_dues_units} Units @ ${allValues.port_dues_unitPrice} Per Unit`;
    }

    if (
      changedValues.pilotage_hours !== undefined ||
      changedValues.pilotage_hourlyRate !== undefined
    ) {
      console.log(allValues, "here");
      newPilotage = calculateUnitsWithUnitPrice(
        Number(allValues.pilotage_hours) || 0,
        Number(allValues.pilotage_hourlyRate) || 0
      );
      allValues.pilotage_price = parseFloat(newPilotage.toFixed(2));

      // allValues.pilotage_price = newPilotage;
      allValues.pilotage_remarks = `Basis ${allValues.pilotage_hours} Hours @ ${allValues.pilotage_hourlyRate} Per Hour`;
    }

    if (
      changedValues.service_launch_trips !== undefined ||
      changedValues.service_launch_hourlyRate !== undefined
    ) {
      console.log(allValues, "there");
      newServiceLaunch = calculateUnitsWithUnitPrice(
        Number(allValues.service_launch_trips) || 0,
        Number(allValues.service_launch_hourlyRate) || 0
      );
      allValues.service_launch_price = parseFloat(newServiceLaunch.toFixed(2));

      // allValues.service_launch_price = newServiceLaunch;
      allValues.service_launch_remarks = `Estimated Basis ${allValues.service_launch_trips} Trips`;
    }

    if (
      changedValues.towage_tugRate !== undefined ||
      changedValues.towage_tugs !== undefined ||
      changedValues.towage_hours !== undefined ||
      changedValues.towage_bafRate !== undefined
    ) {
      newTowage =
        Number(allValues.towage_tugRate || 0) *
        Number(allValues.towage_tugs || 0) *
        Number(allValues.towage_hours || 0) *
        Number((allValues.towage_bafRate || 0) / 100 + 1);
      // allValues.towage_price = newTowage;
      allValues.towage_price = parseFloat(newTowage.toFixed(2));

      allValues.towage_remarks = `Estimated Basis SGD ${allValues.towage_tugRate}/Tug/Hr x ${allValues.towage_tugs} Tugs
      x ${allValues.towage_hours} Hrs + ${allValues.towage_bafRate} % BAF`;
    }

    if (changedValues.mooring_price !== undefined) {
      mooringPrice = Number(changedValues.mooring_price) || 0;
      console.log(mooringPrice, "changedmoor");
      allValues.mooring_price = mooringPrice;
    }

    if (changedValues.agency_fee_price !== undefined) {
      agencyFeePrice = Number(changedValues.agency_fee_price) || 0;
      allValues.agency_fee_price = agencyFeePrice;
    }

    // Calculate the estimated total and convert all values to numbers
    const estimatedTotal =
      (Number(allValues.port_dues_price) || 0) +
      (Number(allValues.pilotage_price) || 0) +
      (Number(allValues.service_launch_price) || 0) +
      (Number(allValues.towage_price) || 0) +
      (Number(allValues.mooring_price) || 0) +
      (Number(allValues.agency_fee_price) || 0);

    console.log(
      Number(allValues.port_dues_price) || 0,
      Number(allValues.pilotage_price) || 0,
      Number(allValues.service_launch_price) || 0,
      (Number(allValues.towage_price) || 0) +
        (Number(allValues.mooring_price) || 0),
      Number(allValues.agency_fee_price) || 0
    );

    // Set all updated values including the estimated total
    form.setFieldsValue({
      ...allValues,
      estimated_total: estimatedTotal,
    });
    console.log(allValues, "allvalueslast");
    console.log(changedValues, "changedvalueslast");
    console.log(estimatedTotal, "Estimated total");
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
                Edit
              </Button>
            )}
            {(invoiceData || displayPDF) && (
              <PDFDownloadLink
                document={
                  <BluShipping_InvoicePDF
                    selectedShipment={selectedShipment}
                    invoicePricing={invoiceData!}
                    invoiceType="PDA"
                  />
                }
                fileName={`VESSEL_PDA_ETA-ETD_VOY_CARGO OPS (${terminalName.toUpperCase()}).pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    "Loading document..."
                  ) : (
                    <Button
                      type="primary"
                      icon={<FilePdfOutlined />}
                      style={{ marginRight: "10px" }}
                    >
                      Export PDA
                    </Button>
                  )
                }
              </PDFDownloadLink>
            )}
            {(invoiceData || displayPDF) && (
              <PDFDownloadLink
                document={
                  <BluShipping_InvoicePDF
                    selectedShipment={selectedShipment}
                    invoicePricing={invoiceData!}
                    invoiceType="FDA"
                  />
                }
                fileName={`VESSEL_FDA_ETA-ETD_VOY_CARGO OPS (${terminalName.toUpperCase()}).pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    "Loading document..."
                  ) : (
                    <Button type="primary" icon={<FilePdfOutlined />}>
                      Export FDA
                    </Button>
                  )
                }
              </PDFDownloadLink>
            )}
          </div>
        </Row>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <img src={InvoiceImage} alt="Company Logo" />
          </div>
          <BluShipping_InvoiceForm
            form={form}
            selectedShipment={selectedShipment}
            isEditing={isEditing}
            onValuesChange={onValuesChange}
          />
        </Card>
      </Card>
    </Layout>
  );
};

export default Invoicing;
