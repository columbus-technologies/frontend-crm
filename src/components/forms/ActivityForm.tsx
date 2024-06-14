import React from "react";
import { Form, Input, DatePicker, Button, AutoComplete, Row, Col } from "antd";
import InputWithUnit from "../common/InputWithUnit";
import QuantityInput from "../common/QuantityInput";
import { validateFloat } from "../../utils/validationUtils";

const ActivityForm = ({
  form,
  productTypes,
  subProductTypes,
  filteredSubProductTypes,
  handleProductTypeChange,
  handleSubProductTypeSearch,
  terminalLocations, // Add terminal locations prop
  customerNames, // Add customer names prop
}: {
  form: any;
  productTypes: string[];
  subProductTypes: { [key: string]: string[] };
  filteredSubProductTypes: { [key: string]: string[] };
  handleProductTypeChange: (value: string, index: number) => void;
  handleSubProductTypeSearch: (value: string, index: number) => void;
  terminalLocations: string[]; // Add terminal locations prop
  customerNames: string[]; // Add customer names prop
}) => (
  <Form
    form={form}
    layout="vertical"
    name="activity"
    initialValues={{
      activity: [
        {
          activity_type: "",
          customer_specifications: {
            customer: "",
            company: "",
            email: "",
            contact: "",
          },
          anchorage_location: "",
          terminal_name: "",
          shipment_product: {
            product_type: "",
            sub_products_type: [""],
          },
          readiness: null,
          etb: null,
          etd: null,
        },
      ],
    }}
  >
    <Form.List name="activity">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <Form.Item
                {...restField}
                name={[name, "activity_type"]}
                label="Activity Type"
              >
                <Input placeholder="Activity Type" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "customer_specifications", "customer"]}
                label="Customer"
              >
                <AutoComplete
                  options={customerNames.map((customer) => ({
                    value: customer,
                  }))}
                  placeholder="Customer"
                  style={{ width: "100%" }}
                  filterOption={(inputValue, option) =>
                    option!.value
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "terminal_name"]}
                label="Terminal Name"
              >
                <AutoComplete
                  options={terminalLocations.map((location) => ({
                    value: location,
                  }))}
                  placeholder="Terminal Name"
                  style={{ width: "100%" }}
                  filterOption={(inputValue, option) =>
                    option!.value
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "Readiness"]}
                label="Readiness"
                rules={[
                  {
                    required: true,
                    message: "Please input the Readiness!",
                  },
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:00" }}
                  format="YYYY-MM-DD HH:00"
                  placeholder="Readiness"
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "ETB"]}
                label="ETB"
                rules={[{ required: true, message: "Please input the ETB!" }]}
              >
                <DatePicker
                  showTime={{ format: "HH:00" }}
                  format="YYYY-MM-DD HH:00"
                  placeholder="ETB"
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "ETD"]}
                label="ETD"
                rules={[{ required: true, message: "Please input the ETD!" }]}
              >
                <DatePicker
                  showTime={{ format: "HH:00" }}
                  format="YYYY-MM-DD HH:00"
                  placeholder="ETD"
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "shipment_product", "product_type"]}
                label="Product"
                style={{ flex: 1, marginRight: 8 }}
              >
                <AutoComplete
                  options={productTypes.map((pt) => ({
                    value: pt,
                  }))}
                  style={{ width: "100%" }}
                  onChange={(value) => handleProductTypeChange(value, key)}
                  placeholder="Start typing to search"
                />
              </Form.Item>
              <Form.List name={[name, "shipment_product", "sub_products_type"]}>
                {(subFields, { add: addSub, remove: removeSub }) => (
                  <div>
                    {subFields.map((subField) => (
                      <div
                        key={subField.key}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                        }}
                      >
                        <Form.Item
                          {...subField}
                          name={[subField.name]}
                          label="Sub Product"
                          style={{
                            flex: 1,
                            marginRight: 8,
                          }}
                        >
                          <AutoComplete
                            options={
                              filteredSubProductTypes[key]?.map((spt) => ({
                                value: spt,
                              })) || []
                            }
                            style={{ width: "100%" }}
                            onSearch={(value) =>
                              handleSubProductTypeSearch(value, key)
                            }
                            onSelect={(value) => {
                              const activity = form.getFieldValue("activity");
                              if (
                                !activity[
                                  key
                                ].shipment_product.sub_products_type.includes(
                                  value
                                )
                              ) {
                                activity[
                                  key
                                ].shipment_product.sub_products_type.push(
                                  value
                                );
                                form.setFieldsValue({ activity });
                              }
                            }}
                            placeholder="Start typing to search"
                          />
                        </Form.Item>
                        <Button
                          onClick={() => {
                            const activity = form.getFieldValue("activity");
                            const subProducts =
                              activity[key].shipment_product.sub_products_type;
                            const subProductIndex = subProducts.indexOf(
                              form.getFieldValue([
                                "activity",
                                key,
                                "shipment_product",
                                "sub_products_type",
                                subField.name,
                              ])
                            );
                            if (subProductIndex > -1) {
                              subProducts.splice(subProductIndex, 1);
                              form.setFieldsValue({ activity });
                            }
                            removeSub(subField.name);
                          }}
                        >
                          Remove Sub-Product
                        </Button>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => addSub()} block>
                      Add Sub-Product
                    </Button>
                  </div>
                )}
              </Form.List>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[
                      name,
                      "arrival_departure_information",
                      "arrival_displacement",
                    ]}
                    label="Arrival Displacement"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit
                      unit="tonnes"
                      placeholder="Arrival Displacement"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[
                      name,
                      "arrival_departure_information",
                      "departure_displacement",
                    ]}
                    label="Departure Displacement"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit
                      unit="tonnes"
                      placeholder="Departure Displacement"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[
                      name,
                      "arrival_departure_information",
                      "arrival_draft",
                    ]}
                    label="Arrival Draft"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit unit="metres" placeholder="Arrival Draft" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[
                      name,
                      "arrival_departure_information",
                      "departure_draft",
                    ]}
                    label="Departure Draft"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit
                      unit="metres"
                      placeholder="Departure Draft"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[
                      name,
                      "arrival_departure_information",
                      "arrival_mast_height",
                    ]}
                    label="Arrival Mast Height"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit
                      unit="metres"
                      placeholder="Arrival Mast Height"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[
                      name,
                      "arrival_departure_information",
                      "departure_mast_height",
                    ]}
                    label="Departure Mast Height"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit
                      unit="metres"
                      placeholder="Departure Mast Height"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                onClick={() => remove(name)}
                type="dashed"
                style={{ marginBottom: 16 }}
                block
              >
                Remove Activity
              </Button>
              <Button
                onClick={() => {
                  const values = form.getFieldsValue();
                  add(values.activity[name]);
                }}
                type="dashed"
                style={{ marginBottom: 16 }}
                block
              >
                Duplicate Activity
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={() => add()} block>
            Add Activity
          </Button>
        </>
      )}
    </Form.List>
  </Form>
);

export default ActivityForm;
