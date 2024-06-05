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
import { createShipment } from "../api";
import { Product, ShipmentProduct } from "../types"; // Import the necessary types

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

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setCurrentStep(0);
      setFormValues({});
    }
  }, [visible, form]);

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

      // Ensure the structure of the payload matches the backend requirements
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
          imo_number:
            parseInt(mergedValues.vessel_specifications?.imo_number, 10) || 0,
          vessel_name: mergedValues.vessel_specifications?.vessel_name || "",
          call_sign: mergedValues.vessel_specifications?.call_sign || "",
          sdwt: mergedValues.vessel_specifications?.sdwt || "",
          nrt: mergedValues.vessel_specifications?.nrt || "",
          flag: mergedValues.vessel_specifications?.flag || "",
          grt: mergedValues.vessel_specifications?.grt || "",
          loa: mergedValues.vessel_specifications?.loa || "",
        },
        shipment_details: mergedValues.shipment_details || {
          agent_details: {
            name: "",
            email: "",
            agent_contact: "",
          },
        },
        activity: mergedValues.activity.map((activity: any) => ({
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
            products: activity.shipment_product?.products || [],
            quantity: parseInt(activity.shipment_product?.quantity, 10) || 0,
            dimensions: {
              KG: parseInt(activity.shipment_product?.dimensions?.KG, 10) || 0,
              G: parseInt(activity.shipment_product?.dimensions?.G, 10) || 0,
            },
            percentage:
              parseInt(activity.shipment_product?.percentage, 10) || 0,
          },
          readiness: activity.readiness || now,
          etb: activity.etb || now,
          etd: activity.etd || now,
          arrival_departure_information: {
            arrival_displacement:
              parseInt(
                activity.arrival_departure_information?.arrival_displacement,
                10
              ) || 0,
            departure_displacement:
              parseInt(
                activity.arrival_departure_information?.departure_displacement,
                10
              ) || 0,
            arrival_draft:
              parseFloat(
                activity.arrival_departure_information?.arrival_draft
              ) || 0,
            departure_draft:
              parseFloat(
                activity.arrival_departure_information?.departure_draft
              ) || 0,
            arrival_mast_height:
              parseFloat(
                activity.arrival_departure_information?.arrival_mast_height
              ) || 0,
            departure_mast_height:
              parseFloat(
                activity.arrival_departure_information?.departure_mast_height
              ) || 0,
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
            current_status: "",
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
            <Input />
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
            <Select>
              <Option value="Not Started">Not Started</Option>
              <Option value="Started">Started</Option>
              <Option value="Delayed">Delayed</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
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
        </Form>
      ),
    },
    {
      title: "Vessel Specifications",
      content: (
        <Form
          form={form}
          layout="vertical"
          name="vesselSpecifications"
          initialValues={{
            vessel_specifications: {
              vessel_name: "",
              imo_number: 0,
              call_sign: "",
              sdwt: "",
              nrt: "",
              flag: "",
              grt: "",
              loa: "",
            },
          }}
        >
          <Form.Item
            name={["vessel_specifications", "vessel_name"]}
            label="Vessel Name"
            rules={[
              { required: true, message: "Please input the Vessel name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["vessel_specifications", "imo_number"]}
            label="IMO Number"
            rules={[
              { required: true, message: "Please input the IMO number!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name={["vessel_specifications", "call_sign"]}
            label="Call Sign"
          >
            <Input />
          </Form.Item>
          <Form.Item name={["vessel_specifications", "sdwt"]} label="SDWT">
            <Input />
          </Form.Item>
          <Form.Item name={["vessel_specifications", "nrt"]} label="NRT">
            <Input />
          </Form.Item>
          <Form.Item name={["vessel_specifications", "flag"]} label="Flag">
            <Input />
          </Form.Item>
          <Form.Item name={["vessel_specifications", "grt"]} label="GRT">
            <Input />
          </Form.Item>
          <Form.Item name={["vessel_specifications", "loa"]} label="LOA">
            <Input />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Shipment Details",
      content: (
        <Form
          form={form}
          layout="vertical"
          name="shipmentDetails"
          initialValues={{
            shipment_details: {
              agent_details: {
                name: "",
                email: "",
                agent_contact: "",
              },
            },
          }}
        >
          <Form.Item
            name={["shipment_details", "agent_details", "name"]}
            label="Agent Name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["shipment_details", "agent_details", "email"]}
            label="Agent Email"
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name={["shipment_details", "agent_details", "agent_contact"]}
            label="Agent Contact"
          >
            <Input />
          </Form.Item>
        </Form>
      ),
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
                  products: [],
                  quantity: 0,
                  dimensions: {
                    KG: 0,
                    G: 0,
                  },
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
                                name={[productField.name, "product"]}
                                label="Product"
                                style={{ flex: 1, marginRight: 8 }}
                              >
                                <Input placeholder="Product Name" />
                              </Form.Item>
                              <Form.List
                                name={[productField.name, "sub_products"]}
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
                                          name={[subField.name, "sub_product"]}
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
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "shipment_product", "dimensions", "KG"]}
                      label="Dimensions (KG)"
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "shipment_product", "dimensions", "G"]}
                      label="Dimensions (G)"
                    >
                      <Input type="number" />
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
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[
                        name,
                        "arrival_departure_information",
                        "departure_displacement",
                      ]}
                      label="Departure Displacement"
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[
                        name,
                        "arrival_departure_information",
                        "arrival_draft",
                      ]}
                      label="Arrival Draft"
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[
                        name,
                        "arrival_departure_information",
                        "departure_draft",
                      ]}
                      label="Departure Draft"
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[
                        name,
                        "arrival_departure_information",
                        "arrival_mast_height",
                      ]}
                      label="Arrival Mast Height"
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[
                        name,
                        "arrival_departure_information",
                        "departure_mast_height",
                      ]}
                      label="Departure Mast Height"
                    >
                      <Input type="number" />
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
    <Modal visible={visible} onCancel={onCancel} footer={null}>
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
