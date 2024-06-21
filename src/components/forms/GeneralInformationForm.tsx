import React from "react";
import { Form, Input, Checkbox, DatePicker, Select } from "antd";
import { validateEmail } from "../../utils/validationUtils";

const { Option } = Select;

interface GeneralInformationFormProps {
  form: any;
  shipmentStatuses: string[];
  onActivitySelectionChange: (selectedActivities: string[]) => void;
}

const GeneralInformationForm: React.FC<GeneralInformationFormProps> = ({
  form,
  shipmentStatuses,
  onActivitySelectionChange,
}) => {
  const handleCheckboxChange = () => {
    const values = form.getFieldsValue();
    const selectedActivities: string[] = [];
    if (values.shipment_type.cargo_operations.cargo_operations) {
      selectedActivities.push("cargo_operations");
    }
    if (values.shipment_type.bunkering.bunkering) {
      selectedActivities.push("bunkering");
    }
    onActivitySelectionChange(selectedActivities);
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
          owner_matters: {
            owner_matters: false,
            activity: [],
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
        name="ETA"
        label="ETA"
        rules={[{ required: true, message: "Please input the ETA!" }]}
      >
        <DatePicker showTime={{ format: "HH:00" }} format="YYYY-MM-DD HH:00" />
      </Form.Item>
      <Form.Item
        name="voyage_number"
        label="Voyage Number"
        rules={[{ required: true, message: "Please input the Voyage Number!" }]}
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
          name={["shipment_type", "cargo_operations", "cargo_operations"]}
          valuePropName="checked"
        >
          <Checkbox onChange={handleCheckboxChange}>
            {" "}
            Cargo Operations{" "}
          </Checkbox>
        </Form.Item>
        <Form.Item
          name={["shipment_type", "bunkering", "bunkering"]}
          valuePropName="checked"
        >
          <Checkbox onChange={handleCheckboxChange}> Bunkering </Checkbox>
        </Form.Item>
        {/* <Form.Item
          name={["shipment_type", "owner_matters", "owner_matters"]}
          valuePropName="checked"
        >
          <Checkbox> Owner Matters </Checkbox>
        </Form.Item> */}
      </div>
    </Form>
  );
};

export default GeneralInformationForm;
