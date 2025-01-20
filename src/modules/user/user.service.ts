import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findById(id: number): Promise<User | undefined> {
    const user = this.users.find((user) => {
      console.log(typeof user.userId, typeof id);
      return user.userId === id;
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async findAll(requestId: string): Promise<User[]> {
    try {
      this.logger.logMessage(
        requestId,
        'info',
        `Creating user with data: ${JSON.stringify(this.users)}`,
      );
      console.log({ requestId }, 'This is a test log message.');
      return this.users;
    } catch (error) {
      this.logger.logError(requestId, 'Error creating user', error);
      throw error;
    }
  }
}
