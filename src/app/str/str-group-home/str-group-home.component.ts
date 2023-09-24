import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { SharedService } from 'src/app/guards/shared.service';
import { PagesEnums } from '../../core/enums/pages.enum';

@Component({
  selector: 'app-str-group-home',
  templateUrl: './str-group-home.component.html',
  styleUrls: ['./str-group-home.component.css']
})
export class StrGroupHomeComponent {

  showFiller = false;
  pageEnums = PagesEnums
  constructor(public global:GlobalService,public shared:SharedService){
    if(localStorage.getItem('token')) this.global.isLogIn = true
    console.log(this.global.isLogIn)
  }

  

  // setBgColor(color:any){
  //    this.global.bgColor = color;
  // }

  hasAccessModule(id:number):boolean{
    const MODULES_LOCAL_STORAGE = window.localStorage.getItem('modules') 
    const MODULES : Array<any> =MODULES_LOCAL_STORAGE!.split(',')
    return MODULES.some((i:any)=>i == id)
  }
 

  handleLogOut(){
    localStorage.removeItem('token')
    this.global.isLogIn = false
    
  }
}
