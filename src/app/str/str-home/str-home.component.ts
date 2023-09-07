import { Component ,OnInit} from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-str-home',
  templateUrl: './str-home.component.html',
  styleUrls: ['./str-home.component.css']
})
export class STRHomeComponent {
  
  userRole= localStorage.getItem('userRoles')

  constructor(public global:GlobalService){
   

  }
  OnInit():void{
    

    

    // commit

 }

 
}
