import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayloadWithRT } from "@server/auth/types";

export const GetCurrentUserWithRT = createParamDecorator(
    (_: undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayloadWithRT;
        return user;
    },
);