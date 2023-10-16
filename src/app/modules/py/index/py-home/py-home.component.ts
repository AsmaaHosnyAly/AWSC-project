import { Component } from '@angular/core';
import { PagesEnums } from 'src/app/core/enums/pages.enum'; 
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-py-home',
  templateUrl: './py-home.component.html',
  styleUrls: ['./py-home.component.css']
})
export class PyHomeComponent {
  pageEnums = PagesEnums
  decodedToken : any;
  decodedToken1:any
  decodedToken2:any
  
  userRole= localStorage.getItem('userRoles')
 

  constructor(){
    const accessToken: any = localStorage.getItem('accessToken');
    this.decodedToken = jwt_decode(accessToken);
    this. decodedToken1 = this.decodedToken.modules;
    this.decodedToken2 = this.decodedToken.roles;
    console.log(this.decodedToken2)
  }
  hasAccessRole(name: string): boolean {
    const USER_ROLES_LOCAL_STORAGE =  this.decodedToken2
    const USER_ROLES: Array<any> = USER_ROLES_LOCAL_STORAGE
    return USER_ROLES.some((i: any) => i == name);
  }


}
