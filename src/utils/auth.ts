// src/util/auth.ts

// export const prepareAuthHeaders = () => {
//   const token = sessionStorage.getItem("jwtToken");
//   const headers = {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
//   return headers;
// };

// Using document.cookie (vanilla JS)
// export const prepareAuthHeaders = () => {
//   const name = "jwtToken";
//   const token = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith(name))
//     ?.split("=")[1];

//   const headers = {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
//   return headers;
// };

// const token = getCookieValue("jwtToken");
