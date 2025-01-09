import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/errorPage.jsx";
import MainPage from "./pages/mainPage.jsx";
import HistoryPage from "./pages/historyPage.jsx";
import HeaderFooter from "./components/header/header.jsx";
import Login from "./App.jsx";
import About from "./pages/about.jsx";
import Predictions from "./pages/predictions.jsx";
import { LoginProvider } from "./context/loginContext.jsx";
import { Notifications } from "./components/notifications/notification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderFooter />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/history",
        element: <HistoryPage />,
      },
      {
        path: "/predictions",
        element: <Predictions />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoginProvider>
      <RouterProvider router={router} />
      <Notifications />
    </LoginProvider>
  </React.StrictMode>
);
