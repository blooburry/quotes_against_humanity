import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private configService: ConfigService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload): {payload: JwtPayload, accessToken: string} {
        const accessToken = req.get('Authorization')
        .replace('Bearer', '')
        .trim();

        console.log('[SERVER/AUTHGUARD] Access token correct: access granted to request.')

        return {
            payload,
            accessToken
        }
    }
}