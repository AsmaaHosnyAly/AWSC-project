import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public shortLink = '';
  isLogIn = false;
  bgColor: any;
  displayScreen: any;
  isStatus = 'مفعل';
  pageTitle: any;
  icon: any;
  stores = false;
  accounts = false;
  test: any;
  public navFlag: boolean = true;
  userRoles: any;

  // url = '192.168.1.23/api';
  url='http://ims.aswan.gov.eg/api'

  public reportData: [] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    
  ) {
    this.userRoles = localStorage.getItem('userRoles')?.split(',');
  }

  getUsers(): Observable<any> {
    return this.http.get(
      `https://ims.aswan.gov.eg/api/AddReceipt/get-all-Receipt`
    );
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.url}/PRUser/get/${id}`);
  }

  login(obj: any): Observable<any> {
    console.log('obj ', obj);
    return this.http.get(
      `${this.url}/PRUser/authenticate?username=${obj.name}&password=${obj.password}`
      
    );
  }

  getRolesByUserId(userId: any): Observable<any> {
    console.log('userId ', userId);
    return this.http.get(`${this.url}/PRUser/get/role/${userId}`);
  }
  //  crud group
  postGroup(data: any) {
    return this.http.post<any>(
      `${this.url}/FI_CostCenter/Add-CostCenter`,
      data
    );
  }

  getGroup() {
    return this.http.get<any>(`${this.url}/PR_Group/get-all-groups`);
  }

  putGroup(data: any, id: number) {
    return this.http.put<any>(
      `${this.url}/FI_CostCenter/update-CostCenter` + id,
      data
    );
  }

  deleteGroup(id: number) {
    return this.http.delete<any>(
      `${this.url}FI_CostCenter/delete-CostCenter-by-id/${id}` + id
    );
  }

  getPermissionUserRoles(
    role: any,
    background: any,
    pageTitle: any,
    icon: any
  ) {
    console.log('userrole', localStorage.getItem('userRoles')?.split(','))
    for (let i = 0; i < this.userRoles!.length; i++) {
      if (role == this.userRoles![i]) {
        this.pageTitle = pageTitle;
        // if (
        //   role == '1' ||
        //   role == '2' ||
        //   role == '3' ||
        //   role == '4' ||
        //   role == '5' ||
        //   role == '6' ||
        //   role == '7' ||
        //   role == '8' ||
        //   role == '9' ||
        //   role == '10' ||
        //   role == '11' ||
        //   role == '12' ||
        //   role == '13' ||
        //   role == '14' ||
        //   role == '15' ||
        //   role == '16' ||
        //   role == '17'
        // ) {
        //   this.shared.stores = true;
    
          
        //   // if (background == 'stores')
        //   //   this.bgColor = document
        //   //     .querySelector('section')
        //   //     ?.setAttribute('class', 'role1');

        //   // if (background == 'acounts')
        //   //   this.bgColor = document
        //   //     .querySelector('section')
        //   //     ?.setAttribute('class', 'role2');
        //   // else
        //   // this.bgColor= document.querySelector('section')?.setAttribute("class","screenBackground ")

        
        // }
      }
    
      // window.alert('You dont have the permission to visit this page');
      // this.router.navigate(['/home']);
      // this.displayScreen = document.querySelector('mat-expansion-panel-header')?.setAttribute("class", "displayscreen")
    }
  }
  // getPermissionRolesScreens(
  //   role: any,
  //   pageTitle: any,
  //   icon: any
  // ) {
  //   console.log('userrole', this.userRoles)
  //   for (let i = 0; i < this.userRoles!.length; i++) {
  //     if (role == this.userRoles![i]) {
  //       this.pageTitle = pageTitle;
  //       if (
          
  //         role == '18' ||
  //         role == '19'
  //       ) {
  //         this.shared.roles = true;
  //         this.router.navigate(['/pr-home']);
  //       }
  //     }
      
  //     // window.alert('You dont have the permission to visit this page');
  //     // this.router.navigate(['/home']);
  //     // this.displayScreen = document.querySelector('mat-expansion-panel-header')?.setAttribute("class", "displayscreen")
  //   }
  // }

  
}