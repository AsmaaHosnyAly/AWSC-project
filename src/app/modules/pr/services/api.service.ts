// import { FiscalYear } from './../str/str-withdraw-details-dialog/str-withdraw-details-dialog.component';
// import { FiscalYear } from './../hr/hr-incentive-allowance-dialog/hr-incentive-allowance-dialog.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagesEnums } from 'src/app/core/enums/pages.enum';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  pageEnums = PagesEnums
  url = this.pageEnums.URL
  constructor(private http: HttpClient) { }
  /******************************** crud Group **********************************/
mycondition:any;


  ///////////////////////////////// PR-Group & PR-GroupRole/////////////////////////////
  getPrModules() {
    return this.http.get<any>(`${this.url}/PRModule/get/all`);
  }

  getPrRole() {
    return this.http.get<any>(`${this.url}/PRRole/get/all`);
  }

  postPrGroup(data: any) {
    return this.http.post<any>(`${this.url}/PRGroup/Add`, data);
  }
  getItems() {
    return this.http.get<any>(`${this.url}/STRItem/get/all`);
  }

  getPrGroupRole() {
    return this.http.get<any>(`${this.url}/PRGroupRole/get/all`);
  }
  getPrGroup() {
    return this.http.get<any>(`${this.url}/PRGroup/get/all`);
  }
  putPrGroup(data: any) {
    console.log('prGroup edit data: ', data);
    return this.http.put<any>(`${this.url}/PRGroup/update`, data);
  }
  deletePrGroup(id: number) {
    console.log('deleted header bbbb row id: ', id);
    return this.http.delete<any>(`${this.url}/PRGroup/delete/` + id);
  }

  postPrGroupRole(data: any) {
    return this.http.post<any>(`${this.url}/PRGroupRole/add`, data);
  }
  getPrGroupByUserId(userId: any) {
    return this.http.get<any>(`${this.url}/PRUser/get/with/group/${userId}`);
  }
  putPrGroupRole(data: any) {
    console.log('PrGroupRole data: ', data);
    return this.http.put<any>(`${this.url}/PRGroupRole/update/`, data);
  }
  deletePrGroupRole(HeaderId: number) {
    console.log('deleted detaild row id: ', HeaderId);
    return this.http.delete<any>(`${this.url}/PRGroupRole/delete/` + HeaderId);
  }

  ///////////////////////////////// PR-User & PR-UserGroup /////////////////////////////
  postPrUser(data: any) {
    return this.http.post<any>(`${this.url}/PRUser/Add`, data);
  }
  PrUserCheckAuthenticate(name: any, password: any) {
    return this.http.post<any>(
      `${this.url}/PRUser/authenticate?username=admin&password=admin`,
      name,
      password
    );
  }
  getPrUser() {
    return this.http.get<any>(`${this.url}/PRUser/get/all`);
  }
  putPrUser(data: any) {
    console.log('prGroup edit data: ', data);
    return this.http.put<any>(`${this.url}/PRUser/update`, data);
  }
  deletePrUser(id: number) {
    console.log('deleted header bbbb row id: ', id);
    return this.http.delete<any>(`${this.url}/PRUser/delete/` + id);
  }

  postPrUserGroup(data: any) {
    return this.http.post<any>(`${this.url}/PRUserGroup/add`, data);
  }
  getPrUserGroup() {
    return this.http.get<any>(`${this.url}/PRUserGroup/get/all`);
  }
  putPrUserGroup(data: any) {
    console.log('PrGroupRole data: ', data);
    return this.http.put<any>(`${this.url}/PRUserGroup/update`, data);
  }
  deletePrUserGroup(HeaderId: number) {
    console.log('deleted detaild row id: ', HeaderId);
    return this.http.delete<any>(`${this.url}/PRUserGroup/delete/` + HeaderId);
  }


    ///////////////////////attendace reports//////////////////////////
    getAccountreports(
  
      StartDate: any, EndDate: any,account: any, report: any, reportType: any
    ) {
      console.log(
       
       
        'startdate: ',
        StartDate,'account',account,
       
        'reportName:', report, 'reportType:', reportType
    
      );
      `${this.url}/FIAccount/get/Report?`;
      this.mycondition = `${this.url}/FIAccount/get/Report?reportName=${report}&reportType=${reportType}`;
    
      
     
    
    
      if (!StartDate == false) {
        this.mycondition = ` ${this.mycondition}&startDate=${StartDate}`;
      }
      if (!EndDate == false) {
        this.mycondition = ` ${this.mycondition}&endDate=${EndDate}`;
      }
    
     
      if (!account == false) {
        this.mycondition = ` ${this.mycondition}&accountId=${account}`;
      }
      
      
    
      console.log('url', this.mycondition);
    
      // return this.http.get<any>(`${this.mycondition}`);
      return this.http.get(`${this.mycondition}`, {
        observe: 'response',
        responseType: 'blob',
      });
    }

}