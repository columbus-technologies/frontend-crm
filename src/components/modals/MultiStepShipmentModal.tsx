import React, { useEffect, useState, useRef } from "react";
import { Modal, Steps, Form, Button, message } from "antd";
import moment from "moment";
import {
  createShipment,
  getShipmentStatuses,
  getAllTerminals,
  getAllCustomers,
  getAllActivityTypes,
  getAllOnlySubProductTypes,
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
  const [subProductTypes, setSubProductTypes] = useState<string[]>([]);
  const [terminalLocations, setTerminalLocations] = useState<string[]>([]);
  const [customerNames, setCustomerNames] = useState<string[]>([]);
  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const modalContentRef = useRef<HTMLDivElement>(null);

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
          subProductTypesData,
          terminals,
          customers,
          activities,
        ] = await Promise.all([
          getShipmentStatuses(),
          getAllOnlySubProductTypes(),
          getAllTerminals(),
          getAllCustomers(),
          getAllActivityTypes(),
        ]);

        setShipmentStatuses(shipmentStatuses);
        setSubProductTypes(subProductTypesData);
        setTerminalLocations(terminals.map((terminal) => terminal.name));
        setCustomerNames(customers.map((customer) => customer.customer));
        setActivityTypes(activities.map((activity) => activity.activity_type));

        console.log(subProductTypes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

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
        console.log("mergedValues", mergedValues);
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
                  (activity: any) => ({
                    activity_type: activity.activity_type || "",
                    customer_name:
                      activity.customer_specifications?.customer || "",
                    anchorage_location: activity.anchorage_location || "",
                    terminal_name: activity.terminal_name || "",
                    shipment_product:
                      activity.shipment_product?.map((product: any) => ({
                        sub_product_type: product.sub_product_type || "",
                        quantity_code: product.quantityCode || "",
                        quantity: parseInt(product.quantity, 10) || "",
                        percentage: parseInt(product.percentage, 10) || "",
                      })) || [],
                    readiness: activity.readiness || null,
                    etb: activity.etb || null,
                    etd: activity.etd || null,
                    arrival_departure_information: {
                      arrival_displacement: activity
                        .arrival_departure_information?.arrival_displacement
                        ? parseInt(
                            activity.arrival_departure_information
                              .arrival_displacement,
                            10
                          )
                        : -1,
                      departure_displacement: activity
                        .arrival_departure_information?.departure_displacement
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
                            activity.arrival_departure_information
                              .departure_draft
                          )
                        : -1,
                      arrival_mast_height: activity
                        .arrival_departure_information?.arrival_mast_height
                        ? parseFloat(
                            activity.arrival_departure_information
                              .arrival_mast_height
                          )
                        : -1,
                      departure_mast_height: activity
                        .arrival_departure_information?.departure_mast_height
                        ? parseFloat(
                            activity.arrival_departure_information
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
                mergedValues.bunkering_activity?.map((activity: any) => ({
                  supplier: mergedValues.supplier || "",
                  customer_name: activity.customer_name || "",
                  supplier_contact: mergedValues.supplier_contact || "",
                  supplier_email: mergedValues.supplier_email || "",
                  appointed_surveyor: activity.appointed_surveyor || "",
                  docking: activity.docking || "",
                  supplier_vessel: activity.supplier_vessel || "",
                  bunker_intake_specifications:
                    activity.bunker_intake_specifications?.map((spec: any) => ({
                      product_type: spec.product_type || "",
                      sub_product_type: spec.sub_product_type || "",
                      maximum_quantity_intake:
                        parseInt(spec.maximum_quantity_intake, 10) || -1,
                      maximum_hose_size:
                        parseInt(spec.maximum_hose_size, 10) || -1,
                    })) || [],
                  freeboard: parseInt(activity.freeboard, 10) || -1,
                  readiness: activity.readiness || null,
                  etb: activity.etb || null,
                  etd: activity.etd || null,
                })) || [],
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

  // const handleSubProductTypeChange = (
  //   value: string,
  //   index: number,
  //   field: string
  // ) => {
  //   console.log(form.getFieldsValue());
  //   form.setFieldsValue({
  //     [field]: form.getFieldValue(field).map((activity: any, i: number) => {
  //       if (i === index) {
  //         return {
  //           ...activity,
  //           shipment_product: {
  //             ...activity.shipment_product,
  //             sub_products_type: [value],
  //           },
  //         };
  //       }
  //       return activity;
  //     }),
  //   });
  // };

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
                subProductTypes={subProductTypes}
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
                subProductTypes={subProductTypes}
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
    <Modal open={visible} onCancel={onCancel} footer={null} width={900}>
      <Steps current={currentStep}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div
        className="steps-content"
        style={{ marginTop: "24px", height: "400px", overflowY: "auto" }}
        ref={modalContentRef}
      >
        {steps[currentStep].content}
      </div>
      <div
        className="steps-action"
        style={{ marginTop: "24px", textAlign: "right" }}
      >
        {currentStep > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={prev}>
            Previous
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={handleOk}>
            Done
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default MultiStepShipmentModal;
