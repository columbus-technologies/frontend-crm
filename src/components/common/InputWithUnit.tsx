import React from "react";
import { Input, InputProps } from "antd";

interface InputWithUnitProps extends InputProps {
  unit: string;
}

const InputWithUnit: React.FC<InputWithUnitProps> = ({ unit, ...props }) => {
  return (
    <Input
      {...props}
      addonAfter={<span style={{ whiteSpace: "nowrap" }}>{unit}</span>}
    />
  );
};

export default InputWithUnit;
