import React, { useEffect, useState } from "react";
import { Form, Input, Select, AutoComplete, Checkbox, DatePicker } from "antd";
import { validateEmail } from "../../utils/validationUtils";
import { fetchVessels, getAllAgents } from "../../api";
import { Tabs } from "antd";

const { TabPane } = Tabs;
const { Option } = Select;

interface GeneralInformationFormPropsV2 {
  form: any;
  shipmentStatuses: string[];
  onActivitySelectionChange: (selectedActivities: string[]) => void;
  terminalLocations: string[];
  customerNames: string[];
}

const GeneralInformationFormV2: React.FC<GeneralInformationFormPropsV2> = ({
  form,
  shipmentStatuses,
  onActivitySelectionChange,
  terminalLocations,
  customerNames,
}) => {
  const [nameVesselOptions, setNameVesselOptions] = useState<
    { value: string }[]
  >([]);
  const [vesselOptions, setVesselOptions] = useState<any[]>([]);
  const [agentOptions, setAgentOptions] = useState<any[]>([]);
  const [nameAgentOptions, setNameAgentOptions] = useState<{ value: string }[]>(
    []
  );
  const [isCargoOperationsChecked, setIsCargoOperationsChecked] =
    useState(false);
  const [isBunkeringChecked, setIsBunkeringChecked] = useState(false); // New state for bunkering checkbox

  const falseValue = false;

  const handleCheckboxChange = () => {
    const values = form.getFieldsValue();
    const selectedActivities: string[] = [];

    // Handle Cargo Operations checkbox
    if (values.shipment_type.cargo_operations.cargo_operations) {
      selectedActivities.push("cargo_operations");
      setIsCargoOperationsChecked(true);
    } else {
      setIsCargoOperationsChecked(false);
    }

    // Handle Bunkering checkbox
    if (values.shipment_type.bunkering.bunkering) {
      selectedActivities.push("bunkering");
      setIsBunkeringChecked(true);
    } else {
      setIsBunkeringChecked(false);
    }

    onActivitySelectionChange(selectedActivities);
  };

  useEffect(() => {
    const fetchAllVessels = async () => {
      try {
        const vessels = await fetchVessels();
        setVesselOptions(vessels);
      } catch (error) {
        console.error("Failed to fetch vessels:", error);
      }
    };

    const fetchAllAgents = async () => {
      try {
        const agents = await getAllAgents();
        setAgentOptions(agents);
        setNameVesselOptions(agents.map((agent) => ({ value: agent.name })));
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      }
    };

    fetchAllVessels();
    fetchAllAgents();
  }, []);

  const handleAgentNameSearch = (value: string) => {
    setNameAgentOptions(
      agentOptions
        .filter((agent) =>
          agent.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((agent) => ({ value: agent.name }))
    );
  };

  const handleVesselNameSearch = (value: string) => {
    setNameVesselOptions(
      vesselOptions
        .filter((vessel) =>
          vessel.vessel_name.toLowerCase().includes(value.toLowerCase())
        )
        .map((vessel) => ({ value: vessel.vessel_name }))
    );
  };

  const handleVesselSelect = (value: string) => {
    const selectedVessel = vesselOptions.find(
      (vessel) =>
        vessel.imo_number.toString() === value || vessel.vessel_name === value
    );
    console.log(selectedVessel, "ASd");
    if (selectedVessel) {
      form.setFieldsValue({
        vessel_specifications: {
          imo_number: selectedVessel.imo_number,
          vessel_name: selectedVessel.vessel_name,
          call_sign: selectedVessel.call_sign,
          sdwt: selectedVessel.sdwt,
          nrt: selectedVessel.nrt,
          flag: selectedVessel.flag,
          grt: selectedVessel.grt,
          loa: selectedVessel.loa,
        },
      });

      console.log("ds");
    }
    // Use a small delay to ensure the form has been updated before logging the values
    setTimeout(() => {
      console.log(form.getFieldsValue(), "Updated form values");
    }, 0);
  };

  const handleAgentSelect = (value: string) => {
    const selectedAgent = agentOptions.find((agent) => agent.name === value);
    if (selectedAgent) {
      console.log(selectedAgent, "selectedAgent");
      const [phoneCode, ...contactParts] = selectedAgent.contact.split(" ");
      const contact = contactParts.join(" ");

      form.setFieldsValue({
        shipment_details: {
          agent_details: {
            name: selectedAgent.name,
            email: selectedAgent.email,
            phoneCode: phoneCode,
            contact: contact,
          },
        },
      });
    }
  };

  const handleAgentNameFocus = () => {
    setNameAgentOptions(agentOptions.map((agent) => ({ value: agent.name })));
  };

  const handleVesselNameFocus = () => {
    setNameVesselOptions(
      vesselOptions.map((vessel) => ({ value: vessel.vessel_name }))
    );
  };

  return (
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
          cargo_operations: {
            cargo_operations: false,
            cargo_operations_activity: [],
          },
          bunkering: {
            bunkering: false,
            bunkering_activity: [],
          },
        },
      }}
    >
      <Form.Item
        name="master_email"
        label="Master Email"
        rules={[
          { required: true, message: "Please input the Master Email!" },
          { validator: validateEmail },
        ]}
      >
        <Input type="email" />
      </Form.Item>

      <Form.Item
        name="invoice_customer_name"
        label="Customer Name (For Invoicing)"
        rules={[
          { required: true, message: "Please input the Charterer Name!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="ETA" label="ETA">
        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>
      <Form.Item
        name={["vessel_specifications", "imo_number"]}
        label="IMO Number"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["vessel_specifications", "call_sign"]}
        label="Call Sign"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["vessel_specifications", "sdwt"]}
        label="SDWT"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["vessel_specifications", "nrt"]}
        label="NRT"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["vessel_specifications", "flag"]}
        label="Flag"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["vessel_specifications", "grt"]}
        label="GRT"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={["vessel_specifications", "loa"]}
        label="LOA"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={["shipment_details", "agent_details", "name"]}
        label="Agent Name"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={["shipment_details", "agent_details", "email"]}
        label="Agent Email"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={["shipment_details", "agent_details", "phoneCode"]}
        label="Phone Code"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={["shipment_details", "agent_details", "contact"]}
        label="Contact"
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={["vessel_specifications", "vessel_name"]}
        label="Vessel Name"
        rules={[{ required: true, message: "Please input the Vessel Name!" }]}
      >
        <AutoComplete
          options={nameVesselOptions}
          onSearch={handleVesselNameSearch}
          onSelect={handleVesselSelect}
          onFocus={handleVesselNameFocus}
          placeholder="Select Vessel Name"
        />
      </Form.Item>

      <Form.Item
        name={["shipment_details", "agent_details", "name"]}
        label="Agent Officer Name"
        rules={[{ required: true, message: "Please input the Name!" }]}
      >
        <AutoComplete
          options={nameAgentOptions}
          onSearch={handleAgentNameSearch}
          onSelect={handleAgentSelect}
          onFocus={handleAgentNameFocus}
          placeholder="Start typing to search"
        />
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
          name={["shipment_type", "cargo_operations", "cargo_operations"]}
          valuePropName="checked"
        >
          <Checkbox onChange={handleCheckboxChange}>Cargo Operations</Checkbox>
        </Form.Item>
        <Form.Item
          name={["shipment_type", "bunkering", "bunkering"]}
          valuePropName="checked"
        >
          <Checkbox onChange={handleCheckboxChange}>Bunkering</Checkbox>
        </Form.Item>
      </div>

      {/* Conditionally render form fields for Cargo Operations */}
      <Tabs defaultActiveKey="1">
        {isCargoOperationsChecked && (
          <TabPane tab="Cargo Operations" key="1">
            <Form.Item
              name={["cargo_operations", "customer_specifications", "customer"]}
              label="Customer"
              rules={[
                { required: true, message: "Please input the Customer!" },
              ]}
            >
              <AutoComplete
                options={customerNames.map((customer) => ({
                  value: customer,
                }))}
                placeholder="Customer"
                style={{ width: "100%" }}
                filterOption={(inputValue, option) =>
                  option!.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              name={["cargo_operations", "terminal_name"]}
              label="Terminal Name"
              rules={[
                { required: true, message: "Please input the Terminal!" },
              ]}
            >
              <AutoComplete
                options={terminalLocations.map((location) => ({
                  value: location,
                }))}
                placeholder="Terminal Name"
                style={{ width: "100%" }}
                filterOption={(inputValue, option) =>
                  option!.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>
          </TabPane>
        )}

        {isBunkeringChecked && (
          <TabPane tab="Bunkering" key="2">
            <Form.Item
              name={["bunkering", "customer_name"]}
              label="Customer"
              rules={[{ required: true, message: "Please input customer!" }]}
            >
              <AutoComplete
                options={customerNames.map((customer) => ({
                  value: customer,
                }))}
                placeholder="Customer"
                style={{ width: "100%" }}
                filterOption={(inputValue, option) =>
                  option!.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </Form.Item>
            {/* Add other bunkering-specific fields here */}
          </TabPane>
        )}
      </Tabs>
    </Form>
  );
};

export default GeneralInformationFormV2;
