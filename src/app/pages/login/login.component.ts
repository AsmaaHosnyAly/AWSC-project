import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(public global : GlobalService , private router : Router){
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
       
         if( res.isActive==true) {
          localStorage.setItem('transactionUserId',res.id);
          console.log("handelres",  localStorage.setItem('transactionUserId',res.id))
           this.global.isLogIn=true;
          
           this.global.getRolesByUserId(res.id).subscribe(res=>{
            console.log("res", res)
           
           this.roles=res
            localStorage.setItem('userRoles',res)
          })
          //this.getRolesByUserId()
          this.router.navigate(['/home'])
      
        }

    })
    }
  }



// fddddddddddddddddddddddddddddddddddd
}
