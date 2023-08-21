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
  transactionUserId=localStorage.getItem('transactionUserId')

  
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
  }

  get userName(){return this.loginForm.get('name')}
  get userPassword(){return this.loginForm.get('password')}

  get userData(){return this.loginForm.controls}

  

  handleSubmit(){
    console.log(this.loginForm)
    this.isSubmit = true
    if(this.loginForm.valid){
      this.global.login(this.loginForm.value).subscribe(res=>{
        console.log(res)
         if( res.isActive==true) {
          
          
          localStorage.setItem('transactionUserId',res.id);
           this.global.isLogIn=true;

          this.getRolesByUserId()
          this.router.navigate(['/home'])
      
        }

    })
    }
  }

  getRolesByUserId(){
    this.global.getRolesByUserId(this.transactionUserId).subscribe(res=>{
      console.log(res)
      localStorage.setItem('userRoles',res)

    })
}

// fddddddddddddddddddddddddddddddddddd
}
