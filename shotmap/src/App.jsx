import React, { useState } from 'react';
import Register from './components/accounts/register/register';
import Login from './components/accounts/login/login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access'));

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <Login onLogin={() => setIsAuthenticated(true)} />
        </>
      )}
    </div>
  );
};

export default App;
