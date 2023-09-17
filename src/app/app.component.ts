import { Component,OnInit } from '@angular/core';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   transactionUserId= localStorage.getItem('transactionUserId')
   user:any
  constructor(public global:GlobalService){
    this.gitUserById()
    // this.global.getPermissionUserRoles(1||2||3||4||5||6||7||8||9||10||11|12|13|14|15|16|17,'stores','','')
    // this.global. getPermissionRolesScreens(18||19,'الصلاحيات','')
   
    
    // if(localStorage.getItem('token')) this.global.isLogIn = true
    // console.log(this.global.isLogIn)

    // console.log(this.global.userRoles)
   
    this.gitUserById()

  }

  ngOnInit():void
  {
    this.global.bgColor= document.querySelector('section')?.classList.add('screenBackground');
    
  }
  title = 'str-group';

  showFiller = false;
  toggleButtonCounter = 0;

  plus() {
    this.toggleButtonCounter++;
  } 



 gitUserById(){
  this.global.getUserById(this.transactionUserId)
  .subscribe(
    res => {
      if(res)
   return  this.user=res
      else
      this.user=""
    },
   
  )
 }


  handleLogOut(){
    localStorage.removeItem('token')
    this.global.isLogIn = false
    
  }
}
