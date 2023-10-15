
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagesEnums } from 'src/app/core/enums/pages.enum';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  pageEnums = PagesEnums
  url =this.pageEnums.URL
  constructor(private http: HttpClient) {}


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


    ///////////////////////////////// Py-Item /////////////////////////////
    postPyItem(data: any) {
      return this.http.post<any>(`${this.url}/PyItem/Add`, data);
    }
    getPyItem() {
      return this.http.get<any>(`${this.url}/PyItem/get/all`);
    }
    putPyItem(data: any) {
      return this.http.put<any>(`${this.url}/PyItem/update`, data);
    }
    deletePyItem(id: number) {
      return this.http.delete<any>(`${this.url}/PyItem/delete/` + id);
    }
  
    getAllCategory() {
      return this.http.get<any>(`${this.url}/PyItemCategory/get/all`);
    }

}
