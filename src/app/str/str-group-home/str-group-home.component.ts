import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-str-group-home',
  templateUrl: './str-group-home.component.html',
  styleUrls: ['./str-group-home.component.css']
})
export class StrGroupHomeComponent {

  showFiller = false;

  constructor(public global:GlobalService){
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
