import { Component } from '@angular/core';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-pr-home',
  templateUrl: './pr-home.component.html',
  styleUrls: ['./pr-home.component.css']
})
export class PrHomeComponent {
  pageEnums = PagesEnums
  decodedToken : any;
  decodedToken1:any
  decodedToken2:any
  
  constructor(){
    const accessToken: any = localStorage.getItem('accessToken');
    this.decodedToken = jwt_decode(accessToken);
    this. decodedToken1 = this.decodedToken.modules;
    this.decodedToken2 = this.decodedToken.roles;
    
  }
  hasAccessRole(name: string): boolean {
    const USER_ROLES_LOCAL_STORAGE =  this.decodedToken2
    const USER_ROLES: Array<any> = USER_ROLES_LOCAL_STORAGE
    return USER_ROLES.some((i: any) => i == name);
  }

}
