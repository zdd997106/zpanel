import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  Inject,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { Inspector } from 'utils';
import { DatabaseService } from 'modules/database';

import { TokenService } from './token.service';

// ----------

/**
 * Guard to protect routes based on user authentication.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly databaseService: DatabaseService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  static Protect() {
    return UseGuards(AuthGuard);
  }

  /**
   * Determines whether the request is authorized.
   */
  async canActivate(): Promise<boolean> {
    try {
      await this.checkIfRequestHasValidated();
      await this.authenticate();
      return true;
    } catch (error) {
      // Clears and expires tokens if authentication failed
      if (error instanceof UnauthorizedException) {
        await this.tokenService.expireTokens();
      }

      throw error;
    }
  }

  /**
   * Check if the request has been protect by protection middleware
   */
  private checkIfRequestHasValidated() {
    // [NOTE]: If app key check is passed, CSRF check is not required
    if (this.request.protections?.appKey) return true;

    if (this.request.protections?.csrf) return true;

    throw new ForbiddenException();
  }

  /**
   * Authenticate based on user's signed-in status.
   */
  private async authenticate() {
    // Skip if already authenticated
    if (this.request.signedInInfo) return true;

    const refreshToken = await this.tokenService.findRefreshToken();
    const accessToken = await this.tokenService.findAccessToken();

    // Check: Refresh Token should exist
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    // Update login information in request context
    this.request.signedInInfo = await (async () => {
      try {
        // Check: Access Token should exist
        if (!accessToken) {
          throw new UnauthorizedException();
        }

        // Decode auth user data
        const accessTokenData =
          await this.tokenService.verifyAccessToken(accessToken);
        return {
          userId: accessTokenData.userId,
          roleId: accessTokenData.roleId,
        };
      } catch {
        // Check: Refresh Token should be valid
        const refreshTokenData =
          await this.tokenService.verifyRefreshToken(refreshToken);

        // Extract auth user data
        const user = await new Inspector(
          this.databaseService.user.findUnique({
            include: { role: { select: { clientId: true } } },
            where: { clientId: refreshTokenData.userId },
          }),
        )
          .essential()
          .otherwise(() => new UnauthorizedException());

        // Generate a new access token
        await this.tokenService.grantAccessToken(user);

        return { userId: user.clientId, roleId: user.role.clientId };
      }
    })();
  }
}

declare module 'express' {
  interface Request {
    protections: undefined | Partial<Record<'csrf' | 'appKey', boolean>>;
  }
}
