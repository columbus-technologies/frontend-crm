import React, { useEffect, useState } from "react";
import { Modal, Steps, Form, Button, message } from "antd";
import moment from "moment";
import {
  createShipment,
  getAllProductTypes,
  getShipmentStatuses,
  getAllTerminals,
  getAllCustomers,
  getAllActivityTypes,
} from "../../api";
import VesselFormAutoComplete from "../forms/VesselSettingsFormAutoComplete";
import AgentFormAutoComplete from "../forms/AgentSettingsFormAutoComplete";
import GeneralInformationForm from "../forms/GeneralInformationForm";
import CargoOperationsActivityForm from "../forms/CargoOperationsActivityForm";
import BunkeringActivityForm from "../forms/BunkeringActivityForm";
import { validateAtLeastOneCheckbox } from "../../utils/validationUtils";

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
  const [terminalLocations, setTerminalLocations] = useState<string[]>([]);
  const [customerNames, setCustomerNames] = useState<string[]>([]);
  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

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
        const [
          shipmentStatuses,
          productTypesData,
          terminals,
          customers,
          activities,
        ] = await Promise.all([
          getShipmentStatuses(),
          getAllProductTypes(),
          getAllTerminals(),
          getAllCustomers(),
          getAllActivityTypes(),
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
        const terminalNames = terminals.map((terminal) => terminal.name);
        setTerminalLocations(terminalNames);
        const customerNames = customers.map((customer) => customer.customer);
        setCustomerNames(customerNames);
        const activityTypeNames = activities.map(
          (activity) => activity.activity_type
        );
        setActivityTypes(activityTypeNames);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const next = () => {
    form
      .validateFields()
      .then((values) => {
        if (
          currentStep === 0 &&
          !validateAtLeastOneCheckbox(
            [
              "shipment_type.cargo_operations.cargo_operations",
              "shipment_type.bunkering.bunkering",
            ],
            form
          )
        ) {
          message.error(
            "At least one of Cargo Operations or Bunkering must be selected"
          );
          return;
        }
        setFormValues({ ...formValues, ...values });
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        message.error("Please fill in all required fields.");
        form.scrollToField(errorInfo.errorFields[0].name, {
          behavior: "smooth",
        });
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
          shipment_type: {
            cargo_operations: {
              cargo_operations:
                mergedValues.shipment_type?.cargo_operations.cargo_operations ||
                false,
              cargo_operations_activity:
                mergedValues.cargo_operations_activity?.map(
                  (cargo_operation_activity: any) => ({
                    activity_type: cargo_operation_activity.activity_type || "",
                    customer_name:
                      cargo_operation_activity.customer_specifications
                        ?.customer || "",
                    anchorage_location:
                      cargo_operation_activity.anchorage_location || "",
                    terminal_name: cargo_operation_activity.terminal_name || "",
                    shipment_product: {
                      product_type:
                        cargo_operation_activity.shipment_product
                          ?.product_type || "",
                      sub_products_type:
                        cargo_operation_activity.shipment_product
                          ?.sub_products_type || [],
                      quantity:
                        parseInt(
                          cargo_operation_activity.shipment_product?.quantity,
                          10
                        ) || -1,
                      dimensions:
                        cargo_operation_activity.shipment_product
                          ?.quantityCode || "",
                      percentage: cargo_operation_activity.shipment_product
                        ?.percentage
                        ? parseInt(
                            cargo_operation_activity.shipment_product
                              .percentage,
                            10
                          )
                        : -1,
                    },
                    readiness: cargo_operation_activity.Readiness || null,
                    etb: cargo_operation_activity.ETB || null,
                    etd: cargo_operation_activity.ETD || null,
                    arrival_departure_information: {
                      arrival_displacement: cargo_operation_activity
                        .arrival_departure_information?.arrival_displacement
                        ? parseInt(
                            cargo_operation_activity
                              .arrival_departure_information
                              .arrival_displacement,
                            10
                          )
                        : -1,
                      departure_displacement: cargo_operation_activity
                        .arrival_departure_information?.departure_displacement
                        ? parseInt(
                            cargo_operation_activity
                              .arrival_departure_information
                              .departure_displacement,
                            10
                          )
                        : -1,
                      arrival_draft: cargo_operation_activity
                        .arrival_departure_information?.arrival_draft
                        ? parseFloat(
                            cargo_operation_activity
                              .arrival_departure_information.arrival_draft
                          )
                        : -1,
                      departure_draft: cargo_operation_activity
                        .arrival_departure_information?.departure_draft
                        ? parseFloat(
                            cargo_operation_activity
                              .arrival_departure_information.departure_draft
                          )
                        : -1,
                      arrival_mast_height: cargo_operation_activity
                        .arrival_departure_information?.arrival_mast_height
                        ? parseFloat(
                            cargo_operation_activity
                              .arrival_departure_information.arrival_mast_height
                          )
                        : -1,
                      departure_mast_height: cargo_operation_activity
                        .arrival_departure_information?.departure_mast_height
                        ? parseFloat(
                            cargo_operation_activity
                              .arrival_departure_information
                              .departure_mast_height
                          )
                        : -1,
                    },
                  })
                ) || [],
            },
            bunkering: {
              bunkering:
                mergedValues.shipment_type?.bunkering.bunkering || false,
              bunkering_activity:
                mergedValues.bunkering_activity?.map(
                  (bunkering_activity: any) => ({
                    supplier: bunkering_activity.supplier || "",
                    supplier_contact: bunkering_activity.supplier_contact || "",
                    appointed_surveyor:
                      bunkering_activity.appointed_surveyor || "",
                    docking: {
                      starboard: bunkering_activity.docking?.starboard || false,
                      port: bunkering_activity.docking?.port || false,
                    },
                    shipment_product: {
                      product_type:
                        bunkering_activity.shipment_product?.product_type || "",
                      sub_products_type:
                        bunkering_activity.shipment_product
                          ?.sub_products_type || [],
                      quantity:
                        parseInt(
                          bunkering_activity.shipment_product?.quantity,
                          10
                        ) || -1,
                      dimensions:
                        bunkering_activity.shipment_product?.quantityCode || "",
                      percentage: bunkering_activity.shipment_product
                        ?.percentage
                        ? parseInt(
                            bunkering_activity.shipment_product.percentage,
                            10
                          )
                        : -1,
                    },
                    supplier_vessel: bunkering_activity.supplier_vessel || "",
                    bunker_intake_product: {
                      bunker_product_type:
                        bunkering_activity.bunker_intake_product
                          ?.bunker_product_type || "",
                      quantity:
                        parseInt(
                          bunkering_activity.bunker_intake_product?.quantity,
                          10
                        ) || -1,
                      dimensions:
                        bunkering_activity.bunker_intake_product?.dimensions ||
                        "",
                    },
                    bunker_hose_product: {
                      bunker_hose_type:
                        bunkering_activity.bunker_hose_product
                          ?.bunker_hose_type || "",
                      quantity:
                        parseInt(
                          bunkering_activity.bunker_hose_product?.quantity,
                          10
                        ) || -1,
                      dimensions:
                        bunkering_activity.bunker_hose_product?.dimensions ||
                        "",
                    },
                    freeboard: parseInt(bunkering_activity.freeboard, 10) || -1,
                    readiness: bunkering_activity.readiness || null,
                    etb: bunkering_activity.etb || null,
                    etd: bunkering_activity.etd || null,
                  })
                ) || [],
            },
            owner_matters: {
              owner_matters: false,
              activity: [],
            },
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
          onActivitySelectionChange={setSelectedActivities}
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
    ...(selectedActivities.includes("cargo_operations")
      ? [
          {
            title: "Cargo Operations Activity",
            content: (
              <CargoOperationsActivityForm
                form={form}
                productTypes={productTypes}
                subProductTypes={subProductTypes}
                filteredSubProductTypes={filteredSubProductTypes}
                handleProductTypeChange={handleProductTypeChange}
                handleSubProductTypeSearch={handleSubProductTypeSearch}
                terminalLocations={terminalLocations}
                customerNames={customerNames}
                activityTypes={activityTypes}
              />
            ),
          },
        ]
      : []),
    ...(selectedActivities.includes("bunkering")
      ? [
          {
            title: "Bunkering Activity",
            content: (
              <BunkeringActivityForm
                form={form}
                productTypes={productTypes}
                subProductTypes={subProductTypes}
                filteredSubProductTypes={filteredSubProductTypes}
                handleProductTypeChange={handleProductTypeChange}
                handleSubProductTypeSearch={handleSubProductTypeSearch}
                terminalLocations={terminalLocations}
                customerNames={customerNames}
                activityTypes={activityTypes}
              />
            ),
          },
        ]
      : []),
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
