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
  constructor(private http: HttpClient) { }


  mycondition: any;

  ///////////////////ccActivity//////////////////
  getCcActivity() {
    return this.http.get<any>(`${this.url}/CcActivity/get/all`);
  }
  putCcActivity(data: any) {
    return this.http.put<any>(
      `${this.url}/CcActivity/update`,
      data
    );
  }
  deleteCcActivity(id: number) {
    console.log("id in cc activity:",id)
    return this.http.delete<any>(
      `${this.url}/CcActivity/delete/${id}`
    );
  }
  postCcActivity(data: any) {
    return this.http.post<any>(`${this.url}/CcActivity/Add`, data);
  }


  ////////////////CcFunction//////////////////
  getCcFunction() {
    return this.http.get<any>(`${this.url}/CcFunction/get/all`);
  }
  putCcFunction(data: any) {
    return this.http.put<any>(
      `${this.url}/CcFunction/update`,
      data
    );
  }
  deleteCcFunction(id: number) {
    console.log("id in cc Function:",id)
    return this.http.delete<any>(
      `${this.url}/CcFunction/delete/${id}`
    );
  }
  postCcFunction(data: any) {
    return this.http.post<any>(`${this.url}/CcFunction/Add`, data);
  }


  

  ////////////////CcRegion//////////////////////////
  getCcRegion() {
    return this.http.get<any>(`${this.url}/CcRegion/get/all`);
  }
  putCcRegion(data: any) {
    return this.http.put<any>(
      `${this.url}/CcRegion/update`,
      data
    );
  }
  deleteCcRegion(id: number) {
    console.log("id in cc Region:",id)
    return this.http.delete<any>(
      `${this.url}/CcRegion/delete/${id}`
    );
  }
  postCcRegion(data: any) {
    return this.http.post<any>(`${this.url}/CcRegion/Add`, data);
  }






  ////////////////////subRegion//////////////////
  getCcSubRegion() {
    return this.http.get<any>(`${this.url}/CcSubRegion/get/all`);
  }
  putCcSubRegion(data: any) {
    return this.http.put<any>(
      `${this.url}/CcSubRegion/update`,
      data
    );
  }
  deleteCcSubRegion(id: number) {
    console.log("id in cc SubRegion:",id)
    return this.http.delete<any>(
      `${this.url}/CcSubRegion/delete/${id}`
    );
  }
  postCcSubRegion(data: any) {
    return this.http.post<any>(`${this.url}/CcSubRegion/Add`, data);
  }
   ////////////////////cc plant//////////////////
   getPlant() {
    return this.http.get<any>(`${this.url}/CcPlant/get/all`);
  }
  putPlant(data: any) {
    return this.http.put<any>(
      `${this.url}/CcPlant/update`,
      data
    );
  }
  deletePlant(id: number) {
    console.log("id in cc SubRegion:",id)
    return this.http.delete<any>(
      `${this.url}/CcPlant/Delete/${id}`
    );
  }
  postPlant(data: any) {
    return this.http.post<any>(`${this.url}/CcPlant/add`, data);
  }
  getAllSubRegiones() {
    return this.http.get<any>(`${this.url}/CcSubRegion/get/all`);
  }

  ////////////////////////CcSources//////////////////
  getCcSource() {
    return this.http.get<any>(`${this.url}/CcSource/get/all`);
  }
  putCcSource(data: any) {
    return this.http.put<any>(
      `${this.url}/CcSource/update`,
      data
    );
  }
  deleteCcSource(id: number) {
    console.log("id in cc Source:",id)
    return this.http.delete<any>(
      `${this.url}/CcSource/delete/${id}`
    );
  }
  postCcSource(data: any) {
    return this.http.post<any>(`${this.url}/CcSource/Add`, data);
  }



  /////////////////Cc Plant Component//////////////////
  getCcPlantComponent() {

    return this.http.get<any>(`${this.url}/CcPlantComponent/get/all`);
  }
  putCcPlantComponent(data: any) {
    console.log("data in post:",data)
    return this.http.put<any>(
      `${this.url}/CcPlantComponent/update`,
      data
    );
  }
  deleteCcPlantComponent(id: number) {
    console.log("id in cc PlantComponent:",id)
    return this.http.delete<any>(
      `${this.url}/CcPlantComponent/delete/${id}`
    );
  }
  postCcPlantComponent(data: any) {
    return this.http.post<any>(`${this.url}/CcPlantComponent/Add`, data);
  }
   /////////////////Cc Plant Component//////////////////
   getEquipment() {

    return this.http.get<any>(`${this.url}/CcEquipment/get/all`);
  }
  putEquipment(data: any) {
    console.log("data in post:",data)
    return this.http.put<any>(
      `${this.url}/CcEquipment/update`,
      data
    );
  }
  deleteEquipment(id: number) {
    console.log("id in cc PlantComponent:",id)
    return this.http.delete<any>(
      `${this.url}/CcEquipment/Delete/${id}`
    );
  }
  postEquipment(data: any) {
    return this.http.post<any>(`${this.url}/CcEquipment/Add`, data);
  }
  getAllCostCenteres() {

    return this.http.get<any>(`${this.url}/CcCostCenter/get/all`);
  }



  ////////////////CcCostCenter///////////////////////////////////////
  getCcCostCenter() {

    return this.http.get<any>(`${this.url}/CcCostCenter/get/all`);
  }
  putCcCostCenter(data: any) {
    console.log("data in post:",data)
    return this.http.put<any>(
      `${this.url}/CcCostCenter/update`,
      data
    );
  }
  deleteCcCostCenter(id: number) {
    console.log("id in cc CostCenter:",id)
    return this.http.delete<any>(
      `${this.url}/CcCostCenter/delete/${id}`
    );
  }
  postCcCostCenter(data: any) {
    return this.http.post<any>(`${this.url}/CcCostCenter/Add`, data);
  }

  //////////////////////////Reports/////////////////////////////////////
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
