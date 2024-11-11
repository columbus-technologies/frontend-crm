import React, { useState } from "react";
import { Layout, Card, Typography, Button, Row, Form } from "antd";
import { FilePdfOutlined, EditOutlined } from "@ant-design/icons";
import { createInvoice, editInvoice } from "../../../api";
import { InvoicePricing, ShipmentResponse } from "../../../types";
import BluShipping_InvoiceForm from "../../../components/forms/invoices/BluShipping_InvoiceForm";
import InvoiceImage from "../../../assets/ship.png";
import { PDFDownloadLink } from "@react-pdf/renderer";

import "../../../styles/InvoicingPage.css";
import useInvoiceData from "../../../hooks/invoice/BluShipping_useInvoiceData";
import TestDemo_InvoicePDF from "../../../components/pdf/TestDemo_Invoicing";

const { Title } = Typography;

interface TestDemoInvoicingProps {
  selectedShipment: ShipmentResponse;
}

const TestDemoInvoicing: React.FC<TestDemoInvoicingProps> = ({
  selectedShipment,
}) => {
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
    invoiceFeesData,
  } = useInvoiceData(selectedShipment, form);

  const handleSaveInvoice = async () => {
    setIsEditing(!isEditing);

    try {
      const values = await form.validateFields();
      // converts into string
      const stringValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, String(value)])
      );

      // Extracting and structuring data from each Form.List
      const portDuesArray = values.portDues.map((field: any) => ({
        description: field.description,
        units: field.units,
        unitPrice: field.unitPrice,
        price: field.price,
        remarks: field.remarks,
      }));

      const pilotageArray = values.pilotage.map((field: any) => ({
        description: field.description,
        hours: field.hours,
        hourlyRate: field.hourlyRate,
        price: field.price,
        remarks: field.remarks,
      }));

      const serviceLaunchArray = values.serviceLaunch.map((field: any) => ({
        description: field.description,
        trips: field.trips,
        hourlyRate: field.hourlyRate,
        price: field.price,
        remarks: field.remarks,
      }));

      const towageArray = values.towage.map((field: any) => ({
        description: field.description,
        tugRate: field.tugRate,
        tugs: field.tugs,
        hours: field.hours,
        bafRate: field.bafRate,
        price: field.price,
        remarks: field.remarks,
      }));

      const mooringArray = values.mooring.map((field: any) => ({
        description: field.description,
        price: field.price,
        remarks: field.remarks,
      }));

      const agencyFeeArray = values.agencyFee.map((field: any) => ({
        description: field.description,
        price: field.price,
      }));

      const dynamicFieldsArray = values.dynamicFields.map((field: any) => ({
        description: field.description,
        price: field.price,
      }));

      const payload: InvoicePricing = {
        tenant: tenantInformation || "",
        shipment_id: selectedShipment.ID,
        invoice_pricing_details: {
          ...stringValues,
          portDues: JSON.stringify(portDuesArray),
          pilotage: JSON.stringify(pilotageArray),
          serviceLaunch: JSON.stringify(serviceLaunchArray),
          towage: JSON.stringify(towageArray),
          mooring: JSON.stringify(mooringArray),
          agencyFee: JSON.stringify(agencyFeeArray),
          dynamicFields: JSON.stringify(dynamicFieldsArray),
        },
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

    let newPortDues = Number(allValues.portDues[0]?.price) || 0;
    let newPilotage = Number(allValues.pilotage[0]?.price) || 0;
    let newServiceLaunch = Number(allValues.serviceLaunch[0]?.price) || 0;
    let newTowage = Number(allValues.towage[0]?.price) || 0;
    console.log(allValues, "ALL");

    if (
      changedValues.portDues?.[0]?.units !== undefined ||
      changedValues.portDues?.[0]?.unitPrice !== undefined
    ) {
      newPortDues = calculateUnitsWithUnitPrice(
        Number(allValues.portDues[0]?.units) || 0,
        Number(allValues.portDues[0]?.unitPrice) || 0
      );
      allValues.portDues[0].price = parseFloat(newPortDues.toFixed(2));
      allValues.portDues[0].remarks = `Basis ${allValues.portDues[0]?.units} Units @ ${allValues.portDues[0]?.unitPrice} Per Unit`;
    }

    if (
      changedValues.pilotage?.[0]?.hours !== undefined ||
      changedValues.pilotage?.[0]?.hourlyRate !== undefined
    ) {
      newPilotage = calculateUnitsWithUnitPrice(
        Number(allValues.pilotage[0]?.hours) || 0,
        Number(allValues.pilotage[0]?.hourlyRate) || 0
      );
      allValues.pilotage[0].price = parseFloat(newPilotage.toFixed(2));
      allValues.pilotage[0].remarks = `Basis ${allValues.pilotage[0]?.hours} Hours @ ${allValues.pilotage[0]?.hourlyRate} Per Hour`;
    }

    if (
      changedValues.serviceLaunch?.[0]?.trips !== undefined ||
      changedValues.serviceLaunch?.[0]?.hourlyRate !== undefined
    ) {
      newServiceLaunch = calculateUnitsWithUnitPrice(
        Number(allValues.serviceLaunch[0]?.trips) || 0,
        Number(allValues.serviceLaunch[0]?.hourlyRate) || 0
      );
      allValues.serviceLaunch[0].price = parseFloat(
        newServiceLaunch.toFixed(2)
      );
      allValues.serviceLaunch[0].remarks = `Estimated Basis ${allValues.serviceLaunch[0]?.trips} Trips`;
    }
    console.log(allValues, "all");
    console.log(changedValues, "changed");

    if (
      changedValues.towage?.[0]?.tugRate !== undefined ||
      changedValues.towage?.[0]?.tugs !== undefined ||
      changedValues.towage?.[0]?.hours !== undefined ||
      changedValues.towage?.[0]?.bafRate !== undefined
    ) {
      newTowage =
        Number(allValues.towage[0]?.tugRate || 0) *
        Number(allValues.towage[0]?.tugs || 0) *
        Number(allValues.towage[0]?.hours || 0) *
        Number((allValues.towage[0]?.bafRate || 0) / 100 + 1);
      allValues.towage[0].price = parseFloat(newTowage.toFixed(2));
      allValues.towage[0].remarks = `Estimated Basis SGD ${allValues.towage[0]?.tugRate}/Tug/Hr x ${allValues.towage[0]?.tugs} Tugs x ${allValues.towage[0]?.hours} Hrs + ${allValues.towage[0]?.bafRate} % BAF`;
    }

    const dynamicFieldsTotal = (allValues.dynamicFields || []).reduce(
      (total: number, field: { price: number }) =>
        total + Number(field.price || 0),
      0
    );

    const estimatedTotal =
      (Number(allValues.portDues[0]?.price) || 0) +
      (Number(allValues.pilotage[0]?.price) || 0) +
      (Number(allValues.serviceLaunch[0]?.price) || 0) +
      (Number(allValues.towage[0]?.price) || 0) +
      (Number(allValues.mooring[0]?.price) || 0) +
      (Number(allValues.agencyFee[0]?.price) || 0) +
      dynamicFieldsTotal;

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
                Editt
              </Button>
            )}
            {(invoiceData || displayPDF) && (
              <PDFDownloadLink
                document={
                  <TestDemo_InvoicePDF
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
                  <TestDemo_InvoicePDF
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
            <img
              src={InvoiceImage}
              alt="Company Logo"
              style={{ width: "100px", height: "auto", objectFit: "contain" }}
            />
          </div>
          <BluShipping_InvoiceForm
            form={form}
            selectedShipment={selectedShipment}
            invoiceData={invoiceData}
            invoiceFeesData={invoiceFeesData}
            terminalName={terminalName}
            isEditing={isEditing}
            onValuesChange={onValuesChange}
          />
        </Card>
      </Card>
    </Layout>
  );
};

export default TestDemoInvoicing;
