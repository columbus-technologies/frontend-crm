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
import SupplierFormAutoComplete from "../forms/SupplierSettingsFormAutoComplete";

interface BunkeringActivityFormProps {
  form: any;
  subProductTypes: string[];
  terminalLocations: string[];
  customerNames: string[];
  activityTypes: string[];
}

const BunkeringActivityForm: React.FC<BunkeringActivityFormProps> = ({
  form,
  subProductTypes,
  customerNames,
}) => (
  <Form
    form={form}
    layout="vertical"
    name="bunkering_activity"
    initialValues={{
      bunkering_activity: [],
    }}
  >
    <Form.List name="bunkering_activity">
      {(fields, { add, remove }) => (
        <>
          {fields.length === 0 && (
            <Button
              type="dashed"
              onClick={() => add()}
              block
              style={{ marginBottom: 16 }}
            >
              Add Bunkering Activity
            </Button>
          )}

          {fields.map(({ key, name, ...restField }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <SupplierFormAutoComplete form={form} />
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "appointed_surveyor"]}
                    label="Appointed Surveyor"
                    rules={[
                      { required: true, message: "Please input surveyor!" },
                    ]}
                  >
                    <Input placeholder="Appointed Surveyor" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "supplier_vessel"]}
                    label="Supplier Vessel"
                    rules={[{ required: true, message: "Please input barge!" }]}
                  >
                    <Input placeholder="Supplier Vessel" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "customer_name"]}
                    label="Customer"
                    rules={[
                      { required: true, message: "Please input customer!" },
                    ]}
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
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "docking"]}
                    label="Docking"
                    rules={[{ required: true, message: "Please select!" }]}
                  >
                    <Radio.Group>
                      <Radio value="starboard">Starboard</Radio>
                      <Radio value="port">Port</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Form.List name={[name, "bunker_intake_specifications"]}>
                {(specFields, { add: addSpec, remove: removeSpec }) => (
                  <>
                    {specFields.map((specField) => (
                      <Row key={specField.key} gutter={16}>
                        <Col span={6}>
                          <Form.Item
                            {...specField}
                            name={[specField.name, "sub_product_type"]}
                            label="Bunker Intake Sub-Product"
                            rules={[
                              { required: true, message: "Please select!" },
                            ]}
                          >
                            <AutoComplete
                              options={subProductTypes.map((spt) => ({
                                value: spt,
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
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...specField}
                            name={[specField.name, "maximum_quantity_intake"]}
                            label="Maximum Quantity Intake"
                            rules={[{ validator: validateFloat }]}
                          >
                            <InputWithUnit
                              unit="m³/hr"
                              placeholder="Enter quantity intake"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...specField}
                            name={[specField.name, "maximum_hose_size"]}
                            label="Maximum Hose Size"
                            rules={[{ validator: validateFloat }]}
                          >
                            <InputWithUnit
                              unit="inches"
                              placeholder="Enter hose size"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Button
                            type="dashed"
                            onClick={() => removeSpec(specField.name)}
                            block
                          >
                            Remove Bunker Intake Specification
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => addSpec()}
                      block
                      style={{ marginBottom: 16 }}
                    >
                      Add Bunker Intake Specification
                    </Button>
                  </>
                )}
              </Form.List>
              <Row gutter={16}>
                <Col span={6}>
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
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Enter readiness"
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "etb"]}
                    label="ETB"
                    rules={[
                      { required: true, message: "Please input the ETB!" },
                    ]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Enter ETB"
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "etd"]}
                    label="ETD"
                    rules={[
                      { required: true, message: "Please input the ETD!" },
                    ]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
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
            </div>
          ))}
        </>
      )}
    </Form.List>
  </Form>
);

export default BunkeringActivityForm;
