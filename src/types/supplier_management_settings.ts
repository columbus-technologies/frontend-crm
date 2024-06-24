export interface SupplierSpecifications {
  name: string;
  email: string;
  vessel: string;
  contact: number;
}

export interface SupplierResponse {
  ID: string;
  supplier_specifications: SupplierSpecifications;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  supplier_specifications: SupplierSpecifications;
}
