import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { JwtPayload } from './types';
import { Tokens } from '@shared/types';
import { AccessTokenGuard, RefreshTokenGuard } from '@server/common/guards'
import { GetCurrentPayload } from '@server/common/decorators';
import { GetCurrentToken } from '@server/common/decorators/get-current-token.decorator';
import { RefreshExceptionFilter, SigninExceptionFilter, SignupExceptionFilter } from './exception-filters';
import { LogoutExceptionFilter } from './exception-filters/logout.filter';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    @UseFilters(SignupExceptionFilter)
    signupLocal(@Body() dto: AuthDTO): Promise<Tokens> {
        console.log(`[AUTH/CONTROLLER]: local signup request with body: ${JSON.stringify(dto)}`);
        return this.authService.signupLocal(dto);
    }

    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    @UseFilters(SigninExceptionFilter)
    signinLocal(@Body() dto: AuthDTO): Promise<Tokens> {
        console.log(`[AUTH/CONTROLLER]: local signin request with body: ${JSON.stringify(dto)}`);
        return this.authService.signinLocal(dto);
    }

    @Post('logout')
    @UseGuards(AccessTokenGuard)
    @UseFilters(LogoutExceptionFilter)
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentPayload() payload: JwtPayload) {

        console.log(`[AUTH/CONTROLLER]: Received logout request from user ${payload.username}.`);

        return this.authService.logout(+payload.sub);
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    @UseFilters(RefreshExceptionFilter)
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentPayload() payload: JwtPayload, @GetCurrentToken() refreshToken: string) {

        console.log(`[AUTH/CONTROLLER]: Received refresh request from user ${payload.username}.`);

        return this.authService.refreshTokens(+payload.sub, refreshToken);
    }
}
