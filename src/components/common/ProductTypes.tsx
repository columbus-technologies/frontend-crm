import React from "react";
import { Product } from "../../types";

interface ProductTypesProps {
  products: Product[];
}

const ProductTypes: React.FC<ProductTypesProps> = ({ products }) => {
  return (
    <>
      {products.map((product, index) => (
        <div key={index}>
          <p>
            <strong>Product:</strong> {product.product}
          </p>
          {product.sub_products.map((subProduct, subIndex) => (
            <p key={subIndex} style={{ marginLeft: "20px" }}>
              <strong>Sub Product:</strong> {subProduct.sub_product}
            </p>
          ))}
        </div>
      ))}
    </>
  );
};

export default ProductTypes;
