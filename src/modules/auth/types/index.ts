export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface TokenPayload {
  userId: string;
}

export interface GoogleUserInfo {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}
