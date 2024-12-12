import React from "react";
import { Outlet } from "react-router-dom";
import "./header.css"
import "./footer.css"
import { useLogin } from '../../context/login.jsx';
import LogoutButton from '../accounts/logout/logout_button.jsx';
import { Link } from "react-router-dom";

const Layout = () => {
  const { user } = useLogin();
  return (
    <div>
      <header className="header">
      <nav>
        <Link to="/">Instrument</Link>
        <Link to="/history">History</Link>
        {user ? (
          <>
            <p>Welcome, {user.email}</p>
            <LogoutButton />
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2024 Niko Mast.</p>
      </footer>
    </div>
  );
};

export default Layout;
