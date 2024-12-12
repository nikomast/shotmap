import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './pages/errorPage.jsx';
import MainPage from './pages/mainPage.jsx';
import HistoryPage from './pages/historyPage.jsx';
import HeaderFooter from './components/header/header.jsx';
import Login from './App.jsx';
import { LoginProvider } from './context/login.jsx';


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
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoginProvider>
      <RouterProvider router={router} />
    </LoginProvider>
  </React.StrictMode>
);
