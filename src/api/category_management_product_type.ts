import { ProductType, ProductTypeResponse } from "../types";
import { BACKEND_URL } from "../config";

const CATEGORY_MANAGEMENT_PRODUCT_TYPE_URL = `${BACKEND_URL}category_management/product_type`;

// Get all product types
export const getAllProductTypes = async (): Promise<ProductTypeResponse[]> => {
  const response = await fetch(CATEGORY_MANAGEMENT_PRODUCT_TYPE_URL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data.product_types;
};

// Get all product types
export const getAllOnlySubProductTypes = async (): Promise<string[]> => {
  const response = await fetch(
    `${CATEGORY_MANAGEMENT_PRODUCT_TYPE_URL}/only_sub_products`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  console.log(data);
  return data.only_sub_product_types;
};

// Create a new product type
export const createProductType = async (
  payload: ProductType
): Promise<void> => {
  const response = await fetch(CATEGORY_MANAGEMENT_PRODUCT_TYPE_URL, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
};

// Create a new product type
export const updateProductType = async (
  id: string,
  product_type: ProductType
): Promise<void> => {
  const response = await fetch(
    `${CATEGORY_MANAGEMENT_PRODUCT_TYPE_URL}/${id}`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(product_type),
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }
};

// Delete a product type by ID
export const deleteProductType = async (id: string): Promise<void> => {
  const response = await fetch(
    `${CATEGORY_MANAGEMENT_PRODUCT_TYPE_URL}/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }
};
