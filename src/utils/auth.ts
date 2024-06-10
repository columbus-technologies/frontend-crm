// src/util/auth.ts

export const prepareAuthHeaders = () => {
  const token = sessionStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return headers;
};
