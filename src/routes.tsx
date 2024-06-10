import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LoginLayout from "./components/LoginLayout";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import VesselManagementSettings from "./pages/VesselManagementSettings";
import AgentManagementSettings from "./pages/AgentManagementSettings";
import CustomerManagementSettings from "./pages/CustomerManagementSettings";
import CategoryManagementActivityType from "./pages/CategoryManagementActivityType";
import CategoryManagementProductType from "./pages/CategoryManagementProductType";
import Login from "./pages/Login";
import Feed from "./pages/Feed";

const AppRoutes: React.FC = () => {
  return (
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
              <Route path="/feed" element={<Feed />} />
              <Route path="/shipments" element={<Shipments />} />
              <Route
                path="/customer-management-settings"
                element={<CustomerManagementSettings />}
              />
              <Route
                path="/vessel-management-settings"
                element={<VesselManagementSettings />}
              />
              <Route
                path="/agent-management-settings"
                element={<AgentManagementSettings />}
              />
              <Route
                path="/activity-types"
                element={<CategoryManagementActivityType />}
              />
              <Route
                path="/product-types"
                element={<CategoryManagementProductType />}
              />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
