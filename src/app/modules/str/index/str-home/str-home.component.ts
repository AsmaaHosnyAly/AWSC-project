import { Component ,OnInit} from '@angular/core';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { PagesEnums } from 'src/app/core/enums/pages.enum'; 
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-str-home',
  templateUrl: './str-home.component.html',
  styleUrls: ['./str-home.component.css']
})
export class STRHomeComponent {

  decodedToken : any;
  decodedToken1:any
  decodedToken2:any
  
  userRole= localStorage.getItem('userRoles')
  pageEnums = PagesEnums
 
  // hasAccessRole(id:number):boolean{
  //   const USER_ROLES_LOCAL_STORAGE = window.localStorage.getItem('userRoles') 
  //   const USER_ROLES : Array<any> = USER_ROLES_LOCAL_STORAGE!.split(',')
  //   return USER_ROLES.some((i:any)=>i == id)
  // }

  hasAccessRole(name: string): boolean {
    const USER_ROLES_LOCAL_STORAGE =  this.decodedToken2
    const USER_ROLES: Array<any> = USER_ROLES_LOCAL_STORAGE
    return USER_ROLES.some((i: any) => i == name);
  }

  constructor(public global:GlobalService){
    const accessToken: any = localStorage.getItem('accessToken');
    this.decodedToken = jwt_decode(accessToken);
    this. decodedToken1 = this.decodedToken.modules;
    this.decodedToken2 = this.decodedToken.roles;
    global.getPermissionUserRoles('Store', 'stores', 'إدارة المخازن وحسابات المخازن ', 'store')
    
  }
  OnInit():void{
    

    

    // commit

 }


 
}
