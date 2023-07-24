import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { Options } from 'argon2';
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

        const tokens = await this.generateTokens(newUser.id, newUser.username);

        await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

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

    async updateRefreshTokenHash(userId: number, refreshToken: string) {
        const refreshTokenHash = await argon2.hash(refreshToken);

        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshTokenHash,
            }
        })
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async signinLocal(dto: AuthDTO): Promise<Tokens> {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: dto.username,
            }
        });

        if(!user) throw new NotFoundException('Cannot sign in: user not found');
        
        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);

        if(!passwordMatches) throw new ForbiddenException('Cannot sign in: password does not match');

        const tokens = await this.generateTokens(user.id, user.username);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }
    
    async logout(userId: number) {
        await this.prismaService.user.updateMany({
            where: {
                id: userId,
                refreshTokenHash: {
                    not: null,
                },
            },
            data: {
                refreshTokenHash: null,
            }
        });
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            }
        });

        if(!user) throw new NotFoundException('Cannot refresh tokens: user not found');

        if(!user.refreshTokenHash) throw new ForbiddenException('Cannot refresh tokens: user is logged out. Please sign in to get new tokens.');

        const refreshTokenMatches = await argon2.verify(user.refreshTokenHash, refreshToken);

        if(!refreshTokenMatches) throw new ForbiddenException('Cannot refresh tokens: refresh token does not match');

        const tokens = await this.generateTokens(user.id, user.username);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }
}
