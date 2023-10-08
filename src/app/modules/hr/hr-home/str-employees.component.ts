import { Component } from '@angular/core';
import { PagesEnums } from 'src/app/core/enums/pages.enum'; 

@Component({
  selector: 'app-str-employees',
  templateUrl: './str-employees.component.html',
  styleUrls: ['./str-employees.component.css']
})
export class StrEmployeesComponent {
  pageEnums = PagesEnums

  hasAccessRole(id:number):boolean{
    const USER_ROLES_LOCAL_STORAGE = window.localStorage.getItem('userRoles') 
    const USER_ROLES : Array<any> = USER_ROLES_LOCAL_STORAGE!.split(',')
    return USER_ROLES.some((i:any)=>i == id)
  }

}
