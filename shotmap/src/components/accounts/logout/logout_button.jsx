import { useLogin } from '../../../context/login';

const LogoutButton = () => {
  const { logout } = useLogin();

  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;
