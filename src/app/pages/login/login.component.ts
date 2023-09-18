import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/guards/shared.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  roles:any
  transactionUserId:any

  
  OnIinit():void{
  
  }

  loginForm = new FormGroup({
    name : new FormControl('' ,
     [Validators.required ,  Validators.maxLength(50)]), // Validators.pattern()
    password: new FormControl('',[Validators.required,Validators.maxLength(10)])
  })

  isSubmit = false
  isActive=false
  constructor(public global : GlobalService , private router : Router,public shared:SharedService){
    this.global.navFlag=false
    localStorage.setItem('userRoles',this.roles)
   
  }

  get userName(){return this.loginForm.get('name')}
  get userPassword(){return this.loginForm.get('password')}

  get userData(){return this.loginForm.controls}

  

  handleSubmit(){
    console.log(this.loginForm)
    this.isSubmit = true
    if(this.loginForm.valid){
      this.global.login(this.loginForm.value).subscribe(res=>{
       console.log('login',res)
         
          localStorage.setItem('transactionUserId',res.id);
          console.log("handelres",  localStorage.setItem('transactionUserId',res.id))
           this.global.isLogIn=true;
              localStorage.setItem('userRoles',res.roles)
              this.router.navigate(['/home'])
          //  this.global.getRolesByUserId(res.id).subscribe(res=>{
          //   console.log("res", res)
          //  this.roles=res
          //  this.global.userRoles=res
         
          // })
          //this.getRolesByUserId()
        
      // this.global.getPermissionUserRoles(1||2||3||4||5||6||7||8||9||10||11|12|13|14|15|16|17,'stores','','')
      // this.global. getPermissionRolesScreens(18||19,'الصلاحيات','')
       
      
        

    })
    }
  }



// fddddddddddddddddddddddddddddddddddd
}
