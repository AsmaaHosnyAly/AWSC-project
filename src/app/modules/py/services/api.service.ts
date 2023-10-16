
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


  ///////////////////////////////// Py-Installment /////////////////////////////
  postPyInstallment(data: any) {
    return this.http.post<any>(`${this.url}/PyInstallment/Add`, data);
  }
  getPyInstallment() {
    return this.http.get<any>(`${this.url}/PyInstallment/get/all`);
  }
  putPyInstallment(data: any) {
    return this.http.put<any>(`${this.url}/PyInstallment/update`, data);
  }
  deletePyInstallment(id: number) {
    return this.http.delete<any>(`${this.url}/PyInstallment/delete/` + id);
  }

  getEmployees() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
  }

  getAllpyItems() {
    return this.http.get<any>(`${this.url}/PyItem/get/all`);
  }


  /////////////////////// Py-ItemGroup & ItemGroupDetails & ItemGroupEmployee ///////////////////////
  postPyItemGroup(data: any) {
    return this.http.post<any>(`${this.url}/PyItemGroup/Add`, data);
  }
  getPyItemGroup() {
    return this.http.get<any>(`${this.url}/PyItemGroup/get/all`);
  }
  putPyItemGroup(data: any) {
    return this.http.put<any>(`${this.url}/PyItemGroup/update`, data);
  }
  deletePyItemGroup(id: number) {
    return this.http.delete<any>(`${this.url}/PyItemGroup/delete/` + id);
  }


  postPyItemGroupDetails(data: any) {
    return this.http.post<any>(`${this.url}/PyItemGroupDetails/Add`, data);
  }
  getPyItemGroupDetails() {
    return this.http.get<any>(`${this.url}/PyItemGroupDetails/get/all`);
  }
  putPyItemGroupDetails(data: any) {
    return this.http.put<any>(`${this.url}/PyItemGroupDetails/update`, data);
  }
  deletePyItemGroupDetails(id: number) {
    return this.http.delete<any>(`${this.url}/PyItemGroupDetails/delete/` + id);
  }

  // getAllpyItems() {
  //   return this.http.get<any>(`${this.url}/PyItem/get/all`);
  // }

}
