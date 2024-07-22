export interface InvoicePricing {
  tenant: string;
  shipment_id: string;
  invoice_pricing_details: { [key: string]: string };
}

export interface InvoicePricingResponse {
  ID: string;
  tenant: string;
  shipment_id: string;
  invoice_pricing_details: { [key: string]: string };
}

export interface InvoiceFees {
  agencyFee: {
    fees: number;
  };
  cargo_operations: {
    [key: string]: number;
  };
  bunkering: {
    [key: string]: number;
  };
  mooring: {
    [key: string]: number;
  };
  pilotage: {
    max: number;
    min: number;
    value: number;
  }[];
  serviceLaunch: {
    [key: string]: number;
  };
  towage: {
    [key: string]: number;
  };
}

export interface GetInvoiceFeesFromPortAuthorityResponse {
  invoiceFees: InvoiceFees;
  tenant: string;
}
