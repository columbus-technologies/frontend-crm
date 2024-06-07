import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "/src/styles/index.css"; // Ensure the CSS file is imported

// StrictMode: Used primarily in development to identify potential problems in an application. It double-invokes certain lifecycle methods and hooks, including useEffect, to help surface issues.

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
