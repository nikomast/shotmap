import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./header.css";
import "./footer.css";
import { useLogin } from '../../context/loginContext.jsx';
import LogoutButton from '../accounts/logout/logout_button.jsx';

const Layout = () => {
  const { user } = useLogin();
  return (
    <div>
      <header className="header">
        <nav>
          <Link to="/" className="nav-button">Tracker</Link>
          <Link to="/history" className="nav-button">History</Link>
          {/**<Link to="/predictions" className="nav-button">Predictions</Link>**/}
          <Link to="/about" className="nav-button">About</Link>
          {user ? (
            <>
              <LogoutButton/>
            </>
          ) : (
            <Link to="/login" className="nav-button">Login</Link>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2025 Niko Mast.</p>
      </footer>
    </div>
  );
};

export default Layout;
