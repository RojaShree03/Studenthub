
import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Favourite from "../pages/Favourite";
import StudentDetails from "../pages/StudentDetails";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

import StudentManagementPage from "../features/student-management/pages/StudentManagementPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "students/:studentId",
        element: <StudentDetails />,
      },
      {
        path: "favourites",
        element: <Favourite />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "student-management",
        element: <StudentManagementPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
