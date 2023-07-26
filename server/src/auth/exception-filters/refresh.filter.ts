import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError } from 'rxjs';

@Catch()
export class RefreshExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log(`[SERVER/REFRESHEXCEPTIONFILTER] ${JSON.stringify(exception)}`);

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'The session could not be refreshed.';

        if (exception instanceof NotFoundException) {
            status = HttpStatus.UNAUTHORIZED;
            message = 'Cannot refresh tokens: user not found';
        }
        else if (exception instanceof ForbiddenException){
            status = HttpStatus.FORBIDDEN;
            message = 'Cannot refresh tokens: user is logged out. Please sign in to get new tokens.';
        } else if (exception instanceof UnauthorizedException || exception.name === 'UnauthorizedException') {
            // the extra condition above is necessary because the RefreshGuard throws an untyped exception
            
            status = HttpStatus.UNAUTHORIZED;
            message = 'Cannot refresh tokens: refresh token was not provided, or does not match';
        }
        else if (exception instanceof HttpException) {
            // If the exception is an HttpException, use its status code and message
            status = exception.getStatus();
            message = exception.message;
        }

        response.status(status).json({
            statusCode: status,
            message: message,
        });
    }
}