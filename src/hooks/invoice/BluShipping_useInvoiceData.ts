import { useState, useEffect } from "react";
import { FormInstance } from "antd";
import {
  getInvoiceById,
  getInvoiceFeesFromPortAuthority,
  getCustomerByName,
} from "../../api";
import {
  GetInvoiceFeesFromPortAuthorityResponse,
  CustomerResponse,
  ShipmentResponse,
  InvoicePricingResponse,
} from "../../types";
import getLatestETD, {
  formatDateToLocalString,
} from "../../utils/dateTimeUtils";
import getPilotageFees from "../../utils/invoice";

const useInvoiceData = (
  selectedShipment: ShipmentResponse,
  form: FormInstance
) => {
  const [invoiceFeesData, setInvoiceFeesData] =
    useState<GetInvoiceFeesFromPortAuthorityResponse | null>(null);
  const [customerData, setCustomerData] = useState<CustomerResponse | null>(
    null
  );
  const [invoiceData, setInvoiceData] = useState<InvoicePricingResponse | null>(
    null
  );
  const [hasExistingInvoice, setHasExistingInvoice] = useState(false);
  const [terminalName, setTerminalName] = useState("");

  const [tenantInformation, setTenantInformation] = useState<
    string | undefined
  >(undefined);

  const fetchInvoiceData = async () => {
    try {
      console.log("fetching");
      const fetchedInvoiceFeesData = await getInvoiceFeesFromPortAuthority();
      setInvoiceFeesData(fetchedInvoiceFeesData);
      setTenantInformation(fetchedInvoiceFeesData.tenant);

      const customerName =
        selectedShipment.shipment_type.bunkering?.bunkering_activity?.[0]
          ?.customer_name ||
        selectedShipment.shipment_type.cargo_operations
          ?.cargo_operations_activity?.[0]?.customer_name ||
        "";

      if (customerName) {
        const customerDataByName = await getCustomerByName(customerName);
        setCustomerData(customerDataByName);
      }

      const invoiceData = await getInvoiceById(selectedShipment.ID);
      if (invoiceData && Object.keys(invoiceData).length > 0) {
        form.setFieldsValue(invoiceData.invoice_pricing_details);
        setHasExistingInvoice(true);
        setInvoiceData(invoiceData);
        console.log("settingg");
      } else {
        setHasExistingInvoice(false);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [selectedShipment, form]);

  useEffect(() => {
    if (invoiceFeesData) {
      const latestETD = getLatestETD(selectedShipment);
      const pilotageFees = getPilotageFees(
        invoiceFeesData.invoiceFees.pilotage,
        selectedShipment
      );

      const pilotageDefaultHours = 7;
      const serviceLaunchDefaultTrips = 2;
      const towageDefaultBafPercentRate = 5;

      const cargoOperationsActivity =
        selectedShipment.shipment_type.cargo_operations
          ?.cargo_operations_activity;
      const terminalName =
        cargoOperationsActivity && cargoOperationsActivity.length > 0
          ? cargoOperationsActivity[0].terminal_name
          : "default";
      setTerminalName(terminalName);
      form.setFieldsValue({
        bank_name: invoiceFeesData.invoiceFees.invoice_bank_details.bank_name,
        swift_code: invoiceFeesData.invoiceFees.invoice_bank_details.swift_code,
        bank_address:
          invoiceFeesData.invoiceFees.invoice_bank_details.bank_address,
        payable_to: invoiceFeesData.invoiceFees.invoice_bank_details.payable_to,
        bank_code: invoiceFeesData.invoiceFees.invoice_bank_details.bank_code,
        account_number:
          invoiceFeesData.invoiceFees.invoice_bank_details.account_number,
        tenant_address:
          invoiceFeesData.invoiceFees.invoice_bank_details.tenant_address,
        tenant_telephone:
          invoiceFeesData.invoiceFees.invoice_bank_details.tenant_telephone,
        tenant_fax: invoiceFeesData.invoiceFees.invoice_bank_details.tenant_fax,
        tenant_hp: invoiceFeesData.invoiceFees.invoice_bank_details.tenant_hp,
        tenant_email:
          invoiceFeesData.invoiceFees.invoice_bank_details.tenant_email,
        agency_fee_price: invoiceFeesData.invoiceFees.agency_fee.fees,
        mooring_price: invoiceFeesData.invoiceFees.mooring[terminalName],
        pilotage_hourlyRate: pilotageFees,
        pilotage_hours: pilotageDefaultHours,
        pilotage_price: pilotageFees * pilotageDefaultHours,
        pilotage_remarks: `Basis ${pilotageDefaultHours} Hours @ ${pilotageFees} Per Hour`,
        service_launch_trips: serviceLaunchDefaultTrips,
        service_launch_hourlyRate:
          invoiceFeesData.invoiceFees.service_launch["hourlyRate"],
        service_launch_price:
          serviceLaunchDefaultTrips *
          invoiceFeesData.invoiceFees.service_launch["hourlyRate"],
        service_launch_remarks: `Estimated Basis ${serviceLaunchDefaultTrips} Trips`,
        towage_bafRate: towageDefaultBafPercentRate,
        towage_remarks: `Estimated Basis SGD /Tug/Hr x  Tugs x  Hrs +  % 5 BAF`,
        mooring_remarks: `Estimated Basis Universal Terminal Tariff`,
        contactNumber: customerData?.contact,
        email: customerData?.email,
        eta: formatDateToLocalString(selectedShipment.ETA),
        etd: formatDateToLocalString(latestETD.toISOString()),
      });

      const etaDate = new Date(selectedShipment.ETA);
      const numOfDaysShipmentStayed = Math.ceil(
        (latestETD.getTime() - etaDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      // https://www.mpa.gov.sg/finance-e-services/tariff-fees-and-charges/ocean-going-vesselsBasis
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
        const bunkeringPortDuesPrice =
          invoiceFeesData.invoiceFees.bunkering[numOfDaysShipmentStayed];
        form.setFieldsValue({
          port_dues_units: sizeOfVessel,
          port_dues_price: bunkeringPortDuesPrice * sizeOfVessel,
          port_dues_unitPrice: bunkeringPortDuesPrice,
          port_dues_remarks: `Basis ${sizeOfVessel} Units @ ${bunkeringPortDuesPrice?.toFixed(
            2
          )} Per Unit`,
        });
      }

      if (
        selectedShipment.shipment_type.bunkering.bunkering &&
        selectedShipment.shipment_type.cargo_operations.cargo_operations
      ) {
        const bunkeringPortDuesPrice =
          invoiceFeesData.invoiceFees.bunkering[numOfDaysShipmentStayed];
        form.setFieldsValue({
          port_dues_units: sizeOfVessel,
          port_dues_price: bunkeringPortDuesPrice * sizeOfVessel,
          port_dues_unitPrice: bunkeringPortDuesPrice,
          port_dues_remarks: `Basis ${sizeOfVessel} Units @ ${bunkeringPortDuesPrice?.toFixed(
            2
          )} Per Unit`,
        });
      }
    }
  }, [invoiceFeesData, customerData, selectedShipment, form]);

  return {
    invoiceFeesData,
    customerData,
    hasExistingInvoice,
    tenantInformation,
    invoiceData,
    terminalName,
    fetchInvoiceData, // Return fetchInvoiceData function
  };
};

export default useInvoiceData;
