import type { JwtPayload } from '@/shared';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
