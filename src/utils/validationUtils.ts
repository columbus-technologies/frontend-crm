// src/util/validationUtils.ts

export const validateInteger = (_: any, value: any) => {
  if (!Number.isInteger(Number(value))) {
    return Promise.reject(new Error("Value must be an integer"));
  }
  return Promise.resolve();
};

export const validateFloat = (_: any, value: any) => {
  if (isNaN(value) || !Number(value)) {
    return Promise.reject(new Error("Value must be a float"));
  }
  return Promise.resolve();
};

export const validateEmail = (_: any, value: any) => {
  // Regular expression for validating an Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    return Promise.reject(new Error("Email is required"));
  }
  if (!emailPattern.test(value)) {
    return Promise.reject(new Error("Invalid email address"));
  }
  return Promise.resolve();
};

export const validateAtLeastOneCheckbox = (
  fields: string[],
  form: any
): boolean => {
  const values = form.getFieldsValue();
  console.log("Form Values:", values); // Debug log

  const isValid = fields.some((field) => {
    const fieldParts = field.split(".");
    const fieldValue = fieldParts.reduce(
      (acc, part) => acc && acc[part],
      values
    );
    console.log(`Field: ${field}, Value: ${fieldValue}`); // Debug log
    return fieldValue;
  });

  console.log("Validation Result:", isValid); // Debug log

  return isValid;
};
