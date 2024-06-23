import React from "react";
import { Form, Input, Select, Button, AutoComplete } from "antd";
import { validateInteger, validateFloat } from "../../utils/validationUtils";

const { Option } = Select;

const quantityCodes = [
  { code: "KB", unit: "Kilo Barrels" },
  { code: "MT", unit: "Metric Tonnes" },
];

interface QuantityInputProps {
  form: any;
  name: number;
  subProductTypes: string[];
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  form,
  name,
  subProductTypes,
}) => {
  return (
    <Form.List name={[name, "shipment_product"]}>
      {(productFields, { add: addProduct, remove: removeProduct }) => (
        <div>
          {productFields.map((productField, index) => (
            <div
              key={productField.key}
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <Form.Item
                {...productField}
                name={[productField.name, "sub_product_type"]}
                label="Product"
                style={{ flex: 1, marginRight: 8 }}
              >
                <AutoComplete
                  options={subProductTypes.map((pt) => ({
                    value: pt,
                  }))}
                  style={{ width: "100%" }}
                  placeholder="Start typing to search"
                  filterOption={(inputValue, option) =>
                    option!.value
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                />
              </Form.Item>
              <Form.Item
                {...productField}
                name={[productField.name, "quantityCode"]}
                noStyle
                initialValue={quantityCodes[0].code} // Ensure initial value is set here as well
                rules={[
                  {
                    required: true,
                    message: "Please select the Quantity Code!",
                  },
                ]}
              >
                <Select
                  style={{ width: "30%", marginRight: 8 }}
                  placeholder="Unit"
                >
                  {quantityCodes.map(({ code, unit }) => (
                    <Option key={code} value={code}>
                      {`${unit} (${code})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                {...productField}
                name={[productField.name, "quantity"]}
                noStyle
                rules={[
                  { required: true, message: "Please input the Quantity!" },
                  { validator: validateInteger },
                ]}
              >
                <Input
                  style={{ width: "40%", marginRight: 8 }}
                  placeholder="Quantity"
                />
              </Form.Item>
              <Form.Item
                {...productField}
                name={[productField.name, "percentage"]}
                noStyle
                rules={[
                  { required: true, message: "Please input the Percentage!" },
                  { validator: validateFloat },
                ]}
              >
                <Input
                  style={{ width: "30%", marginRight: 8 }}
                  placeholder="Enter %"
                  prefix="±"
                />
              </Form.Item>
              <Button
                onClick={() => removeProduct(productField.name)}
                type="dashed"
                style={{ marginBottom: 16 }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="dashed"
            onClick={() => addProduct()}
            block
            style={{ marginBottom: 16 }}
          >
            Add Product
          </Button>
        </div>
      )}
    </Form.List>
  );
};

export default QuantityInput;
