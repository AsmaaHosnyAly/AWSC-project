
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
    

  //   for (let i = 0; i < this.shared.userRoles!.length; i++) {
  //     let role = this.shared.userRoles![i];
  //     if (
  //       role == '18' ||
  //       role == '19'
  //     ) {
  //       this.shared.roles = true;
  //       return true;
  //     } 
  //   }

  //   return true;
  // }

  let roles = route.data['role2'] as Array<string>;
  let userRoles = localStorage.getItem('userRoles')?.split(',');
  console.log('roles',roles)
  console.log("userRole: ",localStorage.getItem('userRoles')?.split(','), "role compare: ",roles)
  console.log("condtion",localStorage.getItem('userRoles')?.split(',').filter((element: string) => roles.includes(element)))
 let condtion:any
   if (localStorage.getItem('userRoles')?.split(',').filter((element: string) => roles.includes(element))){
          this.shared.roles=true
          console.log('roles', this.shared.roles)
          this.router.navigate(['/it']);
         return true
   }
   else if(condtion === undefined || condtion.length == 0){
    this.shared.roles=false
     return false
   }
return false;
}
}
