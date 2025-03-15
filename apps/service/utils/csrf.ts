import { ForbiddenException } from '@nestjs/common';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { includes } from 'lodash';
import * as jwt from 'jsonwebtoken';

// ----------

interface CSRFProtectionConfig {
  cookieName: string;
  secret: string;
  excludePaths?: string[];
  cookieOptions?: CookieOptions;
  jwtOptions?: jwt.SignOptions;
  getCSRFToken: (req: Request) => string;
}

class CSRFProtection {
  constructor(private config: CSRFProtectionConfig) {}

  public middleware = (req: Request, _res: Response, next: NextFunction) => {
    if (includes(['GET', 'HEAD', 'OPTIONS'], req.method)) {
      return next();
    }

    if (this.config.excludePaths?.some((path) => req.path.startsWith(path))) {
      return next();
    }

    this.verify(req);
    next();
  };

  public renewCSRFToken = (req: Request, res: Response) => {
    const csrfToken = this.generateCSRFToken();

    res.cookie(
      this.config.cookieName,
      csrfToken,
      this.config.cookieOptions ?? {},
    );
  };

  public clearCSRFToken = (res: Response) => {
    res.clearCookie(this.config.cookieName);
  };

  // --- PRIVATE ---

  private verify(req: Request) {
    const csrfToken = this.config.getCSRFToken(req);
    if (!csrfToken) throw new ForbiddenException('Invalid CSRF token');

    if (req.cookies['x-csrf-token'] !== csrfToken)
      throw new ForbiddenException('Invalid CSRF token');

    if (!jwt.verify(csrfToken, this.config.secret))
      throw new ForbiddenException('Invalid CSRF token');

    return csrfToken;
  }

  private generateCSRFToken() {
    return jwt.sign({}, this.config.secret, this.config.jwtOptions);
  }
}

export const csrf = new CSRFProtection({
  cookieName: 'x-csrf-token',
  secret: process.env.CSRF_SECRET_KEY || '',
  excludePaths: ['/auth'],
  getCSRFToken: (req) => req.header('x-csrf-token')!,
  cookieOptions: {
    httpOnly: false, // let the client read the cookie
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
  jwtOptions: {
    expiresIn: 60 * 60 * 1000,
  },
});
