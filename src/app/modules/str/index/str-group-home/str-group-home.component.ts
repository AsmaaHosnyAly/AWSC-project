import { Component } from '@angular/core';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { SharedService } from 'src/app/core/guards/shared.service';
import { PagesEnums } from 'src/app/core/enums/pages.enum'; 
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-str-group-home',
  templateUrl: './str-group-home.component.html',
  styleUrls: ['./str-group-home.component.css']
})
export class StrGroupHomeComponent {
  decodedToken : any;
  decodedToken1:any
  showFiller = false;
  pageEnums = PagesEnums
  constructor(public global:GlobalService,public shared:SharedService){
    if(localStorage.getItem('token')) this.global.isLogIn = true
    console.log(this.global.isLogIn)
    global.getPermissionUserRoles('الصفحة الرئيسية', 'stores', ' الصفحة الرئيسية', '')
    // Retrieve the access token
    const accessToken: any = localStorage.getItem('accessToken');
    console.log('accessToken', accessToken);
    // Decode the access token
      this.decodedToken = jwt_decode(accessToken);
    this. decodedToken1 = this.decodedToken.modules;
  }

  

  // setBgColor(color:any){
  //    this.global.bgColor = color;
  // }

  // hasAccessModule(id:number):boolean{
  //   const MODULES_LOCAL_STORAGE = window.localStorage.getItem('modules') 
  //   const MODULES : Array<any> =MODULES_LOCAL_STORAGE!.split(',')
  //   return MODULES.some((i:any)=>i == id)
  // }
 
  hasAccessModule(name: string): boolean {
    console.log('name passed: ', name);
    // const MODULES_LOCAL_STORAGE = window.localStorage.getItem('modules');
    const MODULES_LOCAL_STORAGE = this.decodedToken1;
    const MODULES: Array<any> = MODULES_LOCAL_STORAGE;
    console.log('array : ', MODULES);
    if (MODULES != undefined) {
      return MODULES.some((i: any) => i == name);
    } else {
      return false;
    }
  }
  
  handleLogOut(){
    localStorage.removeItem('token')
    this.global.isLogIn = false
    
  }
}
