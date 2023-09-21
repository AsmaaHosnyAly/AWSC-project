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
export class commodityGuard implements CanActivate {
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

      let roles = route.data['commodity'] as Array<string>;
      let userRoles = localStorage.getItem('userRoles')?.split(',');
      console.log('roles',roles)
      console.log("userRole: ",localStorage.getItem('userRoles')?.split(','), "role compare: ",roles)
      console.log("condtion",localStorage.getItem('userRoles')?.split(',').filter((element: string) => roles.includes(element)))
     let condtion:any
       if (localStorage.getItem('userRoles')?.split(',').filter((element: string) => roles.includes(element))){
              this.shared.commodity=true
              this.shared.stores=true
              console.log('stores', this.shared.commodity)
             return true
       }
       else if(condtion === undefined || condtion.length == 0){
         this.shared.commodity=false
         return false
       }
 return false;
}
}
