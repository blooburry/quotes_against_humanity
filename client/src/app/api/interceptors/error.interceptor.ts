import { HttpErrorResponse, HttpInterceptor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req) // literally just going back to using ExpressJS
        .pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          const connectionRefusedMessage = 'A connection with the backend could not be made, which probably means Madeline forgot to start it up. Feel free to contact her and beat her up about it (respectfully)';
          console.error(connectionRefusedMessage, error.error);
          alert(connectionRefusedMessage);
        } else {
          console.error(
            `The server did an oopsie with status code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }
}