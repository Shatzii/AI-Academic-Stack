import 'express-session';

declare module 'express-session' {
  interface Session {
    token?: string;
  }
}