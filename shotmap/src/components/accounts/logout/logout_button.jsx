import { useLogin } from '../../../context/loginContext';


const LogoutButton = () => {
  const { logout } = useLogin();

  return <button className="nav-button" onClick={logout}>Logout</button>;
};

export default LogoutButton;
