import { HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";

// TODO: this is here to add the access / refresh token to certain api calls.
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req);
    }
}