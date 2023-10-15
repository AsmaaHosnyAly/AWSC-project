
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
///////////////////////////////// PyTaxBracket /////////////////////////////
postTaxBracket(data: any) {
  return this.http.post<any>(`${this.url}/PyTaxBracket/Add`, data);
}
getTaxBracket() {
  return this.http.get<any>(`${this.url}/PyTaxBracket/get/all`);
}
putTaxBracket(data: any) {
  return this.http.put<any>(`${this.url}/PyTaxBracket/update`, data);
}
deleteTaxBracket(id: number) {
  return this.http.delete<any>(`${this.url}/PyTaxBracket/delete/` + id);
}


    ///////////////////////////////// Py-Installment /////////////////////////////
    postPyItemCategory(data: any) {
      return this.http.post<any>(`${this.url}/PyItemCategory/Add`, data);
    }
    getPyItemCategory() {
      return this.http.get<any>(`${this.url}/PyItemCategory/get/all`);
    }
    putPyItemCategory(data: any) {
      return this.http.put<any>(`${this.url}/PyItemCategory/update`, data);
    }
    deletePyItemCategory(id: number) {
      return this.http.delete<any>(`${this.url}/PyItemCategory/delete/` + id);
    }
  

}
