import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from "./App";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import Layout from "./components/layout/layout";
import { AuthProvider } from "./components/context/auth.context";
import "./styles/global.css";
import ForgotPage from "./pages/forgot";
import ResetPage from "./pages/reset";
import ProductPage from "./pages/product";
import "antd/dist/reset.css";
import ProductDetail from "./pages/productDetail";
import Favorites from "./pages/favorites";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },

      {
        path: "products",
        element: <ProductPage />,
      },

      {
        path: "products/:id",
        element: <ProductDetail />, // 🔥 Move vào Layout => đã có Navbar
      },

      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "favorites", element: <Favorites /> }, // 🔥 cũng nên để vào Layout
    ],
  },

  { path: "forgot", element: <ForgotPage /> },
  { path: "reset", element: <ResetPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
