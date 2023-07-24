import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload, JwtPayloadWithRT } from "src/auth/types";

export const GetCurrentUserWithRT = createParamDecorator(
    (_: undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayloadWithRT;
        return user;
    },
);