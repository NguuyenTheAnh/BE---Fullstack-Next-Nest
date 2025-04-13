import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public, ResponseMessage } from './decorator/customize';
import { RegisterDto, VerifyDto } from './auth/dto/auth.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) { }


  @UseGuards(LocalAuthGuard)
  @Public()
  @ResponseMessage('User Login')
  @Post('auth/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage('User Register')
  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @ResponseMessage('Verify User')
  @Post('auth/verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }

  @Public()
  @ResponseMessage('Resend code to verify user')
  @Post('auth/resend')
  async resend(@Body('email') email: string) {
    return this.authService.resend(email);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

}
