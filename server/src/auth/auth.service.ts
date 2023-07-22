import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { FIFTEEN_MINUTES, ONE_WEEK } from './constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async signupLocal(dto: AuthDTO): Promise<Tokens> {
        const hash = await this.hashData(dto.password);
        const newUser = await this.prismaService.user.create({
            data: {
                username: dto.username,
                passwordHash: hash,
            }
        });

        const tokens = this.generateTokens(newUser.id, newUser.username);

        return tokens;
    }

    async generateTokens(userId: number, username: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
                expiresIn: FIFTEEN_MINUTES,
            }),
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: ONE_WEEK,
            })
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    signinLocal() {
        //
    }
    logout() {
        //
    }
    refreshTokens() {
        //
    }
}
