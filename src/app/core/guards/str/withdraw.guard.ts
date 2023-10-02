

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class withdrawGuard implements CanActivate {
  constructor(
    private router: Router,
     
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
    //   let userRoles = localStorage.getItem('userRoles')?.split(',');
    //   console.log('roles',roles)
    //   console.log("userRole: ",localStorage.getItem('userRoles')?.split(','), "role compare: ",roles)
    //   console.log("condtion",localStorage.getItem('userRoles')?.split(',').filter((element: string) => roles.includes(element)))
    //  let condtion:any
    //    if (localStorage.getItem('userRoles')?.split(',').filter((element: string) => roles.includes(element))){
    //           this.shared.withdraw=true
    //           console.log('stores', this.shared.withdraw)
    //          return true
    //    }
    //    else if(condtion === undefined || condtion.length == 0){
    //     alert('you dont have the permisstion to visit this page')
    //      return false
    //    }
    //    alert('you dont have the permisstion to visit this page')

}
}