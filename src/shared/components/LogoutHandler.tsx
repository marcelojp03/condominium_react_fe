import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts';

export const LogoutHandler: React.FC = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // elimina token
    navigate('/login'); // redirige
  }, [logout, navigate]);

  return null;
};
