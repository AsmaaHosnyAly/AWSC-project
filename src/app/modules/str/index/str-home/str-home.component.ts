import { Component ,OnInit} from '@angular/core';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { PagesEnums } from 'src/app/core/enums/pages.enum'; 

@Component({
  selector: 'app-str-home',
  templateUrl: './str-home.component.html',
  styleUrls: ['./str-home.component.css']
})
export class STRHomeComponent {
  
  userRole= localStorage.getItem('userRoles')
  pageEnums = PagesEnums
  
  hasAccessRole(id:number):boolean{
    const USER_ROLES_LOCAL_STORAGE = window.localStorage.getItem('userRoles') 
    const USER_ROLES : Array<any> = USER_ROLES_LOCAL_STORAGE!.split(',')
    return USER_ROLES.some((i:any)=>i == id)
  }

  constructor(public global:GlobalService){
   

  }
  OnInit():void{
    

    

    // commit

 }


 
}
