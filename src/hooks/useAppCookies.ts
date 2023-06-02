import { Cookies, useCookies } from 'react-cookie';
import { CookieNames } from 'src/utils';

type Res = typeof CookieNames[keyof typeof CookieNames];

const cookieNamesValue = Object.values(CookieNames);

type TCookies = {
  [Key in Res]?: any;
};

export function useAppCookies() {
  return useCookies<string, TCookies>(cookieNamesValue);
}
