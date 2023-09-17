import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';
import { finalize} from 'rxjs/operators';
@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
totalrequests =0;
completedRequests =0;
  constructor(private loader:LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   this.loader.show();
   this.totalrequests++;
    return next.handle(request).pipe(
      finalize(() =>{
        // this.completedRequests++;
        // if(this.completedRequests === this.totalrequests)
        this.loader.hide();
      // this.completedRequests = 0;
      // this.totalrequests = 0;
      })
    );
  }
}
