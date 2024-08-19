import React from "react";
import {
  Form,
  DatePicker,
  Button,
  AutoComplete,
  Row,
  Col,
  Divider,
} from "antd";
import QuantityInput from "../common/QuantityInput";
import { validateFloat } from "../../utils/validationUtils";
import InputWithUnit from "../common/InputWithUnit";

interface CargoOperationsActivityFormProps {
  form: any;
  subProductTypes: string[];
  terminalLocations: string[];
  customerNames: string[];
  activityTypes: string[];
}

const CargoOperationsActivityForm: React.FC<
  CargoOperationsActivityFormProps
> = ({
  form,
  subProductTypes,
  terminalLocations,
  customerNames,
  activityTypes,
}) => (
  <Form
    form={form}
    layout="vertical"
    name="cargo_operations_activity"
    initialValues={{
      cargo_operations_activity: [],
    }}
  >
    <Form.List name="cargo_operations_activity">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <Form.Item
                {...restField}
                name={[name, "activity_type"]}
                label="Activity Type"
                rules={[
                  {
                    required: true,
                    message: "Please input the Activity Type!",
                  },
                ]}
              >
                <AutoComplete
                  options={activityTypes.map((activity) => ({
                    value: activity,
                  }))}
                  placeholder="Activity Type"
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
                name={[name, "customer_specifications", "customer"]}
                label="Customer"
                rules={[
                  {
                    required: true,
                    message: "Please input the Customer!",
                  },
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
              <Form.Item
                {...restField}
                name={[name, "terminal_name"]}
                label="Terminal Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the Terminal!",
                  },
                ]}
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
              <Divider />
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
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Readiness"
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
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="ETB"
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
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="ETD"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <QuantityInput
                form={form}
                name={name}
                subProductTypes={subProductTypes}
              />
              <Divider />
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
                Remove Cargo Operations Activity
              </Button>
              <Button
                onClick={() => {
                  const values = form.getFieldsValue();
                  add(values.cargo_operations_activity[name]);
                }}
                type="dashed"
                style={{ marginBottom: 16 }}
                block
              >
                Duplicate Cargo Operations Activity
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={() => add()} block>
            Add Cargo Operations Activity
          </Button>
        </>
      )}
    </Form.List>
  </Form>
);

export default CargoOperationsActivityForm;
