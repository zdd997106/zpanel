import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import {
  RequestToResetPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from '@zpanel/core';
import { Request } from 'express';
import { csrf } from 'utils';

import { AuthGuard } from 'modules/guards';

import { AuthService } from './auth.service';
import { TransformerService } from './transformer.service';

// ----------

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly transformerService: TransformerService,
  ) {}

  // --- GET: LOGGED IN USER DETAIL ---

  @AuthGuard.Protect()
  @Get()
  async getSignedInUserDetail(@Req() req: Request) {
    const signInUser = await this.authService.getSignedInUser();

    csrf.renewCSRFToken(req, req.res!);

    return this.transformerService.toAuthUserDto(signInUser);
  }

  // --- GET: LOGGED IN USER PERMISSIONS ---

  @AuthGuard.Protect()
  @Get('permissions')
  async getRolePermissions(): Promise<string[]> {
    const rolePermissions = await this.authService.getRolePermissions();
    return rolePermissions.map(this.transformerService.toPermissionKey);
  }

  // --- POST: SIGN UP ---

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.createApplication(signUpDto);
  }

  // --- POST: SIGN IN ---

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    await this.authService.signIn(signInDto);
  }

  // --- POST: SIGN OUT ---

  @AuthGuard.Protect()
  @Post('sign-out')
  async signOut() {
    await this.authService.signOut();
  }

  // --- POST: REQUEST TO RESET PASSWORD ---

  @Post('request-to-reset-password')
  async requestToResetPassword(
    @Body() requestToResetPasswordDto: RequestToResetPasswordDto,
  ) {
    await this.authService.requestToResetPassword(requestToResetPasswordDto);
  }

  // --- POST: RESET PASSWORD ---

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
  }
}
