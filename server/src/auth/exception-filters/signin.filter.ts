import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class SigninExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log(`[SERVER/SIGNINEXCEPTIONFILTER] ${JSON.stringify(exception)}`);

        const originalMessage = exception.response.message;

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'The user could not be signed in.';

        if (exception instanceof BadRequestException) {
            status = HttpStatus.BAD_REQUEST;
            message = `The request was malformed. ${originalMessage}`;
        } else if (exception instanceof NotFoundException) {
            status = HttpStatus.NOT_FOUND;
            message = 'This user cannot be found in the database.';
        } else if (exception instanceof UnauthorizedException) {
            status = HttpStatus.UNAUTHORIZED;
            message = 'The password does not match.'
        }
        else if (exception instanceof HttpException) {
            // If the exception is an HttpException, use its status code and message
            status = exception.getStatus();
            message = originalMessage;
        }

        response.status(status).json({
            statusCode: status,
            message: message,
        });
    }
}