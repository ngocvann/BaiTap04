import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import Layout from "./components/layout/layout";
import { AuthWrapper } from "./components/context/AuthWrapper";
import "./styles/global.css";
import ForgotPage from "./pages/forgot";
import ResetPage from "./pages/reset";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
  {
    path: "forgot",
    element: <ForgotPage />,
  },
  {
    path: "reset",
    element: <ResetPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
);
