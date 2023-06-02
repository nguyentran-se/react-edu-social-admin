import { UserRole } from './user';

export interface LoginResponse {
  workspaceDomain?: string;
  user: { eduMail: string; role: UserRole };
  accessToken: string;
  refreshToken: string;
}
