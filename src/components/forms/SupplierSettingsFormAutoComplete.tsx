import React, { useEffect, useState } from "react";
import { Form, AutoComplete, Input } from "antd";
import { fetchSuppliers } from "../../api";
import { SupplierResponse } from "../../types";

interface SupplierFormAutoCompleteProps {
  form: any;
}

const SupplierFormAutoComplete: React.FC<SupplierFormAutoCompleteProps> = ({
  form,
}) => {
  const [supplierOptions, setSupplierOptions] = useState<SupplierResponse[]>(
    []
  );
  const [nameOptions, setNameOptions] = useState<{ value: string }[]>([]);

  useEffect(() => {
    const fetchAllSuppliers = async () => {
      try {
        const suppliers = await fetchSuppliers();
        setSupplierOptions(suppliers);
        setNameOptions(
          suppliers.map((supplier) => ({
            value: supplier.supplier_specifications.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };

    fetchAllSuppliers();
  }, []);

  const handleSupplierSelect = (value: string) => {
    const selectedSupplier = supplierOptions.find(
      (supplier) => supplier.supplier_specifications.name === value
    );
    if (selectedSupplier) {
      form.setFieldsValue({
        supplier: selectedSupplier.supplier_specifications.name,
        supplier_email: selectedSupplier.supplier_specifications.email,
        supplier_contact: selectedSupplier.supplier_specifications.contact,
      });

      console.log("Form Values after setting:", form.getFieldsValue());
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="supplier"
        label="Supplier"
        rules={[{ required: true, message: "Please select a Supplier!" }]}
      >
        <AutoComplete
          options={nameOptions}
          onSelect={handleSupplierSelect}
          placeholder="Select Supplier"
          style={{ width: "100%" }}
          filterOption={(inputValue, option) =>
            option!.value.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </Form.Item>
      <Form.Item
        name="supplier_email"
        label="Supplier Email"
        rules={[
          { required: true, message: "Please input the Supplier Email!" },
        ]}
      >
        <Input placeholder="Supplier Email" />
      </Form.Item>
      <Form.Item
        name="supplier_contact"
        label="Supplier Contact"
        rules={[
          { required: true, message: "Please input the Supplier Contact!" },
        ]}
      >
        <Input placeholder="Supplier Contact" />
      </Form.Item>
    </Form>
  );
};

export default SupplierFormAutoComplete;
