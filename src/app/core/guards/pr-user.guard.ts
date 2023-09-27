import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class prUserGuard implements CanActivate {
  constructor(
    private router: Router,
    global: SharedService,
    public shared: SharedService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
  

    for (let i = 0; i < this.shared.userRoles!.length; i++) {
      let role = this.shared.userRoles![i];
      if (role == '17' || role=='17') 
      {
        this.shared.prUser= true;
        this.shared.pageTitle="الصلاحيات"
        return this.shared.prUser;
      } 
    }

    return true;
  }
}
