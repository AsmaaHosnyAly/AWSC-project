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

  ////////////////////////////////////////Pro-ContractType///////////////////////////////////////
  getProContractTypeAutoCode() {
    return this.http.get<any>(`${this.url}/ProContractorType/AutoCode`);
  }
  postProContractType(data: any) {
    return this.http.post<any>(`${this.url}/ProContractorType/Add`, data);
  }
  getProContractType() {
    return this.http.get<any>(`${this.url}/ProContractorType/get/all`);
  }
  putProContractType(data: any) {
    return this.http.put<any>(`${this.url}/ProContractorType/update`, data);
  }
  deleteProContractType(id: number) {
    return this.http.delete<any>(`${this.url}/ProContractorType/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////

  ////////////////////////////////////////Pro-OperationType///////////////////////////////////////
  getProOperationTypeAutoCode() {
    return this.http.get<any>(`${this.url}/ProOperationType/AutoCode`);
  }
  postProOperationType(data: any) {
    return this.http.post<any>(`${this.url}/ProOperationType/Add`, data);
  }
  getProOperationType() {
    return this.http.get<any>(`${this.url}/ProOperationType/get/all`);
  }
  putProOperationType(data: any) {
    return this.http.put<any>(`${this.url}/ProOperationType/update`, data);
  }
  deleteProOperationType(id: number) {
    return this.http.delete<any>(`${this.url}/ProOperationType/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////

}


