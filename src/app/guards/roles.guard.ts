
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
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let userRole = localStorage.getItem('userRoles')?.split('');

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
      console.log('bbbbbbb', role);
      if (
        role == '9' ||
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
