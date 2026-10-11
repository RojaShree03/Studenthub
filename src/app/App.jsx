
import { RouterProvider } from "react-router-dom";

import router from "./routes";
import { StudentProvider } from "../context/StudentContext";

export default function App() {
  return (
    <StudentProvider>
      <RouterProvider router={router} />
    </StudentProvider>
  );
}

