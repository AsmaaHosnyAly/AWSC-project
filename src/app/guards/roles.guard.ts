
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class rolesGuard implements CanActivate {
  constructor(
    private router: Router,
    global: SharedService,
    public shared: SharedService
  ) {

  }
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
      console.log('bbbbbbb', role);
      if (
        role == '18' ||
        role == '19'
        
        
      ) {
        this.shared.roles = true;
        
        console.log('role', this.shared.roles);
        return this.shared.roles;
      } 
    }

    return true;
  }
}
