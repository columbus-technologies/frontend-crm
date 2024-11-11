import React, { useEffect, useState, useRef } from "react";
import { Modal, Steps, Form, Button, message } from "antd";
import moment from "moment";
import {
  createShipment,
  getShipmentStatuses,
  getAllTerminals,
  getAllCustomers,
  //   getAllActivityTypes,
  getAllOnlySubProductTypes,
  createEmptyDefaultChecklistUponInitialize,
} from "../../api";

import { validateAtLeastOneCheckbox } from "../../utils/validationUtils";
import GeneralInformationFormV2 from "../forms/GeneralInformationFormV2";

const { Step } = Steps;

interface MultiStepShipmentModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: () => void;
}

const MultiStepShipmentModalV2: React.FC<MultiStepShipmentModalProps> = ({
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
  //   const [setActivityTypes] = useState<string[]>([]);
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
          //   activities,
        ] = await Promise.all([
          getShipmentStatuses(),
          getAllOnlySubProductTypes(),
          getAllTerminals(),
          getAllCustomers(),
          //   getAllActivityTypes(),
        ]);

        setShipmentStatuses(shipmentStatuses);
        setSubProductTypes(subProductTypesData);
        setTerminalLocations(terminals.map((terminal) => terminal.name));
        setCustomerNames(customers.map((customer) => customer.customer));
        // setActivityTypes(activities.map((activity) => activity.activity_type));

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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const now = moment().toISOString();
      const mergedValues = { ...formValues, ...values };
      console.log("mergedValues", mergedValues);

      const payload = {
        master_email: mergedValues.master_email || "",
        initial_ETA: mergedValues.ETA ? mergedValues.ETA.toISOString() : null,
        current_ETA: mergedValues.ETA ? mergedValues.ETA.toISOString() : null,
        voyage_number: "", // No value in mergedValues, so set to empty string
        current_status: mergedValues.current_status || "",

        shipment_type: {
          cargo_operations: {
            cargo_operations:
              mergedValues.shipment_type?.cargo_operations?.cargo_operations ||
              false,
            cargo_operations_activity: mergedValues.cargo_operations
              ? [
                  {
                    activity_type: "", // No specific value in mergedValues
                    customer_name:
                      mergedValues.cargo_operations.customer_specifications
                        ?.customer || "",
                    anchorage_location: "", // No specific value in mergedValues
                    terminal_name:
                      mergedValues.cargo_operations.terminal_name || "",
                    shipment_product: [
                      {
                        sub_product_type: "", // No specific value in mergedValues
                        quantity: -1,
                        quantity_code: "",
                        percentage: -1,
                      },
                    ],
                    readiness: null, // Date-time fields as strings (empty for now)
                    etb: null,
                    etd: null,
                    arrival_departure_information: {
                      arrival_displacement: -1,
                      departure_displacement: -1,
                      arrival_draft: -1,
                      departure_draft: -1,
                      arrival_mast_height: -1,
                      departure_mast_height: -1,
                    },
                  },
                ]
              : [],
          },
          bunkering: {
            bunkering:
              mergedValues.shipment_type?.bunkering?.bunkering || false,
            bunkering_activity: mergedValues.bunkering
              ? [
                  {
                    customer_name: mergedValues.bunkering.customer_name || "",
                    supplier: "", // No specific value in mergedValues
                    supplier_email: "",
                    supplier_contact: "",
                    appointed_surveyor: "",
                    docking: "",
                    supplier_vessel: "",
                    bunker_intake_specifications: [
                      {
                        sub_product_type: "",
                        maximum_quantity_intake: -1,
                        maximum_hose_size: -1,
                      },
                    ],
                    shipment_product: [
                      {
                        sub_product_type: "",
                        quantity: -1,
                        quantity_code: "",
                        percentage: -1,
                      },
                    ],
                    freeboard: 0,
                    readiness: null,
                    etb: null,
                    etd: null,
                  },
                ]
              : [],
          },
          owner_matters: {
            owner_matters: false,
            activity: [],
          },
        },

        vessel_specifications: {
          imo_number: mergedValues.vessel_specifications?.imo_number || 0,
          vessel_name: mergedValues.vessel_specifications?.vessel_name || "",
          call_sign: mergedValues.vessel_specifications?.call_sign || "",
          sdwt: mergedValues.vessel_specifications?.sdwt || 0,
          nrt: mergedValues.vessel_specifications?.nrt || 0,
          flag: mergedValues.vessel_specifications?.flag || "",
          grt: mergedValues.vessel_specifications?.grt || 0,
          loa: mergedValues.vessel_specifications?.loa || 0,
        },

        shipment_details: {
          agent_details: {
            name: mergedValues.shipment_details?.agent_details?.name || "",
            email: mergedValues.shipment_details?.agent_details?.email || "",
            contact:
              mergedValues.shipment_details?.agent_details?.phoneCode +
                " " +
                mergedValues.shipment_details?.agent_details?.contact || "",
          },
        },
      };

      const shipmentID = await createShipment(payload);
      onCreate();
      form.resetFields();
      setCurrentStep(0);
      setFormValues({});
      message.success("Shipment created successfully!");

      // create default empty payload for checklist
      const checklistEmptyPayload = {
        shipment_id: shipmentID,
        port_dues: {
          supplier: "",
          service_provided: false,
        },
        pilotage: {
          supplier: "",
          service_provided: false,
        },
        service_launch: {
          supplier: "",
          service_provided: false,
        },
        logistics: {
          supplier: "",
          service_provided: false,
        },
        hotel_charges: {
          supplier: "",
          service_provided: false,
        },
        air_tickets: {
          supplier: "",
          service_provided: false,
        },
        transport_charges: {
          supplier: "",
          service_provided: false,
        },
        medicine_supplies: {
          supplier: "",
          service_provided: false,
        },
        fresh_water_supply: {
          supplier: "",
          service_provided: false,
        },
        marine_advisory: {
          supplier: "",
          service_provided: false,
        },
        courier_services: {
          supplier: "",
          service_provided: false,
        },
        cross_harbour_fees: {
          supplier: "",
          service_provided: false,
        },
        supply_boat: {
          supplier: "",
          service_provided: false,
        },
        repairs: {
          deslopping: {
            supplier: "",
            service_provided: false,
          },
          lift_repair: {
            supplier: "",
            service_provided: false,
          },
          uw_clean: {
            supplier: "",
            service_provided: false,
          },
        },
        crew_change: {
          sign_on: [],
          sign_off: [],
        },
        extras: {}, // Assuming extra services are handled as an array
      };
      await createEmptyDefaultChecklistUponInitialize(checklistEmptyPayload);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to create shipment:", error.message);
        message.error("Failed to create shipment. Please try again.");
      }
    }
  };

  const stepsV2 = [
    {
      title: "General Information",
      content: (
        <GeneralInformationFormV2
          form={form}
          shipmentStatuses={shipmentStatuses}
          onActivitySelectionChange={setSelectedActivities}
          terminalLocations={terminalLocations}
          customerNames={customerNames}
        />
      ),
    },
  ];

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={900}>
      <Steps current={currentStep}>
        {stepsV2.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div
        className="steps-content"
        style={{ marginTop: "24px", height: "400px", overflowY: "auto" }}
        ref={modalContentRef}
      >
        {stepsV2[currentStep].content}
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
        {currentStep === stepsV2.length - 1 && (
          <Button type="primary" onClick={handleOk}>
            Done
          </Button>
        )}
        {currentStep < stepsV2.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default MultiStepShipmentModalV2;
