import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class storeGuard implements CanActivate {
  userRoles: any;

  decodedToken: any;
  decodedToken2: any;
  constructor(private router: Router) {
    const accessToken: any = localStorage.getItem('accessToken');
    // Decode the access token
    this.decodedToken = jwt_decode(accessToken);
    this.decodedToken2 = this.decodedToken.roles;
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
    let flag:Boolean =false
    // console.log('condition',localStorage.getItem('modules')?.split(',').includes('2'))
    // if (localStorage.getItem('modules')?.split(',').includes('1')) {

    //   this.shared.roles= true;
    //   console.log('roles', this.shared.roles);
    //   flag=true
    // }
    // if(localStorage.getItem('modules')?.split(',').includes('2')) {
    //   this.shared.stores= true;
    //   // this.shared.roles= true;
    //   console.log('stores', this.shared.stores);
    //   flag=true
    // }
    // if(localStorage.getItem('modules')?.split(',').includes('3')) {
    //   this.shared.accounts= true;
    //   console.log('accounts', this.shared.accounts);
    //   flag=true
    // }
    // if(flag===true){
    //   return true;
    // }
   
    // else  {
    //   return false;
    // }
      return true;
    }
  }

