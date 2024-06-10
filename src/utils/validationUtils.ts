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
