import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class SignupExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log(`[SERVER/SIGNUPEXCEPTIONFILTER] ${JSON.stringify(exception)}`);

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'The user could not be signed up.';

        if (exception instanceof BadRequestException) {
            status = HttpStatus.BAD_REQUEST;
            message = 'The request was malformed.';
        } else if (exception instanceof PrismaClientKnownRequestError) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'The database cannot create this user.';
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