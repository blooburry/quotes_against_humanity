import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService, 
    UserService,
    PrismaService,
  ],
})
export class AppModule {}
