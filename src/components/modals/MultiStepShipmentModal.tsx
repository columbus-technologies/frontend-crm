import React, { useEffect, useState } from "react";
import { Modal, Steps, Form, Button, message } from "antd";
import moment from "moment";
import {
  createShipment,
  getAllProductTypes,
  getShipmentStatuses,
} from "../../api";
import VesselFormAutoComplete from "../forms/VesselSettingsFormAutoComplete";
import AgentFormAutoComplete from "../forms/AgentSettingsFormAutoComplete";
import GeneralInformationForm from "../forms/GeneralInformationForm";
import ActivityForm from "../forms/ActivityForm";

const { Step } = Steps;

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
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [subProductTypes, setSubProductTypes] = useState<{
    [key: string]: string[];
  }>({});
  const [filteredSubProductTypes, setFilteredSubProductTypes] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setCurrentStep(0);
      setFormValues({});
    }
  }, [visible, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shipmentStatuses, productTypesData] = await Promise.all([
          getShipmentStatuses(),
          getAllProductTypes(),
        ]);
        setShipmentStatuses(shipmentStatuses);
        const productTypes = productTypesData.map(
          (product: any) => product.product_type
        );
        const subProductTypes = productTypesData.reduce(
          (acc: any, product: any) => {
            acc[product.product_type] = product.sub_products_type;
            return acc;
          },
          {}
        );
        setProductTypes(productTypes);
        setSubProductTypes(subProductTypes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
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
    form
      .validateFields()
      .then((values) => {
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
              product_type: activity.shipment_product?.product_type || "",
              sub_products_type:
                activity.shipment_product?.sub_products_type || [],
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
                    activity.arrival_departure_information
                      .departure_displacement,
                    10
                  )
                : -1,
              arrival_draft: activity.arrival_departure_information
                ?.arrival_draft
                ? parseFloat(
                    activity.arrival_departure_information.arrival_draft
                  )
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
      })
      .catch((errorInfo) => {
        message.error("Please fill in all required fields.");
        // scroll to the first error field
        form.scrollToField(errorInfo.errorFields[0].name, {
          behavior: "smooth",
        });
      });
  };

  const handleProductTypeChange = (value: string, index: number) => {
    form.setFieldsValue({
      activity: form
        .getFieldValue("activity")
        .map((activity: any, i: number) => {
          if (i === index) {
            return {
              ...activity,
              shipment_product: {
                ...activity.shipment_product,
                product_type: value,
                sub_products_type: [],
              },
            };
          }
          return activity;
        }),
    });

    setFilteredSubProductTypes((prev) => ({
      ...prev,
      [index]: subProductTypes[value] || [],
    }));
  };

  const handleSubProductTypeSearch = (value: string, index: number) => {
    const productType = form.getFieldValue([
      "activity",
      index,
      "shipment_product",
      "product_type",
    ]);
    const subProducts = subProductTypes[productType] || [];
    setFilteredSubProductTypes((prev) => ({
      ...prev,
      [index]: subProducts.filter((subProduct) =>
        subProduct.toLowerCase().includes(value.toLowerCase())
      ),
    }));
  };

  const steps = [
    {
      title: "General Information",
      content: (
        <GeneralInformationForm
          form={form}
          shipmentStatuses={shipmentStatuses}
        />
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
        <ActivityForm
          form={form}
          productTypes={productTypes}
          subProductTypes={subProductTypes}
          filteredSubProductTypes={filteredSubProductTypes}
          handleProductTypeChange={handleProductTypeChange}
          handleSubProductTypeSearch={handleSubProductTypeSearch}
        />
      ),
    },
  ];

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={800}>
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
