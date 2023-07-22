import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  PrismaModule,
  AuthModule,
  ConfigModule.forRoot(),
],
  controllers: [AppController, UsersController],
  providers: [
    AppService, 
    UserService,
    PrismaService,
  ],
})
export class AppModule {}
