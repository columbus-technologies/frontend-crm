export interface ProductType {
  product_type: string;
  sub_products_type: string[];
}

export interface ProductTypeResponse {
  ID: string;
  product_type: string;
  sub_products_type: string[];
}

export interface OnlySubProductTypesResponse {
  only_sub_product_types: string[];
}
