import { UserService, User } from './user.service';
import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly logger: LoggerService,
  ) {}
  @Get()
  findAll(@Req() req: Request): Promise<User[]> {
    const requestId = req['requestId'];
    this.logger.logRequestMessage(
      requestId,
      `Controller Creating user with data:}`,
    );
    return this.userService.findAll(requestId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findById(id);
  }
}
