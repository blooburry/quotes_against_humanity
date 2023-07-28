import { ActivatedRoute, CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { SessionService } from "api/session.service";

export const inSessionGuard: CanActivateFn = (): boolean => { // returns true if the user is in a session (logged in)
    const session = inject(SessionService);
    return session.isLoggedIn;
}