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
  mycondition: any;
  constructor(private http: HttpClient) { }




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

  ///////////////////////////////// cc-Entry & details/////////////////////////////
  getLastFiscalYear() {
    return this.http.get<any>(
      `${this.url}/STRFiscalYear/get/Last/fisical/year`
    );
  } 
  getFiscalYears() {
    return this.http.get<any>(`${this.url}/STRFiscalYear/get/all`);
  }

  getJournals() {
    return this.http.get<any>(`${this.url}/FIJournal/get/all`);
  }
  getFiAccounts() {
    return this.http.get<any>(`${this.url}/FIAccount/get/all`);
  }
  getFiAccountItems() {
    return this.http.get<any>(`${this.url}/FiAccountItem/get/all`);
  }
  getFiEntrySource() {
    return this.http.get<any>(`${this.url}/FiEntrySourceType/get/all`);
  }

  postFiEntry(data: any) {
    return this.http.post<any>(`${this.url}/FIEntry/Add`, data);
  }
  getFiEntry() {
    return this.http.get<any>(`${this.url}/FIEntry/get/all`);
  }
  getCcEntryPaginate(currentPage: any, pageSize: any){
    let urlPassed = `${this.url}/CcEntry/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putFiEntry(data: any) {
    console.log('put fiEntry data with id: ', data);
    return this.http.put<any>(`${this.url}/FIEntry/update`, data);
  }
  deleteCcEntry(id: number) {
    return this.http.delete<any>(`${this.url}/CcEntry/Delete/` + id);
  }

  postFiEntryDetails(data: any) {
    return this.http.post<any>(`${this.url}/FIEntryDetails/Add`, data);
  }
  getCcEntryDetails() {
    return this.http.get<any>(`${this.url}/CcEntryDetails/get/all`);
  }
  getFiEntryDetailsByMasterId(id :any) {
    return this.http.get<any>(`${this.url}/FIEntryDetails/get/By/Header/${id}`);
  }
  putFiEntryDetails(data: any) {
    console.log('put fiEntryDetails data with id: ', data);
    return this.http.put<any>(`${this.url}/FIEntryDetails/update/`, data);
  }
  deleteCcEntryDetails(HeaderId: number) {
    console.log('deleted row id: ', HeaderId);
    return this.http.delete<any>(
      `${this.url}/CcEntryDetails/Delete/` + HeaderId
    );
  }
  getFiEntrySearach(no: any,  accountId: any, startDate: any, endDate: any, FiscalYearId: any, Description: any) {
    console.log(
      "values search passed: 'no: '", no,
     
      "' accountId: '", accountId,
      "' startDate: '", startDate,
      "' endDate: '", endDate,
     
      'FiscalYearId: ', FiscalYearId,
      'Description: ', Description
    );
    this.mycondition = `${this.url}/FIEntry/search?`;


    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
   
    if (!startDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${startDate}`;
    }
    if (!endDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${endDate}`;
    }
    if (!accountId == false) {
      this.mycondition = ` ${this.mycondition}&AccountId=${accountId}`;
    }
    
    if (!FiscalYearId == false) {
      this.mycondition = ` ${this.mycondition}&FiscalYearId=${FiscalYearId}`;
    }
    if (!Description == false) {
      this.mycondition = ` ${this.mycondition}&Description=${Description}`;
    }


    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
  }

  getFiEntryReport(
    no: any,  startDate: any, endDate: any,  FiscalYearId: any, Description: any, report:any,reportType:any
  ) {
    // console.log(
    //   'no. : ',
    //   no,
    //   'store : ',
    //   store,
    //   'date: ',
    //   StartDate,
    //   'fiscalYear: ',
    //   fiscalYear,
    //   'reportName:', report, 'reportType:', reportType

    // );
    `${this.url}/FIEntry/get/Report?`;
    this.mycondition = `${this.url}/FIEntry/get/Report?reportName=${report}&reportType=${reportType}`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
   
    if (!report == false) {
      this.mycondition = ` ${this.mycondition}&reportName=${report}`;
    }

    if (!reportType == false) {
      this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
    }


    if (!startDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${startDate}`;
    }
    if (!endDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${endDate}`;
    }

   
    if (!FiscalYearId == false) {
      this.mycondition = ` ${this.mycondition}&FiscalYearId=${FiscalYearId}`;
    }
    if (!Description == false) {
      this.mycondition = ` ${this.mycondition}&Description=${Description}`;
    }
    // if (!costCenter == false) {
    //   this.mycondition = ` ${this.mycondition}&GroupId=${costCenter}`;
    // }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
