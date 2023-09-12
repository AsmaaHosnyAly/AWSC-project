import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { SharedService } from 'src/app/guards/shared.service';

@Component({
  selector: 'app-str-group-home',
  templateUrl: './str-group-home.component.html',
  styleUrls: ['./str-group-home.component.css']
})
export class StrGroupHomeComponent {

  showFiller = false;

  constructor(public global:GlobalService,public shared:SharedService){
    if(localStorage.getItem('token')) this.global.isLogIn = true
    console.log(this.global.isLogIn)
  }

  

  // setBgColor(color:any){
  //    this.global.bgColor = color;
  // }


  handleLogOut(){
    localStorage.removeItem('token')
    this.global.isLogIn = false
    
  }
}
