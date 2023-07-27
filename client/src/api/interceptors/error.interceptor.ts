import { HttpErrorResponse, HttpInterceptor, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { PasswordIncorrectError, UserNotFoundError } from "common/types";
import { SERVER_URL } from "@client/env";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req) // literally just going back to using ExpressJS lmfao
        .pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error);

        if (error.status === 0) {

          const connectionRefusedMessage = 
'A connection with the backend could not be made, \
which probably means Madeline forgot to start it up. \
Feel free to contact her and beat her up about it (respectfully)';

          console.error(connectionRefusedMessage, error.error);
          alert(connectionRefusedMessage);
        } else if (error.status == HttpStatusCode.NotFound){
          if(error.url === `${SERVER_URL}/auth/local/signin`){
            return throwError(() => new UserNotFoundError(error.message));
          } 
        } else if (error.status == HttpStatusCode.Unauthorized){
          if(error.url === `${SERVER_URL}/auth/local/signin`){
            return throwError(() => new PasswordIncorrectError(error.message));
          }
        }
        else {
          console.error(
            `The server did an oopsie with status code ${error.status}, body was: `, error.error);
        }
        // generic error message
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }
}