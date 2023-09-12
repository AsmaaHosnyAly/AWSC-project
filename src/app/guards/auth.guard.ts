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
export class authGuard implements CanActivate {
  userRoles:any
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
  
  

    for (let i = 0; i <  this.userRoles.length; i++) {
      let role = this.userRoles![i];
      console.log('bbbbbbb', role);
      if (
        role == '1' ||
        role == '2' ||
        role == '3' ||
        role == '4' ||
        role == '5' ||
        role == '6' ||
        role == '7' ||
        role == '8' ||
        role == '9' ||
        role == '10' ||
        role == '11' ||
        role == '12' ||
        role == '13' ||
        role == '14' ||
        role == '15' ||
        role == '16'||
        role == '17'
      ) {
        this.shared.stores = true;
        // this.router.navigate(['/str-home'])
        console.log('ggggggggg', this.shared.stores);
        return this.shared.stores;
      } 
    }

    return true;
  }
}
