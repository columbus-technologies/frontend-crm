import React from "react";

interface ProductTypesProps {
  productType: string;
  subProductsType: string[];
}

const ProductTypes: React.FC<ProductTypesProps> = ({
  productType,
  subProductsType,
}) => {
  return (
    <div>
      <p>
        <strong>Product:</strong> {productType}
      </p>
      {subProductsType.map((subProduct, index) => (
        <p key={index} style={{ marginLeft: "20px" }}>
          <strong>Sub Product:</strong> {subProduct}
        </p>
      ))}
    </div>
  );
};

export default ProductTypes;