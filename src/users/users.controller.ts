import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @Post('create-user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.UserService.create(createUserDto);
  }
}
