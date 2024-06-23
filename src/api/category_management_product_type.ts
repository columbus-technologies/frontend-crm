import { prepareAuthHeaders } from "../utils/auth";
import {
  OnlySubProductTypesResponse,
  ProductType,
  ProductTypeResponse,
} from "../types";

const CATEGORY_MANAGEMENT_PRODUCT_TYPE_URL =
  "http://localhost:8080/category_management/product_type";

// Get all product types
export const getAllProductTypes = async (): Promise<ProductTypeResponse[]> => {
  const response = await fetch(CATEGORY_MANAGEMENT_PRODUCT_TYPE_URL, {
    method: "GET",
    headers: prepareAuthHeaders(),
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
      headers: prepareAuthHeaders(),
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
    headers: prepareAuthHeaders(),
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
      headers: prepareAuthHeaders(),
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
      headers: prepareAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }
};
