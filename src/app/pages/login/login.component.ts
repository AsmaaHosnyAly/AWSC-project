import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/guards/shared.service';
import { GlobalService } from 'src/app/services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  roles: any;
  transactionUserId: any;

  OnIinit(): void {}

  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]), // Validators.pattern()
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
  });

  isSubmit = false;
  isActive = false;
  constructor(
    public global: GlobalService,
    private router: Router,
    public shared: SharedService,
    private toastr: ToastrService
  ) {
    this.global.navFlag = false;
    localStorage.setItem('userRoles', this.roles);
  }

  get userName() {
    return this.loginForm.get('name');
  }
  get userPassword() {
    return this.loginForm.get('password');
  }

  get userData() {
    return this.loginForm.controls;
  }

  toastrloginSuccess(): void {
    this.toastr.success('تم الدخول بنجاح');
  }
  toastrloginfailed(): void {
    this.toastr.error('خطا في تسجيل البيانات لا يمكنك الدخول');
  }

  handleSubmit() {
    console.log(this.loginForm);
    if(this.loginForm.valid){
      this.global.login(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('transactionUserId', res.id);
          console.log(
            'handelres',
            localStorage.setItem('transactionUserId', res.id)
          );
          this.global.isLogIn = true;
          localStorage.setItem('userRoles', res.roles);
          this.toastrloginSuccess();
          this.router.navigate(['/home']);
        },
        error: () => {
         this.toastrloginfailed()
        },
      });
    }

    // if (this.loginForm.valid) {
    //   console.log('login1', this.loginForm.value);
    //   this.isSubmit = true;
    //   this.global.login(this.loginForm.value).subscribe((res) => {
    //     console.log('login2', res);
     
    //       localStorage.setItem('transactionUserId', res.id);
    //       console.log(
    //         'handelres',
    //         localStorage.setItem('transactionUserId', res.id)
    //       );
    //       this.global.isLogIn = true;
    //       localStorage.setItem('userRoles', res.roles);
    //       this.toastrloginSuccess();
    //       this.router.navigate(['/home']);
        
    //   });
    // }
  }

  //  this.global.getRolesByUserId(res.id).subscribe(res=>{
  //   console.log("res", res)
  //  this.roles=res
  //  this.global.userRoles=res

  // })
  //this.getRolesByUserId()

  // this.global.getPermissionUserRoles(1||2||3||4||5||6||7||8||9||10||11|12|13|14|15|16|17,'stores','','')
  // this.global. getPermissionRolesScreens(18||19,'الصلاحيات','')

  // fddddddddddddddddddddddddddddddddddd
}
