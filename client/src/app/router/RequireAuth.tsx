import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../features/contact/configureStore"
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface Props{
  roles?:string[],
}

export default function RequireAuth({roles}:Props) {

  const { user } = useAppSelector(state => state.account);
  const location = useLocation();
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (roles && user && !roles.some(r => user.roles?.includes(r))) {
      setUnauthorized(true);
      toast.error('You are not authorized!!');
    }
  }, [roles, user]);

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (unauthorized) {
    return <Navigate to='/catalog' />;
  }

  return <Outlet />;
}
