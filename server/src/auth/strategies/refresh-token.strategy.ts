import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private configService: ConfigService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true, 
        });
    }

    validate(req: Request, payload: JwtPayload): {payload: JwtPayload, refreshToken: string } {
        const refreshToken = req.get('authorization')
        .replace('Bearer', '')
        .trim();
        
        console.log('[SERVER/AUTHGUARD] Refresh token correct: access granted to request.')

        return {
            payload,
            refreshToken,
        };
    }
}
