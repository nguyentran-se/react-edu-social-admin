import React, { useEffect } from 'react';
import { UserRole } from 'src/@types';
import { useAppCookies } from 'src/hooks';
import { __DEV__, appCookies } from 'src/utils';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [cookies] = useAppCookies();
  const refreshToken = cookies.refreshToken;
  const accessToken = cookies.accessToken;
  if (!refreshToken) {
    window.location.href = __DEV__
      ? 'http://localhost:8000/verify'
      : process.env.REACT_APP_REDIRECT_URL;
    return null;
  }
  if (accessToken) {
    const user = appCookies.getDecodedAccessToken();
    if (user?.role !== UserRole.WorkspaceAdmin) {
      appCookies.clearAll();
      window.location.href = __DEV__
        ? 'http://localhost:8000/verify'
        : process.env.REACT_APP_REDIRECT_URL;
      return null;
    }
  }
  return <>{children}</>;
}

export default AuthGuard;
