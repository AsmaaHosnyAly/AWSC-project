
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
export class strOpeningStockGuard implements CanActivate {
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
    let userRole = localStorage.getItem('userRoles')?.split(',');

    //     userRole.forEach(element => {
    //     if( element==1)
    //       return true
    //     else
    //     window.alert('You dont have the permission to visit this page')
    //     this.router.navigateByUrl('login')
    //     return false;
    // })

    for (let i = 0; i < userRole!.length; i++) {
      let role = userRole![i];
      if (role == '3' || role=='17') 
      {
        this.shared.openingStock= true;
        return this.shared.openingStock;
      } 
    }

    return true;
  }
}
