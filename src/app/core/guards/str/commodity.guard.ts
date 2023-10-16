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
export class commodityGuard implements CanActivate {
  decodedToken : any;
  decodedToken2:any
  constructor(
    private router: Router,
   
  ) {
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

//       let roles = route.data['commodity'] as Array<string>;
//       let userRoles = localStorage.getItem('userRoles')?.split(',');
//       console.log('roles',roles)
//       console.log("userRole: ",localStorage.getItem('userRoles')?.split(','), "role compare: ",roles)
//       console.log("condtion",localStorage.getItem('userRoles')?.split(',').filter((element: string) => roles.includes(element)))
//      let condtion:any
//        if (localStorage.getItem('userRoles')?.split(',').filter((element: string) => roles.includes(element))){
//               this.shared.commodity=true
//               this.shared.stores=true
//               console.log('stores', this.shared.commodity)
//              return true
//        }
//        else if(condtion === undefined || condtion.length == 0){
//          this.shared.commodity=false
//          return false
//        }
//  return false;
let pages = route.data['PageLsit'] as Array<string>;
const USER_ROLES_LOCAL_STORAGE =this.decodedToken2
const USER_ROLES : Array<any> = USER_ROLES_LOCAL_STORAGE
// pages && !MODULES.some((i:any)=>i == pages[0])
if(pages && !USER_ROLES.some((i:any)=>i == pages[0])||pages && !USER_ROLES.some((i:any)=>i == pages[0]== undefined)){
  alert('عفوا لا تمتلك الصلاحية ')
  this.router.navigate(['/home']);
  return false
}
return true
}
}
