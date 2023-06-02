import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserRole } from 'src/@types';
import { useAppCookies } from 'src/hooks';
import { __DEV__, appCookies } from 'src/utils';

function OnBoardGuard({ children }: { children: React.ReactNode }) {
  const [cookies] = useAppCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.isWorkspaceActive === 'false') {
      navigate('/onboard');
    }
  }, [cookies.isWorkspaceActive, navigate]);

  return <>{children}</>;
}

export default OnBoardGuard;
