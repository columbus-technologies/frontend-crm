import React, { useEffect, useState } from "react";
import { Form, Input, AutoComplete } from "antd";
import InputWithUnit from "../common/InputWithUnit";
import { validateFloat, validateInteger } from "../../utils/validationUtils";
import { fetchVessels } from "../../api"; // Add this import to fetch vessel data

interface VesselFormProps {
  form: any;
}

const VesselFormAutoComplete: React.FC<VesselFormProps> = ({ form }) => {
  const [vesselOptions, setVesselOptions] = useState<any[]>([]);
  const [imoOptions, setImoOptions] = useState<{ value: string }[]>([]);
  const [nameOptions, setNameOptions] = useState<{ value: string }[]>([]);

  useEffect(() => {
    const fetchAllVessels = async () => {
      try {
        const vessels = await fetchVessels();
        setVesselOptions(vessels);
      } catch (error) {
        console.error("Failed to fetch vessels:", error);
      }
    };

    fetchAllVessels();
  }, []);

  const handleVesselSelect = (value: string) => {
    const selectedVessel = vesselOptions.find(
      (vessel) =>
        vessel.imo_number.toString() === value || vessel.vessel_name === value
    );
    if (selectedVessel) {
      form.setFieldsValue({
        imo_number: selectedVessel.imo_number,
        vessel_name: selectedVessel.vessel_name,
        call_sign: selectedVessel.call_sign,
        sdwt: selectedVessel.sdwt,
        nrt: selectedVessel.nrt,
        flag: selectedVessel.flag,
        grt: selectedVessel.grt,
        loa: selectedVessel.loa,
      });
    }
  };

  const handleImoSearch = (value: string) => {
    setImoOptions(
      vesselOptions
        .filter((vessel) => vessel.imo_number.toString().includes(value))
        .map((vessel) => ({ value: vessel.imo_number.toString() }))
    );
  };

  const handleNameSearch = (value: string) => {
    setNameOptions(
      vesselOptions
        .filter((vessel) =>
          vessel.vessel_name.toLowerCase().includes(value.toLowerCase())
        )
        .map((vessel) => ({ value: vessel.vessel_name }))
    );
  };

  const handleImoFocus = () => {
    setImoOptions(
      vesselOptions.map((vessel) => ({ value: vessel.imo_number.toString() }))
    );
  };

  const handleNameFocus = () => {
    setNameOptions(
      vesselOptions.map((vessel) => ({ value: vessel.vessel_name }))
    );
  };

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
        <AutoComplete
          options={imoOptions}
          onSearch={handleImoSearch}
          onSelect={handleVesselSelect}
          onFocus={handleImoFocus}
          placeholder="Select IMO Number"
        />
      </Form.Item>
      <Form.Item
        name="vessel_name"
        label="Vessel Name"
        rules={[{ required: true, message: "Please input the Vessel Name!" }]}
      >
        <AutoComplete
          options={nameOptions}
          onSearch={handleNameSearch}
          onSelect={handleVesselSelect}
          onFocus={handleNameFocus}
          placeholder="Select Vessel Name"
        />
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

export default VesselFormAutoComplete;
