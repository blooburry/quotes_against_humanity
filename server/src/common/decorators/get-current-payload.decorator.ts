import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "@server/auth/types";

export const GetCurrentPayload = createParamDecorator(
    (_: undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const payload: JwtPayload = request.user.payload;
        return payload;
    },
);