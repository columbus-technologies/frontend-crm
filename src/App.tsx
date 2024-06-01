import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LoginLayout from "./components/LoginLayout";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import VesselSettings from "./pages/VesselSettings";
import CustomerManagementSettings from "./pages/CustomerManagementSettings";
// import Login from "./pages/Login";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        />
        <Route
          path="*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shipments" element={<Shipments />} />
                <Route
                  path="/customer-management-settings"
                  element={<CustomerManagementSettings />}
                />
                <Route path="/vessel-settings" element={<VesselSettings />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
