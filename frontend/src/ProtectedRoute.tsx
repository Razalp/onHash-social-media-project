import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom';


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState<string | undefined|any>(undefined);
  

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    try {
      if (token) {
        const decode:any = jwtDecode(token);

        setIsAdmin(decode.isAdmin);

        if (decode.isAdmin!== allowedRole) {
          navigate('/log-in');
        }

      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    
    } 
  }, [token, navigate, allowedRole]);

  if (isAdmin === allowedRole ) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;