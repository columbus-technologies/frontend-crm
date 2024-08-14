import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Row, Col, Divider, Button } from "antd";
import { ShipmentResponse } from "../../../types";
import getLatestETD, {
  formatDateToLocalString,
} from "../../../utils/dateTimeUtils";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import getPilotageFees from "../../../utils/invoice";

interface InvoiceFormProps {
  form: any;
  selectedShipment: ShipmentResponse;
  invoiceData: any; // Add this prop
  invoiceFeesData: any;
  terminalName: any;
  isEditing: boolean;
  onValuesChange: (changedValues: any, allValues: any) => void;
}

const BluShipping_InvoiceForm: React.FC<InvoiceFormProps> = ({
  form,
  selectedShipment,
  invoiceData,
  invoiceFeesData,
  terminalName,
  isEditing,
  onValuesChange,
}) => {
  const [havePortDuesField, setHavePortDuesField] = useState(true);
  const [havePilotageField, setHavePilotageField] = useState(true);
  const [haveServiceLaunchField, setHaveServiceLaunchField] = useState(true);
  const [haveTowageField, setHaveTowageField] = useState(true);
  const [haveMooringField, setHaveMooringField] = useState(true);
  const [haveAgencyFeeField, setHaveAgencyFeeField] = useState(true);

  useEffect(() => {
    if (invoiceData) {
      // Set initial values from invoiceData
      const initialValues = {
        ...invoiceData.invoice_pricing_details,
        dynamicFields: JSON.parse(
          invoiceData.invoice_pricing_details.dynamicFields || "[]"
        ),
        portDues: JSON.parse(
          invoiceData.invoice_pricing_details.portDues || "[]"
        ),
        agencyFee: JSON.parse(
          invoiceData.invoice_pricing_details.agencyFee || "[]"
        ),
        mooring: JSON.parse(
          invoiceData.invoice_pricing_details.mooring || "[]"
        ),
        pilotage: JSON.parse(
          invoiceData.invoice_pricing_details.pilotage || "[]"
        ),
        serviceLaunch: JSON.parse(
          invoiceData.invoice_pricing_details.serviceLaunch || "[]"
        ),
        towage: JSON.parse(invoiceData.invoice_pricing_details.towage || "[]"),
      };

      // Decide whether to display add component based on existing data
      setHavePortDuesField(initialValues.portDues.length > 0);
      setHavePilotageField(initialValues.pilotage.length > 0);
      setHaveServiceLaunchField(initialValues.serviceLaunch.length > 0);
      setHaveTowageField(initialValues.towage.length > 0);
      setHaveMooringField(initialValues.mooring.length > 0);
      setHaveAgencyFeeField(initialValues.agencyFee.length > 0);
      console.log(initialValues, "james");
      form.setFieldsValue(initialValues);
    }
  }, [invoiceData, form]);

  const handleAddPortDuesField = () => {
    let newPortDuesFields = [];

    const latestETD = getLatestETD(selectedShipment);

    if (
      !invoiceData ||
      !invoiceData.invoice_pricing_details.portDues ||
      invoiceData.invoice_pricing_details.portDues === "[]"
    ) {
      const etaDate = new Date(selectedShipment.ETA);
      const numOfDaysShipmentStayed = Math.ceil(
        (latestETD.getTime() - etaDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const sizeOfVessel = selectedShipment.vessel_specifications.grt / 100;

      if (
        selectedShipment.shipment_type.cargo_operations.cargo_operations &&
        !selectedShipment.shipment_type.bunkering.bunkering
      ) {
        const cargoPortDuesPrice =
          invoiceFeesData.invoiceFees.cargo_operations[numOfDaysShipmentStayed];
        newPortDuesFields = [
          {
            units: sizeOfVessel,
            price: cargoPortDuesPrice * sizeOfVessel,
            unitPrice: cargoPortDuesPrice,
            remarks: `Basis ${sizeOfVessel} Units @ ${cargoPortDuesPrice?.toFixed(
              2
            )} Per Unit`,
            description: "Port Dues",
          },
        ];
      }

      if (
        selectedShipment.shipment_type.bunkering.bunkering &&
        !selectedShipment.shipment_type.cargo_operations.cargo_operations
      ) {
        const bunkeringPortDuesPrice =
          invoiceFeesData.invoiceFees.bunkering[numOfDaysShipmentStayed];
        newPortDuesFields = [
          {
            units: sizeOfVessel,
            price: bunkeringPortDuesPrice * sizeOfVessel,
            unitPrice: bunkeringPortDuesPrice,
            remarks: `Basis ${sizeOfVessel} Units @ ${bunkeringPortDuesPrice?.toFixed(
              2
            )} Per Unit`,
            description: "Port Dues",
          },
        ];
      }

      if (
        selectedShipment.shipment_type.bunkering.bunkering &&
        selectedShipment.shipment_type.cargo_operations.cargo_operations
      ) {
        const combinedPortDuesPrice =
          invoiceFeesData.invoiceFees.bunkering[numOfDaysShipmentStayed];
        newPortDuesFields = [
          {
            units: sizeOfVessel,
            price: combinedPortDuesPrice * sizeOfVessel,
            unitPrice: combinedPortDuesPrice,
            remarks: `Basis ${sizeOfVessel} Units @ ${combinedPortDuesPrice?.toFixed(
              2
            )} Per Unit`,
            description: "Port Dues",
          },
        ];
      }
    } else {
      newPortDuesFields = JSON.parse(
        invoiceData.invoice_pricing_details.portDues || "[]"
      );
    }

    form.setFieldsValue({
      portDues: newPortDuesFields,
    });

    // Manually trigger onValuesChange
    onValuesChange(
      { portDues: newPortDuesFields },
      {
        ...form.getFieldsValue(),
        portDues: newPortDuesFields,
      }
    );

    setHavePortDuesField(true);
  };

  const handleAddPilotageField = () => {
    let newPilotageFields = [];
    const pilotageDefaultHours = 7;
    const pilotageFees = getPilotageFees(
      invoiceFeesData.invoiceFees.pilotage,
      selectedShipment
    );
    if (
      !invoiceData ||
      !invoiceData.invoice_pricing_details.pilotage ||
      invoiceData.invoice_pricing_details.pilotage == "[]"
    ) {
      newPilotageFields = [
        {
          hourlyRate: pilotageFees,
          hours: pilotageDefaultHours,
          price: pilotageFees * pilotageDefaultHours,
          description: "Pilotage",
          remarks: `Basis ${pilotageDefaultHours} Hours @ ${pilotageFees} Per Hour`,
        },
      ];
    } else {
      newPilotageFields = JSON.parse(
        invoiceData.invoice_pricing_details.pilotage || "[]"
      );
    }

    form.setFieldsValue({
      pilotage: newPilotageFields,
    });

    // Manually trigger onValuesChange
    onValuesChange(
      { pilotage: newPilotageFields },
      {
        ...form.getFieldsValue(),
        pilotage: newPilotageFields,
      }
    );

    setHavePilotageField(true);
  };

  const handleAddServiceLaunchField = () => {
    let newServiceLaunchFields = [];
    const serviceLaunchDefaultTrips = 2;

    if (
      !invoiceData ||
      !invoiceData.invoice_pricing_details.serviceLaunch ||
      invoiceData.invoice_pricing_details.serviceLaunch == "[]"
    ) {
      newServiceLaunchFields = [
        {
          trips: serviceLaunchDefaultTrips,
          hourlyRate: invoiceFeesData.invoiceFees.service_launch["hourlyRate"],
          price:
            serviceLaunchDefaultTrips *
            invoiceFeesData.invoiceFees.service_launch["hourlyRate"],
          description: "Service Launch",
          remarks: `Estimated Basis ${serviceLaunchDefaultTrips} Trips`,
        },
      ];
    } else {
      newServiceLaunchFields = JSON.parse(
        invoiceData.invoice_pricing_details.serviceLaunch || "[]"
      );
    }

    form.setFieldsValue({
      serviceLaunch: newServiceLaunchFields,
    });

    // Manually trigger onValuesChange
    onValuesChange(
      { serviceLaunch: newServiceLaunchFields },
      {
        ...form.getFieldsValue(),
        serviceLaunch: newServiceLaunchFields,
      }
    );

    setHaveServiceLaunchField(true);
  };

  const handleAddTowageField = () => {
    const towageDefaultBafPercentRate = 5;
    console.log(invoiceData, "as");
    let newTowageFields = [];
    if (
      !invoiceData ||
      !invoiceData.invoice_pricing_details.towage ||
      invoiceData.invoice_pricing_details.towage == "[]"
    ) {
      newTowageFields = [
        {
          bafRate: towageDefaultBafPercentRate,
          remarks: `Estimated Basis SGD /Tug/Hr x  Tugs x  Hrs +  % 5 BAF`,
          description: "Towage",
        },
      ];
    } else {
      newTowageFields = JSON.parse(
        invoiceData.invoice_pricing_details.towage || "[]"
      );
    }

    form.setFieldsValue({
      towage: newTowageFields,
    });

    // Manually trigger onValuesChange
    onValuesChange(
      { towage: newTowageFields },
      {
        ...form.getFieldsValue(),
        towage: newTowageFields,
      }
    );

    setHaveTowageField(true);
  };

  const handleAddMooringField = () => {
    let newMooringFields = [];
    // Determine the price based on terminalName
    const mooringPrice =
      terminalName in invoiceFeesData.invoiceFees.mooring
        ? invoiceFeesData.invoiceFees.mooring[terminalName]
        : invoiceFeesData.invoiceFees.mooring["default"];
    if (
      !invoiceData ||
      !invoiceData.invoice_pricing_details.mooring ||
      invoiceData.invoice_pricing_details.mooring == "[]"
    ) {
      newMooringFields = [
        {
          price: mooringPrice,
          description: "Mooring",
          remarks: `Estimated Basis ${terminalName} Tariff`,
        },
      ];
    } else {
      newMooringFields = JSON.parse(
        invoiceData.invoice_pricing_details.mooring || "[]"
      );
    }

    form.setFieldsValue({
      mooring: newMooringFields,
    });

    // Manually trigger onValuesChange
    onValuesChange(
      { mooring: newMooringFields },
      {
        ...form.getFieldsValue(),
        mooring: newMooringFields,
      }
    );

    setHaveMooringField(true);
  };

  const handleAddAgencyFeeField = () => {
    let newAgencyFeeFields = [];
    console.log(invoiceData, "fleh");
    // 1st scenario - user has not saved and hence invoiceData.invoice_pricing_details.agencyFee will be null
    // 2nd scenario - user has saved, but removed agencyFee, hence it is empty brackets
    if (
      !invoiceData ||
      !invoiceData.invoice_pricing_details.agencyFee ||
      invoiceData.invoice_pricing_details.agencyFee == "[]"
    ) {
      newAgencyFeeFields = [
        {
          price: invoiceFeesData.invoiceFees.agency_fee.fees,
          description: "Agency Fee",
        },
      ];
    } else {
      newAgencyFeeFields = JSON.parse(
        invoiceData.invoice_pricing_details.agencyFee || "[]"
      );
    }
    console.log(newAgencyFeeFields, "newAgencyFeeFields");
    form.setFieldsValue({
      agencyFee: newAgencyFeeFields,
    });

    // Manually trigger onValuesChange
    onValuesChange(
      { agencyFee: newAgencyFeeFields },
      {
        ...form.getFieldsValue(),
        agencyFee: newAgencyFeeFields,
      }
    );

    setHaveAgencyFeeField(true);
  };

  const handleRemove = (
    remove: (name: any) => void,
    name: any,
    fieldName: string
  ) => {
    remove(name);
    if (fieldName === "portDues") setHavePortDuesField(false);
    if (fieldName === "pilotage") setHavePilotageField(false);
    if (fieldName === "serviceLaunch") setHaveServiceLaunchField(false);
    if (fieldName === "towage") setHaveTowageField(false);
    if (fieldName === "mooring") setHaveMooringField(false);
    if (fieldName === "agencyFee") setHaveAgencyFeeField(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Form
        form={form}
        initialValues={{
          customerName:
            (selectedShipment.shipment_type.bunkering?.bunkering_activity
              ?.length > 0 &&
              selectedShipment.shipment_type.bunkering.bunkering_activity[0]
                .customer_name) ||
            (selectedShipment.shipment_type.cargo_operations
              ?.cargo_operations_activity?.length > 0 &&
              selectedShipment.shipment_type.cargo_operations
                .cargo_operations_activity[0].customer_name) ||
            "",
          voyageNumber: selectedShipment.voyage_number,
          vesselName: selectedShipment.vessel_specifications.vessel_name,
          callSign: selectedShipment.vessel_specifications.call_sign,
          grt: selectedShipment.vessel_specifications.grt,
          nrt: selectedShipment.vessel_specifications.nrt,
          dwt: selectedShipment.vessel_specifications.sdwt,
          loa: selectedShipment.vessel_specifications.loa + " metres",
          eta: formatDateToLocalString(selectedShipment.ETA),
          etd: formatDateToLocalString(
            getLatestETD(selectedShipment).toISOString()
          ),
          imoNumber: String(selectedShipment.vessel_specifications.imo_number),
          location: "Location",
          fax: "Fax",
          purpose: "Purpose",
          port_dues_description: "Port Dues",
          estimated_total_description: "Estimated Total SGD",
          pilotage_description: "Pilotage",
          service_launch_description: "Service Launch",
          towage_description: "Towage",
          mooring_description: "Mooring",
          agency_fee_description: "Agency Fee",
          portDues: [],
          pilotage: [],
          mooring: [],
          serviceLaunch: [],
          towage: [],
          agencyFee: [],
          dynamicFields: [], // Initialize dynamicFields as an array
        }}
        onValuesChange={onValuesChange}
        style={{ maxWidth: "800px", width: "100%" }} // Adjust the maxWidth as needed
      >
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={12}>
            <Form.Item label="Name" name="customerName">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="Fax" name="fax">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="IMO Number" name="imoNumber">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="Vessel Name" name="vesselName">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="Voyage Number" name="voyageNumber">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="Call Sign" name="callSign">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="Location" name="location">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="Purpose" name="purpose">
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Contact Number" name="contactNumber">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="GRT" name="grt">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="NRT" name="nrt">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="DWT" name="dwt">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="LOA" name="loa">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="ETA" name="eta">
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item label="ETD" name="etd">
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Form.List name="portDues">
          {(fields, { remove }) => (
            <>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Row gutter={16} style={{ flex: 1 }}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        label="Description"
                      >
                        <Input defaultValue="Port Dues" disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "units"]}
                        label="Units (Per 100GT)"
                      >
                        <InputNumber min={0} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "unitPrice"]}
                        label="Unit Price"
                      >
                        <InputNumber min={0} step={0.1} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "price"]}
                        label="SGD Price"
                      >
                        <InputNumber min={0} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item
                        {...field}
                        name={[field.name, "remarks"]}
                        label="Remarks"
                      >
                        <Input disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {isEditing && (
                    <MinusCircleOutlined
                      style={{ marginLeft: "auto" }}
                      onClick={() =>
                        handleRemove(remove, field.name, "portDues")
                      }
                    />
                  )}
                </div>
              ))}
              <Form.Item>
                {isEditing && !havePortDuesField && (
                  <Button
                    type="dashed"
                    onClick={handleAddPortDuesField}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Port Dues field
                  </Button>
                )}
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider />
        <Form.List name="pilotage">
          {(fields, { remove }) => (
            <>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Row gutter={16} style={{ flex: 1, marginBottom: "0px" }}>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        label="Description"
                      >
                        <Input defaultValue="Pilotage" disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "hours"]}
                        label="Hours"
                      >
                        <InputNumber min={0} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "hourlyRate"]}
                        label="Hourly Rate"
                      >
                        <InputNumber min={0} step={0.1} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "price"]}
                        label="SGD Price"
                      >
                        <InputNumber min={0} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item
                        {...field}
                        name={[field.name, "remarks"]}
                        label="Remarks"
                      >
                        <Input disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {isEditing && (
                    <MinusCircleOutlined
                      style={{ marginLeft: "auto" }}
                      onClick={() =>
                        handleRemove(remove, field.name, "pilotage")
                      }
                    />
                  )}
                </div>
              ))}
              <Form.Item>
                {isEditing && !havePilotageField && (
                  <Button
                    type="dashed"
                    onClick={handleAddPilotageField}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Pilotage field
                  </Button>
                )}
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider />
        <Form.List name="serviceLaunch">
          {(fields, { remove }) => (
            <>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Row gutter={16} style={{ flex: 1, marginBottom: "0px" }}>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        label="Description"
                      >
                        <Input
                          defaultValue="Service Launch"
                          disabled={!isEditing}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "trips"]}
                        label="Trips"
                      >
                        <InputNumber min={0} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "hourlyRate"]}
                        label="Hourly Rate"
                      >
                        <InputNumber min={0} step={0.1} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "price"]}
                        label="SGD Price"
                      >
                        <InputNumber min={0} step={0.01} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item
                        {...field}
                        name={[field.name, "remarks"]}
                        label="Remarks"
                      >
                        <Input disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {isEditing && (
                    <MinusCircleOutlined
                      style={{ marginLeft: "auto" }}
                      onClick={() =>
                        handleRemove(remove, field.name, "serviceLaunch")
                      }
                    />
                  )}
                </div>
              ))}
              <Form.Item>
                {isEditing && !haveServiceLaunchField && (
                  <Button
                    type="dashed"
                    onClick={handleAddServiceLaunchField}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Service Launch field
                  </Button>
                )}
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider />
        <Form.List name="towage">
          {(fields, { remove }) => (
            <>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Row gutter={16} style={{ flex: 1, marginBottom: "0px" }}>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        label="Description"
                      >
                        <Input defaultValue="Towage" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "tugRate"]}
                        label="Tug Rate"
                      >
                        <InputNumber min={0} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "tugs"]}
                        label="Tugs"
                      >
                        <InputNumber min={0} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "hours"]}
                        label="Hours"
                      >
                        <InputNumber min={0} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "bafRate"]}
                        label="BAF Rate (%)"
                      >
                        <InputNumber min={0} step={0.1} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "price"]}
                        label="SGD Price"
                      >
                        <InputNumber min={0} step={0.01} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item
                        {...field}
                        name={[field.name, "remarks"]}
                        label="Remarks"
                      >
                        <Input disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {isEditing && (
                    <MinusCircleOutlined
                      style={{ marginLeft: "auto" }}
                      onClick={() => handleRemove(remove, field.name, "towage")}
                    />
                  )}
                </div>
              ))}
              <Form.Item>
                {isEditing && !haveTowageField && (
                  <Button
                    type="dashed"
                    onClick={handleAddTowageField}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Towage field
                  </Button>
                )}
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider />
        <Form.List name="mooring">
          {(fields, { remove }) => (
            <>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Row gutter={16} style={{ flex: 1, marginBottom: "0px" }}>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        label="Description"
                      >
                        <Input defaultValue="Mooring" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "price"]}
                        label="SGD Price"
                      >
                        <InputNumber min={0} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item
                        {...field}
                        name={[field.name, "remarks"]}
                        label="Remarks"
                      >
                        <Input disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {isEditing && (
                    <MinusCircleOutlined
                      style={{ marginLeft: "auto" }}
                      onClick={() =>
                        handleRemove(remove, field.name, "mooring")
                      }
                    />
                  )}
                </div>
              ))}
              <Form.Item>
                {isEditing && !haveMooringField && (
                  <Button
                    type="dashed"
                    onClick={handleAddMooringField}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Mooring field
                  </Button>
                )}
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider />
        <Form.List name="agencyFee">
          {(fields, { remove }) => (
            <>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Row gutter={16} style={{ flex: 1, marginBottom: "0px" }}>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        label="Description"
                      >
                        <Input defaultValue="Agency Fee" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...field}
                        name={[field.name, "price"]}
                        label="SGD Price"
                      >
                        <InputNumber min={0} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {isEditing && (
                    <MinusCircleOutlined
                      style={{ marginLeft: "auto" }}
                      onClick={() =>
                        handleRemove(remove, field.name, "agencyFee")
                      }
                    />
                  )}
                </div>
              ))}
              <Form.Item>
                {isEditing && !haveAgencyFeeField && (
                  <Button
                    type="dashed"
                    onClick={handleAddAgencyFeeField}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Agency Fee field
                  </Button>
                )}
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider />
        <Form.List name="dynamicFields">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ name, ...restField }, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Row gutter={16} style={{ flex: 1, marginBottom: "0px" }}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        label="Description"
                      >
                        <Input disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        label="SGD Price"
                      >
                        <InputNumber min={0} step={0.1} disabled={!isEditing} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {isEditing && (
                    <MinusCircleOutlined
                      style={{ marginLeft: "auto" }}
                      onClick={() => remove(name)}
                    />
                  )}
                </div>
              ))}
              <Form.Item>
                {isEditing && (
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                )}
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider />
        <Row gutter={16} style={{ marginBottom: "0px" }}>
          <Col span={12}>
            <Form.Item label="Description" name="estimated_total_description">
              <Input defaultValue="Estimated Total SGD" disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="SGD Price" name="estimated_total">
              <InputNumber min={0} step={0.1} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16} style={{ marginTop: "0px" }}>
          <Col span={12}>
            <Form.Item label="Bank Name" name="bank_name">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Swift Code" name="swift_code">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Bank Address" name="bank_address">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Payable To" name="payable_to">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Bank Code" name="bank_code">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Account Number" name="account_number">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Address" name="tenant_address">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Telephone" name="tenant_telephone">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Fax" name="tenant_fax">
              <Input disabled />
            </Form.Item>
            <Form.Item label="HP" name="tenant_hp">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Email" name="tenant_email">
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* Dynamic fields section */}
      </Form>
    </div>
  );
};

export default BluShipping_InvoiceForm;
