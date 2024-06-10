import React, { useEffect, useState } from "react";
import {
  Modal,
  Steps,
  Form,
  Input,
  Button,
  Checkbox,
  DatePicker,
  Select,
} from "antd";
import moment from "moment";
import { createShipment, getShipmentStatuses } from "../../api";
import InputWithUnit from "../common/InputWithUnit"; // Import the custom component
import { validateInteger, validateFloat } from "../../utils/validationUtils"; // Import validation functions
import QuantityInput from "../common/QuantityInput";
import VesselForm from "../forms/VesselSettingsForm";
import AgentForm from "../forms/AgentSettingsForm";
import VesselFormAutoComplete from "../forms/VesselSettingsFormAutoComplete";
import AgentFormAutoComplete from "../forms/AgentSettingsFormAutoComplete";

const { Step } = Steps;
const { Option } = Select;

interface MultiStepShipmentModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: () => void;
}

const MultiStepShipmentModal: React.FC<MultiStepShipmentModalProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [shipmentStatuses, setShipmentStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setCurrentStep(0);
      setFormValues({});
    }
  }, [visible, form]);

  useEffect(() => {
    // Fetch shipment statuses from the backend
    const fetchShipmentStatuses = async () => {
      try {
        const data = await getShipmentStatuses();
        setShipmentStatuses(data);
      } catch (error) {
        console.error("Failed to fetch shipment statuses:", error);
      }
    };

    fetchShipmentStatuses();
  }, []);

  const next = () => {
    form.validateFields().then((values) => {
      setFormValues({ ...formValues, ...values });
      setCurrentStep(currentStep + 1);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const now = moment().toISOString();
      const mergedValues = { ...formValues, ...values };
      console.log(mergedValues);
      const payload = {
        master_email: mergedValues.master_email || "",
        ETA: mergedValues.ETA ? mergedValues.ETA.toISOString() : now,
        voyage_number: mergedValues.voyage_number || "",
        current_status: mergedValues.current_status || "",
        shipment_type: mergedValues.shipment_type || {
          cargo_operations: false,
          bunkering: false,
          owner_matters: false,
        },
        vessel_specifications: {
          imo_number: parseInt(mergedValues?.imo_number, 10) || 0,
          vessel_name: mergedValues?.vessel_name || "",
          call_sign: mergedValues?.call_sign || "",
          sdwt: parseInt(mergedValues?.sdwt, 10) || 0,
          nrt: parseInt(mergedValues?.nrt, 10) || 0,
          flag: mergedValues?.flag || "",
          grt: parseInt(mergedValues?.grt, 10) || 0,
          loa: parseFloat(mergedValues?.loa) || 0,
        },
        shipment_details: {
          agent_details: {
            name: mergedValues?.name || "",
            email: mergedValues?.email || "",
            contact:
              mergedValues?.phoneCode + " " + mergedValues?.contact || "",
          },
        },
        activity: (mergedValues.activity && mergedValues.activity.length > 0
          ? mergedValues.activity
          : [{}]
        ).map((activity: any) => ({
          activity_type: activity.activity_type || "",
          customer_specifications: {
            customer: activity.customer_specifications?.customer || "",
            company: activity.customer_specifications?.company || "",
            email: activity.customer_specifications?.email || "",
            contact: activity.customer_specifications?.contact || "",
          },
          anchorage_location: activity.anchorage_location || "",
          terminal_location: activity.terminal_location || "",
          shipment_product: {
            product_type: activity.shipment_product?.products || "",
            sub_products_type: activity.shipment_product?.products || [],

            quantity: parseInt(activity.shipment_product?.quantity, 10) || -1,
            dimensions: activity.shipment_product?.quantityCode || "",
            percentage: activity.shipment_product?.percentage
              ? parseInt(activity.shipment_product.percentage, 10)
              : -1,
          },
          readiness: activity.Readiness || null,
          etb: activity.ETB || null,
          etd: activity.ETD || null,
          arrival_departure_information: {
            arrival_displacement: activity.arrival_departure_information
              ?.arrival_displacement
              ? parseInt(
                  activity.arrival_departure_information.arrival_displacement,
                  10
                )
              : -1,
            departure_displacement: activity.arrival_departure_information
              ?.departure_displacement
              ? parseInt(
                  activity.arrival_departure_information.departure_displacement,
                  10
                )
              : -1,
            arrival_draft: activity.arrival_departure_information?.arrival_draft
              ? parseFloat(activity.arrival_departure_information.arrival_draft)
              : -1,
            departure_draft: activity.arrival_departure_information
              ?.departure_draft
              ? parseFloat(
                  activity.arrival_departure_information.departure_draft
                )
              : -1,
            arrival_mast_height: activity.arrival_departure_information
              ?.arrival_mast_height
              ? parseFloat(
                  activity.arrival_departure_information.arrival_mast_height
                )
              : -1,
            departure_mast_height: activity.arrival_departure_information
              ?.departure_mast_height
              ? parseFloat(
                  activity.arrival_departure_information.departure_mast_height
                )
              : -1,
          },
        })),
      };

      createShipment(payload)
        .then(() => {
          onCreate();
          form.resetFields();
          setCurrentStep(0);
          setFormValues({});
        })
        .catch((err) => {
          console.error("Failed to create shipment:", err);
        });
    });
  };

  const steps = [
    {
      title: "General Information",
      content: (
        <Form
          form={form}
          layout="vertical"
          name="generalInformation"
          initialValues={{
            master_email: "",
            ETA: null,
            voyage_number: "",
            current_status: "Not Started",
            shipment_type: {
              cargo_operations: false,
              bunkering: false,
              owner_matters: false,
            },
          }}
        >
          <Form.Item
            name="master_email"
            label="Master Email"
            rules={[
              { required: true, message: "Please input the Master Email!" },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="ETA"
            label="ETA"
            rules={[{ required: true, message: "Please input the ETA!" }]}
          >
            <DatePicker
              showTime={{ format: "HH:00" }}
              format="YYYY-MM-DD HH:00"
            />
          </Form.Item>
          <Form.Item
            name="voyage_number"
            label="Voyage Number"
            rules={[
              { required: true, message: "Please input the Voyage Number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="current_status"
            label="Current Status"
            rules={[
              { required: true, message: "Please select the Current Status!" },
            ]}
          >
            <Select defaultValue="Not Started">
              {shipmentStatuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className="horizontal-checkbox-group">
            <Form.Item
              name={["shipment_type", "cargo_operations"]}
              valuePropName="checked"
            >
              <Checkbox> Cargo Operations </Checkbox>
            </Form.Item>
            <Form.Item
              name={["shipment_type", "bunkering"]}
              valuePropName="checked"
            >
              <Checkbox> Bunkering </Checkbox>
            </Form.Item>
            <Form.Item
              name={["shipment_type", "owner_matters"]}
              valuePropName="checked"
            >
              <Checkbox> Owner Matters </Checkbox>
            </Form.Item>
          </div>
        </Form>
      ),
    },
    {
      title: "Vessel",
      content: <VesselFormAutoComplete form={form} />,
    },
    {
      title: "Agent",
      content: <AgentFormAutoComplete form={form} />,
    },
    {
      title: "Activity",
      content: (
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
                terminal_location: "",
                shipment_product: {
                  product_type: "",
                  sub_products_type: [""],
                  quantity: 0,
                  dimensions: "",
                  percentage: 0,
                },
                readiness: null,
                etb: null,
                etd: null,
                arrival_departure_information: {
                  arrival_displacement: 0,
                  departure_displacement: 0,
                  arrival_draft: 0,
                  departure_draft: 0,
                  arrival_mast_height: 0,
                  departure_mast_height: 0,
                },
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
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "customer_specifications", "customer"]}
                      label="Customer"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "customer_specifications", "company"]}
                      label="Company"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "customer_specifications", "email"]}
                      label="Email"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "customer_specifications", "contact"]}
                      label="Contact"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "terminal_location"]}
                      label="Terminal Location"
                    >
                      <Input />
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
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "ETB"]}
                      label="ETB"
                      rules={[
                        { required: true, message: "Please input the ETB!" },
                      ]}
                    >
                      <DatePicker
                        showTime={{ format: "HH:00" }}
                        format="YYYY-MM-DD HH:00"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "ETD"]}
                      label="ETD"
                      rules={[
                        { required: true, message: "Please input the ETD!" },
                      ]}
                    >
                      <DatePicker
                        showTime={{ format: "HH:00" }}
                        format="YYYY-MM-DD HH:00"
                      />
                    </Form.Item>
                    <Form.List name={[name, "shipment_product", "products"]}>
                      {(
                        productFields,
                        { add: addProduct, remove: removeProduct }
                      ) => (
                        <>
                          {productFields.map((productField) => (
                            <div
                              key={productField.key}
                              style={{
                                display: "flex",
                                marginBottom: 8,
                                flexDirection: "column",
                              }}
                            >
                              <Form.Item
                                {...productField}
                                name={[productField.name, "product_type"]}
                                label="Product"
                                style={{ flex: 1, marginRight: 8 }}
                              >
                                <Input placeholder="Product Name" />
                              </Form.Item>
                              <Form.List
                                name={[productField.name, "sub_products_type"]}
                              >
                                {(
                                  subFields,
                                  { add: addSub, remove: removeSub }
                                ) => (
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
                                          name={[
                                            subField.name,
                                            "sub_product_type",
                                          ]}
                                          label="Sub Product"
                                          style={{
                                            flex: 1,
                                            marginRight: 8,
                                          }}
                                        >
                                          <Input placeholder="Sub Product Name" />
                                        </Form.Item>
                                        <Button
                                          onClick={() =>
                                            removeSub(subField.name)
                                          }
                                        >
                                          Remove Sub-Product
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      type="dashed"
                                      onClick={() => addSub()}
                                      block
                                    >
                                      Add Sub-Product
                                    </Button>
                                  </div>
                                )}
                              </Form.List>
                              <Button
                                onClick={() => removeProduct(productField.name)}
                              >
                                Remove Product
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => addProduct()}
                            block
                          >
                            Add Product
                          </Button>
                        </>
                      )}
                    </Form.List>
                    <Form.Item
                      {...restField}
                      name={[name, "shipment_product", "quantity"]}
                      label="Quantity"
                    >
                      <QuantityInput form={form} name={name} fieldKey={key} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "shipment_product", "percentage"]}
                      label="Percentage"
                    >
                      <Input type="number" />
                    </Form.Item>
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
                      <InputWithUnit unit="tonnes" />
                    </Form.Item>
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
                      <InputWithUnit unit="tonnes" />
                    </Form.Item>
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
                      <InputWithUnit unit="metres" />
                    </Form.Item>
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
                      <InputWithUnit unit="metres" />
                    </Form.Item>
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
                      <InputWithUnit unit="metres" />
                    </Form.Item>
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
                      <InputWithUnit unit="metres" />
                    </Form.Item>
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
      ),
    },
  ];

  return (
    <Modal open={visible} onCancel={onCancel} footer={null}>
      <Steps current={currentStep}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content" style={{ marginTop: "24px" }}>
        {steps[currentStep].content}
      </div>
      <div
        className="steps-action"
        style={{ marginTop: "24px", textAlign: "right" }}
      >
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={handleOk}>
            Done
          </Button>
        )}
        {currentStep > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default MultiStepShipmentModal;
