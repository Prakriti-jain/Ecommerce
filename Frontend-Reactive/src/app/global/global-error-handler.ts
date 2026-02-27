import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector : Injector) {}

  handleError(error: any): void {
    const router = this.injector.get(Router);  //does not create router injection at the time of app starting, gives the instace only when required

    //HTTP errors
    if(error instanceof HttpErrorResponse) {
      console.log("HTTP ERROR: ", error.status, error.message);

      if(error.status === 500) {
        alert('Server error - ' + error.message);
      }
    }

    //Client errors - angular unhandled errors, template errors etc
    else {
      console.log('Client error - ', error.message);
      alert('Client error - ' + error.message);
    }
    
  }
  
}
