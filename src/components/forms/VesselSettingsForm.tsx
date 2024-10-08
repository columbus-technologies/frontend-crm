import React from "react";
import { Form, Input } from "antd";
import InputWithUnit from "../common/InputWithUnit";
import { validateFloat, validateInteger } from "../../utils/validationUtils";

interface VesselFormProps {
  form: any;
}

const VesselForm: React.FC<VesselFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="imo_number"
        label="IMO Number"
        rules={[
          { required: true, message: "Please input the IMO Number!" },
          { validator: validateInteger },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="vessel_name"
        label="Vessel Name"
        rules={[{ required: true, message: "Please input the Vessel Name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="call_sign"
        label="Call Sign"
        rules={[{ required: true, message: "Please input the Call Sign!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="sdwt"
        label="SDWT"
        rules={[
          { required: true, message: "Please input the SDWT!" },
          { validator: validateInteger },
        ]}
      >
        <InputWithUnit unit="DWT" />
      </Form.Item>
      <Form.Item
        name="nrt"
        label="NRT"
        rules={[
          { required: true, message: "Please input the NRT!" },
          { validator: validateInteger },
        ]}
      >
        <InputWithUnit unit="NRT" />
      </Form.Item>
      <Form.Item
        name="flag"
        label="Flag"
        rules={[{ required: true, message: "Please input the Flag!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="grt"
        label="GRT"
        rules={[
          { required: true, message: "Please input the GRT!" },
          { validator: validateInteger },
        ]}
      >
        <InputWithUnit unit="GRT" />
      </Form.Item>
      <Form.Item
        name="loa"
        label="LOA"
        rules={[
          { required: true, message: "Please input the LOA!" },
          { validator: validateFloat },
        ]}
      >
        <InputWithUnit unit="metres" />
      </Form.Item>
    </Form>
  );
};

export default VesselForm;
