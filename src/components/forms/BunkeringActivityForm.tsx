import React from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  AutoComplete,
  Row,
  Col,
  Radio,
  Divider,
} from "antd";
import InputWithUnit from "../common/InputWithUnit";
import { validateFloat } from "../../utils/validationUtils";

interface BunkeringActivityFormProps {
  form: any;
  productTypes: string[];
  subProductTypes: { [key: string]: string[] };
  filteredSubProductTypes: { [key: string]: string[] };
  handleBunkeringIntakeProductTypeChange: (
    value: string,
    index: number
  ) => void;
  handleBunkeringHoseProductTypeChange: (value: string, index: number) => void;
  handleBunkeringSubProductTypeSearch: (value: string, index: number) => void;
  terminalLocations: string[];
  customerNames: string[];
  activityTypes: string[];
}

const BunkeringActivityForm: React.FC<BunkeringActivityFormProps> = ({
  form,
  productTypes,
  subProductTypes,
  filteredSubProductTypes,
  handleBunkeringIntakeProductTypeChange,
  handleBunkeringHoseProductTypeChange,
  handleBunkeringSubProductTypeSearch,
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
          freeboard: null,
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
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "supplier"]}
                    label="Supplier"
                  >
                    <Input placeholder="Supplier" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "supplier_contact"]}
                    label="Contact"
                  >
                    <Input placeholder="Contact" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "supplier_email"]}
                    label="Email"
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "appointed_surveyor"]}
                    label="Appointed Surveyor"
                  >
                    <Input placeholder="Appointed Surveyor" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "supplier_vessel"]}
                    label="Supplier Vessel"
                  >
                    <Input placeholder="Supplier Vessel" />
                  </Form.Item>
                </Col>
                <Col span={8}>
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
                </Col>
              </Row>
              <Divider />
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "bunker_intake_product", "product_type"]}
                    label="Bunker Intake"
                  >
                    <AutoComplete
                      options={productTypes.map((pt) => ({
                        value: pt,
                      }))}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleBunkeringIntakeProductTypeChange(value, key)
                      }
                      placeholder="Start typing to search"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "bunker_intake_product", "sub_products_type"]}
                    label="Bunker Intake Sub-Product"
                  >
                    <AutoComplete
                      options={
                        filteredSubProductTypes[key]?.map((spt) => ({
                          value: spt,
                        })) || []
                      }
                      style={{ width: "100%" }}
                      onSearch={(value) =>
                        handleBunkeringSubProductTypeSearch(value, key)
                      }
                      placeholder="Start typing to search"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "bunker_intake_product", "quantity"]}
                    label="Quantity"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit unit="m^3" placeholder="Enter quantity" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "bunker_hose_product", "product_type"]}
                    label="Bunker Hose"
                  >
                    <AutoComplete
                      options={productTypes.map((pt) => ({
                        value: pt,
                      }))}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleBunkeringHoseProductTypeChange(value, key)
                      }
                      placeholder="Start typing to search"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "bunker_hose_product", "sub_products_type"]}
                    label="Bunker Hose Sub-Product"
                  >
                    <AutoComplete
                      options={
                        filteredSubProductTypes[key]?.map((spt) => ({
                          value: spt,
                        })) || []
                      }
                      style={{ width: "100%" }}
                      onSearch={(value) =>
                        handleBunkeringSubProductTypeSearch(value, key)
                      }
                      placeholder="Start typing to search"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "bunker_hose_product", "quantity"]}
                    label="Quantity"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit unit="inches" placeholder="Enter quantity" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
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
                      placeholder="Enter readiness"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "etb"]}
                    label="ETB"
                    rules={[
                      { required: true, message: "Please input the ETB!" },
                    ]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:00" }}
                      format="YYYY-MM-DD HH:00"
                      placeholder="Enter ETB"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "etd"]}
                    label="ETD"
                    rules={[
                      { required: true, message: "Please input the ETD!" },
                    ]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:00" }}
                      format="YYYY-MM-DD HH:00"
                      placeholder="Enter ETD"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "freeboard"]}
                    label="Freeboard"
                    rules={[{ validator: validateFloat }]}
                  >
                    <InputWithUnit unit="m" placeholder="Enter quantity" />
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
