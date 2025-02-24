import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from '@zpanel/core';

import { Inspector } from 'utils';

import { AuthService } from './auth.service';
import { TransformerService } from './transformer.service';
import { TokenService } from './token.service';
import { AuthGuard } from './auth.guard';

// ----------

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly transformerService: TransformerService,
    private readonly tokenService: TokenService,
  ) {}

  // --- GET: LOGGED IN USER DETAIL ---

  @AuthGuard.Protect()
  @Get('user')
  async getSignedInUserDetail() {
    const user = await new Inspector(
      this.authService.findSignedInUser(),
    ).essential(() => new UnauthorizedException());
    return this.transformerService.toAuthUserDetail(user);
  }

  // --- GET: LOGGED IN USER PERMISSIONS ---

  @Get('permissions')
  async getSignedInUserPermissionKeys(): Promise<string[]> {
    const signedInUserIsAdminRole =
      await this.authService.isSignedInUserAdminRole();

    const permissions = await (signedInUserIsAdminRole
      ? this.authService.findAdminUserPermissions()
      : this.authService.findSignedInUserPermissions());

    return permissions.map(this.transformerService.toPermissionKey);
  }

  // --- POST: SIGN UP ---

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const { name, email, introduction } = signUpDto;

    // Make sure the email hasn't been taken
    await new Inspector(this.authService.findUser({ where: { email } })).expect(
      null,
      () => Inspector.createValidationError(['email'], 'Email has registered'),
    );

    // Create new user
    await this.authService.createApplication({
      data: { name, email, introduction },
    });
  }

  // --- POST: SIGN IN ---

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const { email } = signInDto;
    const password = this.authService.encodePassword(signInDto.password);

    // Find the user which matched to email and password
    const user = await new Inspector(
      await this.authService.findUser({
        include: { role: { select: { clientId: true } } },
        where: { email, password },
      }),
    ).essential(
      () => new BadRequestException('Email or password is incorrect'),
    );

    // Create a new session and access token
    const refreshToken = await this.tokenService.grantRefreshToken(user);
    await this.tokenService.grantAccessToken(user, refreshToken);
  }

  // --- POST: SIGN OUT ---

  @Post('sign-out')
  async signOut() {
    await this.tokenService.expireTokens();
  }

  // --- POST: REQUEST TO RESET PASSWORD ---

  @Post('request-to-reset-password')
  async requestToResetPassword() {
    throw new BadRequestException('Work in progress');
  }
}
