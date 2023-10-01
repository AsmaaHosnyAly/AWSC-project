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
  
      let pages = route.data['PageLsit'] as Array<string>;
      const USER_ROLES_LOCAL_STORAGE = window.localStorage.getItem('userRoles') 
      const USER_ROLES : Array<any> = USER_ROLES_LOCAL_STORAGE!.split(',')
      // pages && !MODULES.some((i:any)=>i == pages[0])
      if(pages && !USER_ROLES.some((i:any)=>i == pages[0])){
        alert('عفوا لا تمتلك الصلاحية ')
        this.router.navigate(['/home']);
        return false
      }
      return true
      }
}
