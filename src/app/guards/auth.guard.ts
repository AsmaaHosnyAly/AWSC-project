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
    let userRole = localStorage.getItem('userRoles')?.split('',200);

    //     userRole.forEach(element => {
    //     if( element==1)
    //       return true
    //     else
    //     window.alert('You dont have the permission to visit this page')
    //     this.router.navigateByUrl('login')
    //     return false;
    // })
    console.log('arrr',userRole)

    for (let i = 0; i < userRole!.length; i++) {
      let role = userRole![i];
      console.log('bbbbbbb', role);
      if (
        role == '1' ||
        role == '2' ||
        role == '3' ||
        role == '4' ||
        role == '20' ||
        role == '21' ||
        role == '6' ||
        role == '7' ||
        role == '8' ||
        role == '9' ||
        role == '10' ||
        role == '11' ||
        role == '12' ||
        role == '13' ||
        role == '14' ||
        role == '15'
      ) {
        this.shared.stores = true;
        this.shared.pageTitle="إدارة المخازن وحسابات المخازن"
        console.log('ggggggggg', this.shared.stores);
        return this.shared.stores;
      } 
    }

    return true;
  }
}
