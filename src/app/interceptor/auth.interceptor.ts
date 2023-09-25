import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from '../pages/services/global.service'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(global:GlobalService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    let token=localStorage.getItem("token")
    let role=localStorage.getItem("role")
    
    if(token){
      request=request.clone({
        headers:request.headers.set("Authorization",`bearer ${token}`).append("role",`${role}`)
        
      })
    }
    return next.handle(request);
  }
}
