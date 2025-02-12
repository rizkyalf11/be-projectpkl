import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/users.dto';
import { LoginAdminDto } from 'src/admin/dto/admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('loginUser')
  async login(@Body() payload: LoginUserDto) {
    return this.authService.loginUser(payload);
  }

  @Post('loginAdmin')
  async loginAdmin(@Body() payload: LoginAdminDto) {
    return this.authService.loginAdmin(payload);
  }
}
