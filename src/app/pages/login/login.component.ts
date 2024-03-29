import { Component, OnInit } from '@angular/core';
import { Injectable, Compiler } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/core/guards/shared.service';
import { GlobalService } from '../services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  transactionUserId: any;
  modules: any;
  showLogin: any;
  testRoles: any;
  fiscalYearsList: any;
  defaultFiscalYearSelectValue: any;
  lastFiscalYears: any;
  fiscalYearSelectedId: any;

  ngOnInit(): void {
    console.log('loginP');
    this.getFiscalYears();
  }

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]), // Validators.pattern()
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    fiscalYearId: new FormControl('', Validators.required), // Validators.pattern()
  });

  isSubmit = false;
  isActive = false;
  constructor(
    public global: GlobalService,
    private router: Router,
    public shared: SharedService,
    private toastr: ToastrService,
    private _compiler: Compiler
  ) {
    this.global.navFlag = false;
  }

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
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

  // handleSubmit() {
  //   this._compiler.clearCache();
  //   console.log(this.loginForm);
  //   if(this.loginForm.valid){
  //     this.global.login(this.loginForm.value).subscribe({
  //       next: (res) => {
  //         localStorage.setItem('transactionUserId', res.id);
  //         this.global.isLogIn = true;
  //         localStorage.setItem('userRoles', res.roles);
  //         localStorage.setItem('modules', res.modules);
  //         this.toastrloginSuccess();
  //         this.router.navigate(['/home']);
  //       },
  //       error: () => {
  //        this.toastrloginfailed()
  //       },
  //     });
  //   }

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

  handleSubmitByJWT() {
    console.log('LOGIN FORM: ', this.loginForm.value);
    if (this.loginForm.valid) {
      this.global.loginbyJWT(this.loginForm.value).subscribe({
        next: (res) => {
          // console.log("login res: ", res);

          localStorage.setItem('transactionUserId', res.id);
          this.global.isLogIn = true;
          localStorage.setItem('accessToken', res.accessToken);
          let fiscalYearId = this.loginForm.getRawValue().fiscalYearId
          localStorage.setItem('fiscalYearId', fiscalYearId!);

          //     let modules=res['modules']
          //     let tmpTabKV: { }[] = [];
          //     // console.log('userRoles',modules)
          //     for (let i = 0; i <modules!.length; i++) {
          //       console.log('userRoles',modules[i].roles)
          //       // this.testRoles.push(modules[i].roles)
          // tmpTabKV.push([modules[i].roles]);

          //     }
          //     // localStorage.setItem('userRoles',tmpTabKV);
          //     this.testRoles=  tmpTabKV
          //    console.log("this.testRoles",this.testRoles)

          this.toastrloginSuccess();
          this.router.navigate(['/home']);
        },
        error: () => {
          this.toastrloginfailed();
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

  async getFiscalYears() {
    this.global.getFiscalYears().subscribe({
      next: async (res) => {
        this.fiscalYearsList = res;

        this.global.getLastFiscalYear().subscribe({
          next: async (res) => {
            this.defaultFiscalYearSelectValue = await res;

            
              this.loginForm.controls['fiscalYearId'].setValue(
                this.defaultFiscalYearSelectValue.id
              );
              // this.getStrOpenAutoNo();
            
          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          },
        });
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  async fiscalYearValueChanges(fiscalyaerId: any) {
    this.fiscalYearSelectedId = await fiscalyaerId;
    localStorage.setItem('fiscalyaerId',await fiscalyaerId)
    this.loginForm.controls['fiscalYearId'].setValue(
      this.fiscalYearSelectedId
    );
    // this.isEdit = false;

    // this.getStrOpenAutoNo();
  }
}
