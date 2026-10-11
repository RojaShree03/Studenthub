
import { createRoot } from "react-dom/client";

import App from "./app/App";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/components.css";

createRoot(document.getElementById("root")).render(<App />);

