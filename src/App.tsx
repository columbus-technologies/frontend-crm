import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import { StatusColoursProvider } from "./context/StatusColoursContext"; // Adjust the import path as necessary

const App: React.FC = () => {
  return (
    <StatusColoursProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StatusColoursProvider>
  );
};

export default App;
