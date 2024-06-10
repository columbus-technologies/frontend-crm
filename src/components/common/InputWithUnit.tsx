// import React from "react";
// import { Input } from "antd";

// interface InputWithUnitProps {
//   value?: number;
//   onChange?: (value: number) => void;
//   unit: string;
// }

// const InputWithUnit: React.FC<InputWithUnitProps> = ({
//   value,
//   onChange,
//   unit,
// }) => {
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = parseInt(e.target.value, 10);
//     if (!isNaN(newValue)) {
//       onChange?.(newValue);
//     }
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <Input
//         type="number"
//         value={value}
//         onChange={handleChange}
//         style={{ marginRight: "8px" }}
//       />
//       <span>{unit}</span>
//     </div>
//   );
// };

// export default InputWithUnit;

// src/components/InputWithUnit.tsx
import React from "react";
import { Input } from "antd";

interface InputWithUnitProps {
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
