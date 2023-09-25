import { Component } from '@angular/core';
import { PagesEnums } from 'src/app/core/enums/pages.enum';

@Component({
  selector: 'app-pr-home',
  templateUrl: './pr-home.component.html',
  styleUrls: ['./pr-home.component.css']
})
export class PrHomeComponent {

  pageEnums = PagesEnums
  
  hasAccessRole(id:number):boolean{
    const USER_ROLES_LOCAL_STORAGE = window.localStorage.getItem('userRoles') 
    const USER_ROLES : Array<any> = USER_ROLES_LOCAL_STORAGE!.split(',')
    return USER_ROLES.some((i:any)=>i == id)
  }

}
