import React, { useEffect, useState } from "react";
import { Input, Button, Tag, Divider, Form, message } from "antd";
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "../api";
import { ProductType, ProductTypeResponse } from "../types";

const CategoryManagementProductType: React.FC = () => {
  const [productTypes, setProductTypes] = useState<ProductTypeResponse[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [subInputValues, setSubInputValues] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const data = await getAllProductTypes();
        if (data === null) {
          setProductTypes([]);
        } else if (Array.isArray(data)) {
          setProductTypes(data);
        } else {
          message.error(
            "Failed to load product types - unexpected response format"
          );
        }
      } catch (error) {
        message.error("Failed to load product types");
      }
    };

    fetchProductTypes();
  }, []);

  const handleAddProductType = async () => {
    if (
      inputValue &&
      !productTypes.some((pt) => pt.product_type === inputValue)
    ) {
      const newProductType: ProductType = {
        product_type: inputValue,
        sub_products_type: [],
      };

      try {
        await createProductType(newProductType);
        const updatedProductTypes = await getAllProductTypes();
        setProductTypes(updatedProductTypes || []);
        setInputValue("");
        message.success("Product type added successfully");
      } catch (error) {
        message.error("Failed to add product type");
      }
    }
  };

  const handleRemoveProductType = async (id: string) => {
    try {
      await deleteProductType(id);
      const updatedProductTypes = await getAllProductTypes();
      setProductTypes(updatedProductTypes || []);
      message.success("Product type deleted successfully");
    } catch (error) {
      message.error("Failed to delete product type");
    }
  };

  const handleAddSubProductType = async (productType: string) => {
    const subInputValue = subInputValues[productType];
    if (subInputValue) {
      const productTypeIndex = productTypes.findIndex(
        (pt) => pt.product_type === productType
      );
      const updatedProductType = {
        ...productTypes[productTypeIndex],
        sub_products_type: [
          ...productTypes[productTypeIndex].sub_products_type,
          subInputValue,
        ],
      };

      try {
        await updateProductType(
          productTypes[productTypeIndex].ID,
          updatedProductType as ProductType
        );
        const updatedProductTypes = await getAllProductTypes();
        setProductTypes(updatedProductTypes || []);
        setSubInputValues((prev) => ({ ...prev, [productType]: "" }));
        message.success("Sub-product type added successfully");
      } catch (error) {
        message.error("Failed to add sub-product type");
      }
    }
  };

  const handleRemoveSubProductType = async (
    productType: string,
    subProductType: string
  ) => {
    const productTypeIndex = productTypes.findIndex(
      (pt) => pt.product_type === productType
    );
    const updatedProductType = {
      ...productTypes[productTypeIndex],
      sub_products_type: productTypes[
        productTypeIndex
      ].sub_products_type.filter((sp) => sp !== subProductType),
    };

    try {
      await updateProductType(
        productTypes[productTypeIndex].ID,
        updatedProductType as ProductType
      );
      const updatedProductTypes = await getAllProductTypes();
      setProductTypes(updatedProductTypes || []);
      message.success("Sub-product type removed successfully");
    } catch (error) {
      message.error("Failed to remove sub-product type");
    }
  };

  return (
    <div>
      <h1>Category Management</h1>
      <p>
        Information added here will be reflected under the Product and Product
        Sub-Type field when creating a new shipment.
      </p>
      <Divider />
      <h2>Product Types</h2>

      <Form layout="inline" onFinish={handleAddProductType}>
        <Form.Item>
          <Input
            placeholder="Press Enter to add"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddProductType}>
            Add
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      {productTypes.map((pt) => (
        <div key={pt.ID} style={{ marginBottom: "20px" }}>
          <h3>
            {pt.product_type}{" "}
            <Button
              type="link"
              danger
              onClick={() => handleRemoveProductType(pt.ID)}
            >
              Remove
            </Button>
          </h3>

          <p>Select this product to start adding sub-product types.</p>
          <div style={{ marginBottom: "10px" }}>
            {pt.sub_products_type.map((sp) => (
              <Tag
                key={sp}
                closable
                onClose={() => handleRemoveSubProductType(pt.product_type, sp)}
              >
                {sp}
              </Tag>
            ))}
          </div>
          <Form
            layout="inline"
            onFinish={() => handleAddSubProductType(pt.product_type)}
          >
            <Form.Item>
              <Input
                placeholder="Press Enter to add"
                value={subInputValues[pt.product_type] || ""}
                onChange={(e) =>
                  setSubInputValues((prev) => ({
                    ...prev,
                    [pt.product_type]: e.target.value,
                  }))
                }
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Form>
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default CategoryManagementProductType;
