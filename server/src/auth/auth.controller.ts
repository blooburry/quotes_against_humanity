import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { JwtPayload, JwtPayloadWithRT, Tokens } from './types';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserWithRT } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDTO): Promise<Tokens> {
        console.log(`[AUTH/CONTROLLER]: local signup request with body: ${JSON.stringify(dto)}`);
        return this.authService.signupLocal(dto);
    }

    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDTO): Promise<Tokens> {
        console.log(`[AUTH/CONTROLLER]: local signin request with body: ${JSON.stringify(dto)}`);
        return this.authService.signinLocal(dto);
    }

    @Post('logout')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUser() user: JwtPayload) {

        console.log(`[AUTH/CONTROLLER]: Received logout request from user ${JSON.stringify(user)}.`);

        return this.authService.logout(+user.sub);
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserWithRT() user: JwtPayloadWithRT) {

        console.log(`[AUTH/CONTROLLER]: Received refresh request from ${JSON.stringify(user)}.`);

        return this.authService.refreshTokens(+user.sub, user.refreshToken);
    }
}
