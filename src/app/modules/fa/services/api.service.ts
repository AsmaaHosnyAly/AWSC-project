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

  ////////////////////////////////////////Fa-CategoryFirst///////////////////////////////////////
  getFaCategoryFirstAutoCode() {
    return this.http.get<any>(`${this.url}/FaCategoryFirst/AutoCode`);
  }
  postFaCategoryFirst(data: any) {
    return this.http.post<any>(`${this.url}/FaCategoryFirst/Add`, data);
  }
  getFaCategoryFirst() {
    return this.http.get<any>(`${this.url}/FaCategoryFirst/get/all`);
  }
  putFaCategoryFirst(data: any) {
    return this.http.put<any>(`${this.url}/FaCategoryFirst/update`, data);
  }
  deleteFaCategoryFirst(id: number) {
    return this.http.delete<any>(`${this.url}/FaCategoryFirst/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////


  ////////////////////////////////////////Fa-CategorySecond///////////////////////////////////////
  getFaCategorySecondAutoCode() {
    return this.http.get<any>(`${this.url}/FaCategorySecond/AutoCode`);
  }
  postFaCategorySecond(data: any) {
    return this.http.post<any>(`${this.url}/FaCategorySecond/Add`, data);
  }
  getFaCategorySecond() {
    return this.http.get<any>(`${this.url}/FaCategorySecond/get/all`);
  }
  putFaCategorySecond(data: any) {
    return this.http.put<any>(`${this.url}/FaCategorySecond/update`, data);
  }
  deleteFaCategorySecond(id: number) {
    return this.http.delete<any>(`${this.url}/FaCategorySecond/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////


  ////////////////////////////////////////Fa-CategoryThird///////////////////////////////////////
  getFaCategoryThirdAutoCode() {
    return this.http.get<any>(`${this.url}/FaCategoryThird/AutoCode`);
  }
  postFaCategoryThird(data: any) {
    return this.http.post<any>(`${this.url}/FaCategoryThird/Add`, data);
  }
  getFaCategoryThird() {
    return this.http.get<any>(`${this.url}/FaCategoryThird/get/all`);
  }
  putFaCategoryThird(data: any) {
    return this.http.put<any>(`${this.url}/FaCategoryThird/update`, data);
  }
  deleteFaCategoryThird(id: number) {
    return this.http.delete<any>(`${this.url}/FaCategoryThird/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////

}