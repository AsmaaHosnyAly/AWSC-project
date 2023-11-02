import { Component } from '@angular/core';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import jwt_decode from 'jwt-decode';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-fa-home',
  templateUrl: './fa-home.component.html',
  styleUrls: ['./fa-home.component.css']
})
export class FaHomeComponent {
  pageEnums = PagesEnums
  decodedToken : any;
  decodedToken1:any
  decodedToken2:any
  
  constructor(private global:GlobalService){
    global.getPermissionUserRoles('IT', '', 'الإصول الثابتة', 'collections_bookmark')
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


