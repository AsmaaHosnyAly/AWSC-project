import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PagesEnums } from 'src/app/core/enums/pages.enum';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  decodedToken: any;
  decodedToken1: any;
  decodedToken2: any;
  public shortLink = '';
  isLogIn = false;
  bgColor: any;
  displayScreen: any;
  isStatus = 'مفعل';
  pageTitle: any;
  icon: any;
  routerLinkPage:any;
  stores = false;
  accounts = false;
  test: any;
  public navFlag: boolean = true;
  userModules: any;
  pageEnums=PagesEnums
  url =this.pageEnums.URL

  public reportData: [] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    
  ) {
    
     
    this.userModules = localStorage.getItem('userRoles')?.split(',');
  }

  getUsers(): Observable<any> {
    return this.http.get(
      `${this.url}/api/AddReceipt/get-all-Receipt`
    );
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.url}/PRUser/get/${id}`);
  }

  login(obj: any): Observable<any> {
    // console.log('obj ', obj);
    return this.http.get(
      `${this.url}/PRUser/authenticate?username=${obj.name}&password=${obj.password}`
      
    );
  }

  loginbyJWT(obj: any): Observable<any> {
    // console.log('obj ', obj);
    return this.http.post<any>(
      `${this.url}/Login`,obj
      
    );
  }

  getRolesByUserId(userId: any): Observable<any> {
    // console.log('userId ', userId);
    return this.http.get(`${this.url}/PRUser/get/role/${userId}`);
  }
  //  crud group
  postGroup(data: any) {
    return this.http.post<any>(
      `${this.url}/FI_CostCenter/Add-CostCenter`,
      data
    );
  }

  getUserGroup(id:any){
    return this.http.get<any>(`${this.url}/PRUser/get/with/group/${id}`);
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
   module: any,
   routerLinkPage:any,
    pageTitle: any,
    icon: any
  ) {
     // Retrieve the access token
     const accessToken: any = localStorage.getItem('accessToken');
     // console.log('accessToken', accessToken);
     // Decode the access token
     this.decodedToken = jwt_decode(accessToken);
     this.decodedToken1 = this.decodedToken.modules;
     this.decodedToken2 = this.decodedToken.roles;
 
    //  console.log('decodedToken2 ', this.decodedToken2);
    const MODULES_LOCAL_STORAGE = this.decodedToken1;
    for (let i = 0; i <MODULES_LOCAL_STORAGE!.length; i++) {
      if (module == MODULES_LOCAL_STORAGE![i]) {
        this.pageTitle = pageTitle; 
        this.icon = icon; 
        this.routerLinkPage=routerLinkPage;

      }
  
    }
  }
 
  
}