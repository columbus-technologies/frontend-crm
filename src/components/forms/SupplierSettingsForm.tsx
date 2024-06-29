// import React from "react";
// import { Form, Input, Button, Space } from "antd";
// import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
// import ContactInput from "../common/ContactNumberCountryCodeInput";
// import { validateEmail } from "../../utils/validationUtils";

// interface SupplierFormProps {
//   form: any;
// }

// const SupplierForm: React.FC<SupplierFormProps> = ({ form }) => {
//   return (
//     <Form form={form} layout="vertical">
//       <Form.Item
//         name="name"
//         label="Supplier Name"
//         rules={[{ required: true, message: "Please input the Name!" }]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.List name="vessels">
//         {(fields, { add, remove }) => (
//           <>
//             {fields.map(({ key, name, fieldKey, ...restField }) => (
//               <Space
//                 key={key}
//                 style={{ display: "flex", marginBottom: 8 }}
//                 align="baseline"
//               >
//                 <Form.Item
//                   {...restField}
//                   name={[name, "vessel"]}
//                   label="Vessel"
//                   rules={[
//                     { required: true, message: "Please input the Vessel!" },
//                   ]}
//                 >
//                   <Input placeholder="Vessel" />
//                 </Form.Item>
//                 <MinusCircleOutlined onClick={() => remove(name)} />
//               </Space>
//             ))}
//             <Form.Item>
//               <Button
//                 type="dashed"
//                 onClick={() => add()}
//                 block
//                 icon={<PlusOutlined />}
//               >
//                 Add Vessel
//               </Button>
//             </Form.Item>
//           </>
//         )}
//       </Form.List>
//       <Form.Item
//         name="email"
//         label="Email"
//         rules={[
//           { required: true, message: "Please input the Email!" },
//           { validator: validateEmail },
//         ]}
//       >
//         <Input type="email" />
//       </Form.Item>
//       <Form.Item label="Contact">
//         <ContactInput />
//       </Form.Item>
//     </Form>
//   );
// };

// export default SupplierForm;

import React from "react";
import { Form, Input } from "antd";
import ContactInput from "../common/ContactNumberCountryCodeInput";
import { validateEmail } from "../../utils/validationUtils";

interface SupplierFormProps {
  form: any;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Supplier Name"
        rules={[{ required: true, message: "Please input the Name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input the Email!" },
          { validator: validateEmail },
        ]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item label="Contact">
        <ContactInput />
      </Form.Item>
    </Form>
  );
};

export default SupplierForm;
