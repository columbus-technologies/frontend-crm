export interface SubProduct {
  sub_product: string;
}

export interface Product {
  product: string;
  sub_products: SubProduct[];
}

// export interface QuantityDimensions {
//   KG: number;
//   G: number;
// }

export interface ShipmentProduct {
  products: Product[];
  quantity: number;
  dimensions: string;
  percentage: number;
}
