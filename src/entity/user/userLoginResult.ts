export interface UserLoginResult {
  success: boolean;

  token: string;

  message: string;

  lastLoginTime: string;
  lastLoginIp: string;
}
