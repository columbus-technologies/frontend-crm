import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { InvoicePricing, ShipmentResponse } from "../../types";
import InvoiceImage from "../../assets/bluShipping.png";
import Arial from "../../assets/fonts/Arial.ttf";
import ArialBold from "../../assets/fonts/Arial_Bold.ttf";

interface InvoicePDFProps {
  selectedShipment: ShipmentResponse;
  invoicePricing: InvoicePricing;
  invoiceType: string;
}

// Register Arial font
Font.register({
  family: "Arial",
  fonts: [
    { src: Arial, fontWeight: "normal" },
    { src: ArialBold, fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Arial",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    fontFamily: "Arial",
  },
  boldText: {
    fontSize: 10,
    marginBottom: 5,
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoColumn: {
    flexDirection: "column",
    flex: 1,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    marginBottom: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 5,
    fontSize: 12,
  },
  tableCell: {
    flex: 2,
    textAlign: "left",
    paddingRight: 5,
  },
  tableCellPrice: {
    flex: 1,
    textAlign: "right",
    paddingRight: 0,
  },
  tableCellRight: {
    flex: 3,
    textAlign: "right",
    paddingRight: 5,
  },
  totalSection: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 5,
  },
  totalText: {
    flex: 1,
    textAlign: "left",
    fontWeight: "bold",
  },
  totalAmount: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
  image: {
    width: 150,
    height: 75,
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
});

const BluShipping_InvoicePDF: React.FC<InvoicePDFProps> = ({
  selectedShipment,
  invoicePricing,
  invoiceType,
}) => {
  // Parse dynamicFields
  // const dynamicFields = JSON.parse(
  //   invoicePricing.invoice_pricing_details.dynamicFields || "[]"
  // );
  // Parse the fields
  const portDues = JSON.parse(
    invoicePricing.invoice_pricing_details.portDues || "[]"
  );
  const pilotage = JSON.parse(
    invoicePricing.invoice_pricing_details.pilotage || "[]"
  );
  const serviceLaunch = JSON.parse(
    invoicePricing.invoice_pricing_details.serviceLaunch || "[]"
  );
  const towage = JSON.parse(
    invoicePricing.invoice_pricing_details.towage || "[]"
  );
  const mooring = JSON.parse(
    invoicePricing.invoice_pricing_details.mooring || "[]"
  );
  const agencyFee = JSON.parse(
    invoicePricing.invoice_pricing_details.agencyFee || "[]"
  );
  const dynamicFields = JSON.parse(
    invoicePricing.invoice_pricing_details.dynamicFields || "[]"
  );
  // // Combine static and dynamic fields with numbering
  // const allFields = [
  //   { label: "Port Dues", value: "port_dues" },
  //   { label: "Pilotage", value: "pilotage" },
  //   { label: "Service Launch", value: "service_launch" },
  //   { label: "Towage", value: "towage" },
  //   { label: "Mooring", value: "mooring" },
  //   { label: "Agency Fee", value: "agency_fee" },
  //   ...dynamicFields.map((field: any, index: number) => ({
  //     label: `Dynamic ${index + 1}`,
  //     value: `dynamic_${index}`,
  //     description: field.description,
  //     price: field.price,
  //   })),
  // ];

  // Combine static and dynamic fields with numbering
  const allFields = [
    ...portDues.map((field: any, index: number) => ({
      label: `Port Dues`,
      description: field.description,
      price: field.price,
      remarks: field.remarks,
    })),
    ...pilotage.map((field: any, index: number) => ({
      label: `Pilotage`,
      description: field.description,
      price: field.price,
      remarks: field.remarks,
    })),
    ...serviceLaunch.map((field: any, index: number) => ({
      label: `Service Launch`,
      description: field.description,
      price: field.price,
      remarks: field.remarks,
    })),
    ...towage.map((field: any, index: number) => ({
      label: `Towage`,
      description: field.description,
      price: field.price,
      remarks: field.remarks,
    })),
    ...mooring.map((field: any, index: number) => ({
      label: `Mooring`,
      description: field.description,
      price: field.price,
      remarks: field.remarks,
    })),
    ...agencyFee.map((field: any, index: number) => ({
      label: `Agency Fee`,
      description: field.description,
      price: field.price,
      remarks: field.remarks,
    })),
    ...dynamicFields.map((field: any, index: number) => ({
      label: `Dynamic ${index + 1}`,
      description: field.description,
      price: field.price,
      remarks: field.remarks,
    })),
  ];

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image src={InvoiceImage} style={styles.image} />
        </View>
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text style={styles.text}>
              Name: {invoicePricing.invoice_pricing_details.customerName}
            </Text>
            <Text style={styles.text}>
              Fax: {invoicePricing.invoice_pricing_details.fax}
            </Text>
            <Text style={styles.text}>
              IMO Number: {selectedShipment.vessel_specifications.imo_number}
            </Text>
            <Text style={styles.text}>
              Vessel Name: {selectedShipment.vessel_specifications.vessel_name}
            </Text>
            <Text style={styles.text}>
              Voyage Number: {selectedShipment.voyage_number}
            </Text>
            <Text style={styles.text}>
              Call Sign: {selectedShipment.vessel_specifications.call_sign}
            </Text>
            <Text style={styles.text}>
              Location: {invoicePricing.invoice_pricing_details.location}
            </Text>
            <Text style={styles.text}>
              Purpose: {invoicePricing.invoice_pricing_details.purpose}
            </Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.text}>
              Contact Number:
              {invoicePricing.invoice_pricing_details.contactNumber}
            </Text>
            <Text style={styles.text}>
              Email: {invoicePricing.invoice_pricing_details.email}
            </Text>
            <Text style={styles.text}>
              GRT: {selectedShipment.vessel_specifications.grt}
            </Text>
            <Text style={styles.text}>
              NRT: {selectedShipment.vessel_specifications.nrt} metres
            </Text>
            <Text style={styles.text}>
              DWT: {selectedShipment.vessel_specifications.sdwt}
            </Text>
            <Text style={styles.text}>
              LOA: {selectedShipment.vessel_specifications.loa} metres
            </Text>
            <Text style={styles.text}>
              ETA:
              {new Date(
                invoicePricing.invoice_pricing_details.eta
              ).toLocaleString()}
            </Text>
            <Text style={styles.text}>
              ETD:
              {new Date(
                invoicePricing.invoice_pricing_details.etd
              ).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          {invoiceType === "PDA" ? (
            <Text style={styles.title}>Proforma Disbursement Account</Text>
          ) : (
            <Text style={styles.title}>Final Disbursement Account</Text>
          )}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Description</Text>
              <Text style={styles.tableCellPrice}>SGD Price</Text>
              <Text style={styles.tableCellRight}>Remarks</Text>
            </View>
            {allFields.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>
                  {index + 1}. {item.description || item.label}
                </Text>
                <Text style={styles.tableCellPrice}>${item.price}</Text>
                <Text style={styles.tableCellRight}>{item.remarks || ""}</Text>
              </View>
            ))}
          </View>
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Estimated Total SGD:</Text>
            {/* <Text style={styles.totalAmount}>
              $
              {parseFloat(
                invoicePricing.invoice_pricing_details.port_dues_price
              ) +
                parseFloat(
                  invoicePricing.invoice_pricing_details.pilotage_price
                ) +
                parseFloat(
                  invoicePricing.invoice_pricing_details.service_launch_price
                ) +
                parseFloat(
                  invoicePricing.invoice_pricing_details.towage_price
                ) +
                parseFloat(
                  invoicePricing.invoice_pricing_details.mooring_price
                ) +
                parseFloat(
                  invoicePricing.invoice_pricing_details.agency_fee_price
                ) +
                dynamicFields.reduce(
                  (acc: number, field: any) => acc + parseFloat(field.price),
                  0
                )}
            </Text> */}
            <Text style={styles.totalAmount}>
              $
              {allFields.reduce(
                (acc, field) => acc + parseFloat(field.price || 0),
                0
              )}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Banking Details</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ columnGap: 0 }}>
              <Text style={styles.text}>Bank Name:</Text>
              <Text style={styles.text}>Swift Code:</Text>
              <Text style={styles.text}>Bank Address:</Text>
              <Text style={styles.text}>Payable To:</Text>
              <Text style={styles.text}>Bank Code:</Text>
              <Text style={styles.text}>Account Number:</Text>
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.boldText}>
                {invoicePricing.invoice_pricing_details.bank_name}
              </Text>
              <Text style={styles.boldText}>
                {invoicePricing.invoice_pricing_details.swift_code}
              </Text>
              <Text style={styles.boldText}>
                {invoicePricing.invoice_pricing_details.bank_address}
              </Text>
              <Text style={styles.boldText}>
                {invoicePricing.invoice_pricing_details.payable_to}
              </Text>
              <Text style={styles.boldText}>
                {invoicePricing.invoice_pricing_details.bank_code}
              </Text>
              <Text style={styles.boldText}>
                {invoicePricing.invoice_pricing_details.account_number}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.boldText}>
                Address: {invoicePricing.invoice_pricing_details.tenant_address}
              </Text>
              <Text style={styles.boldText}>
                Tel: {invoicePricing.invoice_pricing_details.tenant_telephone}
              </Text>
              <Text style={styles.boldText}>
                Fax: {invoicePricing.invoice_pricing_details.tenant_fax}
              </Text>
              <Text style={styles.boldText}>
                HP: {invoicePricing.invoice_pricing_details.tenant_hp}
              </Text>
              <Text style={styles.boldText}>
                Email: {invoicePricing.invoice_pricing_details.tenant_email}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BluShipping_InvoicePDF;
