export interface InvoicePricing {
  tenant: string;
  shipment_id: string;
  invoice_pricing_details: { [key: string]: string };
  created_at: string;
}

export interface InvoicePricingResponse {
  ID: string;
  tenant: string;
  shipment_id: string;
  invoice_pricing_details: { [key: string]: string };
  created_at: string;
  updated_at: string;
}

export interface InvoiceFees {
  agency_fee: {
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
  service_launch: {
    [key: string]: number;
  };
  towage: {
    [key: string]: number;
  };
  invoice_bank_details: {
    [key: string]: string;
  };
}

export interface GetInvoiceFeesFromPortAuthorityResponse {
  invoiceFees: InvoiceFees;
  tenant: string;
}

export interface GetInvoiceTenantResponse {
  tenant: string;
}
