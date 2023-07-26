import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class LogoutExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log(`[SERVER/LOGOUTEXCEPTIONFILTER] ${JSON.stringify(exception)}`);

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'The user could not be logged out.';

        if (exception instanceof UnauthorizedException || exception.name === 'UnauthorizedException') {
            status = HttpStatus.UNAUTHORIZED;
            message = 'The access token was not provided, or is not valid.';
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