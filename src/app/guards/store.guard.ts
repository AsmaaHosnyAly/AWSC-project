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
export class storeGuard implements CanActivate {
  userRoles: any;

  constructor(
    private router: Router,
    public global: GlobalService,
    public shared: SharedService
  ) {
    this.userRoles = localStorage.getItem('userRoles')?.split(',');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
   
    let condtion: any;
    console.log('condition',localStorage.getItem('modules')?.split(',').includes('2')||localStorage.getItem('modules')?.split(',').includes('4'))
    if (localStorage.getItem('modules')?.split(',').includes('7')) {
      this.shared.roles= true;
      console.log('roles', this.shared.roles);
      return true;
    }
    else if (localStorage.getItem('modules')?.split(',').includes('2')) {
      this.shared.stores= true;
      console.log('stores', this.shared.stores);
      return true;
    }
    else if (localStorage.getItem('modules')?.split(',').includes('3')) {
      this.shared.stores= true;
      console.log('roles', this.shared.stores);
      return true;
    } else if (localStorage.getItem('modules')?.split(',').includes('4')) {
      this.shared.stores= true;
      console.log('roles', this.shared.stores);
      return true;
    }
    else if (condtion === undefined || condtion.length == 0) {
      this.shared.stores = false;
      return false;
    }
    return false;
  }
}
