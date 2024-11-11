import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { cart } = useSelector((state: any) => state.root.cart);
  const { credentialDetails } = useSelector((state: any) => state.root.user);

  if (Object.keys(cart).length === 0) {
    if (credentialDetails?.user) {
      return <Navigate to='/' />;
    } else {
      return <Navigate to='/login' />;
    }
  } else {
    return <>{children}</>;
  }
};

export default ProtectedRoute;
