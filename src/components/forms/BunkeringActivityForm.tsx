import React from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  AutoComplete,
  Row,
  Col,
  Select,
  Radio,
} from "antd";
import InputWithUnit from "../common/InputWithUnit";
import QuantityInput from "../common/QuantityInput";
import { validateFloat } from "../../utils/validationUtils";

interface BunkeringActivityFormProps {
  form: any;
  productTypes: string[];
  subProductTypes: { [key: string]: string[] };
  filteredSubProductTypes: { [key: string]: string[] };
  handleProductTypeChange: (value: string, index: number) => void;
  handleSubProductTypeSearch: (value: string, index: number) => void;
  terminalLocations: string[];
  customerNames: string[];
  activityTypes: string[];
}

const BunkeringActivityForm: React.FC<BunkeringActivityFormProps> = ({
  form,
  productTypes,
  subProductTypes,
  filteredSubProductTypes,
  handleProductTypeChange,
  handleSubProductTypeSearch,
  terminalLocations,
  customerNames,
  activityTypes,
}) => (
  <Form
    form={form}
    layout="vertical"
    name="bunkering_activity"
    initialValues={{
      bunkering_activity: [
        {
          supplier: "",
          supplier_contact: "",
          appointed_surveyor: "",
          docking: "",
          shipment_product: {
            product_type: "",
            sub_products_type: [""],
          },
          supplier_vessel: "",
          bunker_intake_product: {
            product_type: "",
            sub_products_type: [""],
            quantity: 0,
            dimensions: "",
            percentage: 0,
          },
          bunker_hose_product: {
            product_type: "",
            sub_products_type: [""],
            quantity: 0,
            dimensions: "",
            percentage: 0,
          },
          freeboard: 0,
          readiness: null,
          etb: null,
          etd: null,
        },
      ],
    }}
  >
    <Form.List name="bunkering_activity">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <Form.Item
                {...restField}
                name={[name, "supplier"]}
                label="Supplier"
              >
                <Input placeholder="Supplier" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "supplier_contact"]}
                label="Supplier Contact"
              >
                <Input placeholder="Supplier Contact" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "appointed_surveyor"]}
                label="Appointed Surveyor"
              >
                <Input placeholder="Appointed Surveyor" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "docking"]}
                label="Docking"
              >
                <Radio.Group>
                  <Radio value="starboard">Starboard</Radio>
                  <Radio value="port">Port</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "supplier_vessel"]}
                label="Supplier Vessel"
              >
                <Input placeholder="Supplier Vessel" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "readiness"]}
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
                name={[name, "etb"]}
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
                name={[name, "etd"]}
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
                name={[name, "bunker_intake_product", "product_type"]}
                label="Bunker Intake Product"
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
              <Form.List
                name={[name, "bunker_intake_product", "sub_products_type"]}
              >
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
                          label="Bunker Intake Sub Product"
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
                              const activity =
                                form.getFieldValue("bunkering_activity");
                              if (
                                !activity[
                                  key
                                ].bunker_intake_product.sub_products_type.includes(
                                  value
                                )
                              ) {
                                activity[
                                  key
                                ].bunker_intake_product.sub_products_type.push(
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
                            const activity =
                              form.getFieldValue("bunkering_activity");
                            const subProducts =
                              activity[key].bunker_intake_product
                                .sub_products_type;
                            const subProductIndex = subProducts.indexOf(
                              form.getFieldValue([
                                "bunkering_activity",
                                key,
                                "bunker_intake_product",
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
              <Form.Item
                {...restField}
                name={[name, "bunker_hose_product", "product_type"]}
                label="Bunker Hose Product"
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
              <Form.List
                name={[name, "bunker_hose_product", "sub_products_type"]}
              >
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
                          label="Bunker Hose Sub Product"
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
                              const activity =
                                form.getFieldValue("bunkering_activity");
                              if (
                                !activity[
                                  key
                                ].bunker_hose_product.sub_products_type.includes(
                                  value
                                )
                              ) {
                                activity[
                                  key
                                ].bunker_hose_product.sub_products_type.push(
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
                            const activity =
                              form.getFieldValue("bunkering_activity");
                            const subProducts =
                              activity[key].bunker_hose_product
                                .sub_products_type;
                            const subProductIndex = subProducts.indexOf(
                              form.getFieldValue([
                                "bunkering_activity",
                                key,
                                "bunker_hose_product",
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
              <Form.Item label="Approx. Qty" style={{ marginBottom: 16 }}>
                <QuantityInput form={form} name={key} fieldKey={key} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[name, "freeboard"]}
                    label="Freeboard"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit unit="metres" placeholder="Freeboard" />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                onClick={() => remove(name)}
                type="dashed"
                style={{ marginBottom: 16 }}
                block
              >
                Remove Bunkering Activity
              </Button>
              <Button
                onClick={() => {
                  const values = form.getFieldsValue();
                  add(values.bunkering_activity[name]);
                }}
                type="dashed"
                style={{ marginBottom: 16 }}
                block
              >
                Duplicate Bunkering Activity
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={() => add()} block>
            Add Bunkering Activity
          </Button>
        </>
      )}
    </Form.List>
  </Form>
);

export default BunkeringActivityForm;
