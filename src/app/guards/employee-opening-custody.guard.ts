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
export class employeeOpeningCustodyGuard implements CanActivate {
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

    for (let i = 0; i < userRole!.length; i++) {
      let role = userRole![i];
      console.log('bbbbbbb', role);
      if (role == '1' || role=='17') 
      {
        this.shared.employeeOpeningCustody= true;
        console.log('strad', this.shared.employeeOpeningCustody);
        return this.shared.employeeOpeningCustody;
      } 
    }

    return true;
  }
}
