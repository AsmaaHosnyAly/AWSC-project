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

  loginForm = new FormGroup({
    name : new FormControl('' ,
     [Validators.required ,  Validators.maxLength(50)]), // Validators.pattern()
    password: new FormControl([Validators.required])
  })

  isSubmit = false
  isStatus=true
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
        // if(res.access_token && res.user.isActive==true) {
          
          // localStorage.setItem('token' ,res.access_token,);
          localStorage.setItem('transactionUserId',res.id);
          // this.global.isLogIn=true;

          // // this.router.navigateByUrl('/showUsers')
          this.router.navigate(['/home'])
      
        }

      )
    }
  }


}
