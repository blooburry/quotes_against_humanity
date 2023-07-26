import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "@server/auth/types";

export const GetCurrentToken = createParamDecorator(
    (_: undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const token: string = request.user.accessToken? request.user.accessToken : request.user.refreshToken;
        return token;
    },
);