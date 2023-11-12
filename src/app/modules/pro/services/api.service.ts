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

  ////////////////////////////////////////Pro-SellerType///////////////////////////////////////
  getProSellerTypeAutoCode() {
    return this.http.get<any>(`${this.url}/ProSellerType/AutoCode`);
  }
  postProSellerType(data: any) {
    return this.http.post<any>(`${this.url}/ProSellerType/Add`, data);
  }
  getProSellerType() {
    return this.http.get<any>(`${this.url}/ProSellerType/get/all`);
  }
  putProSellerType(data: any) {
    return this.http.put<any>(`${this.url}/ProSellerType/update`, data);
  }
  deleteProSellerType(id: number) {
    return this.http.delete<any>(`${this.url}/ProSellerType/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////

  ////////////////////////////////////////Pro-Tender///////////////////////////////////////
  getHrCityState() {
    return this.http.get<any>(`${this.url}/HrCityState/get/all`);
  }
  getProTenderType() {
    return this.http.get<any>(`${this.url}/ProTenderType/get/all`);
  }
  getProPlanType() {
    return this.http.get<any>(`${this.url}/ProPlanType/get/all`);
  }

  getProTenderAutoCode() {
    return this.http.get<any>(`${this.url}/ProTender/AutoCode`);
  }
  postProTender(data: any) {
    return this.http.post<any>(`${this.url}/ProTender/Add`, data);
  }
  getProTender() {
    return this.http.get<any>(`${this.url}/ProTender/get/all`);
  }
  putProTender(data: any) {
    return this.http.put<any>(`${this.url}/ProTender/update`, data);
  }
  deleteProTender(id: number) {
    return this.http.delete<any>(`${this.url}/ProTender/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////
}


