import type { Request, Response } from 'express';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { csrf } from 'utils';
import { Model } from 'src/database';

// ----------

@Injectable()
export class TokenService {
  private readonly refreshTTL = 24 * 60 * 60 * 1000;
  private readonly accessTTL = 1 * 60 * 1000;
  private readonly cookieName = {
    refreshToken: 'refreshToken',
    accessToken: 'accessToken',
  };
  private readonly response: Response;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.response = request.res!;
  }

  /**
   * Grants a new refresh token.
   */
  public grantRefreshToken = async (user: Model.User) => {
    const refreshTokenData: TokenService.RefreshTokenData = {
      userId: user.clientId,
    };

    const refreshToken = await this.jwtService.signAsync(refreshTokenData, {
      expiresIn: this.refreshTTL / 1000,
      secret: this.getSecretKey(),
    });

    this.response.cookie(this.cookieName.refreshToken, refreshToken, {
      sameSite: 'lax',
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });

    return refreshToken as TokenService.RefreshToken;
  };

  /**
   * Grants a new access token.
   */
  public grantAccessToken = async (
    user: Model.User & { role: Pick<Model.Role, 'clientId'> },
    assignedRefreshToken?: TokenService.RefreshToken,
  ) => {
    const refreshToken = assignedRefreshToken ?? this.findRefreshToken();
    const accessTokenData: TokenService.AccessTokenData = {
      userId: user.clientId,
      roleId: user.role.clientId,
    };

    const accessToken = await this.jwtService.signAsync(accessTokenData, {
      expiresIn: this.accessTTL / 1000,
      secret: this.getSecretKey(refreshToken),
    });

    this.response.cookie(this.cookieName.accessToken, accessToken, {
      sameSite: 'lax',
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });

    return accessToken as TokenService.RefreshToken;
  };

  /**
   * Finds the refresh token.
   */
  public findRefreshToken = () => {
    const refreshToken = this.request.cookies[
      this.cookieName.refreshToken
    ] as TokenService.RefreshToken;
    return refreshToken;
  };

  /**
   * Finds the access token.
   */
  public findAccessToken = () => {
    const accessToken = this.request.cookies[
      this.cookieName.accessToken
    ] as TokenService.AccessToken;
    return accessToken;
  };

  /**
   * Expires both access and refresh tokens.
   */
  public expireTokens = () => {
    this.response
      .clearCookie(this.cookieName.accessToken)
      .clearCookie(this.cookieName.refreshToken);
    csrf.clearCSRFToken(this.response);
  };

  /**
   * Verifies the refresh token's validity.
   */
  public verifyRefreshToken = async (
    refreshToken: TokenService.RefreshToken,
  ): Promise<TokenService.RefreshTokenData> => {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: this.getSecretKey(),
      });
    } catch {
      throw new UnauthorizedException();
    }
  };

  /**
   * Verifies the access token's validity.
   */
  public verifyAccessToken = async (
    accessToken: TokenService.AccessToken,
  ): Promise<TokenService.AccessTokenData> => {
    try {
      return await this.jwtService.verifyAsync(accessToken, {
        secret: this.getSecretKey(this.findRefreshToken()),
      });
    } catch {
      throw new UnauthorizedException();
    }
  };

  private getSecretKey = (...secrets: string[]) => {
    return `:${[...secrets, this.configService.getOrThrow('JWT_SECRET_KEY')].join(':')}:`;
  };
}

// ----- RELATED TYPES -----

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TokenService {
  export type RefreshToken = string & { $type: 'refresh' };
  export type AccessToken = string & { $type: 'access' };

  export type RefreshTokenData = { userId: string };
  export type AccessTokenData = RefreshTokenData & { roleId: string };
}
