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
  mycondition: any;
  constructor(private http: HttpClient) { }

  ///////////////////ccActivity//////////////////
  getCcActivity() {
    return this.http.get<any>(`${this.url}/CcActivity/get/all`);
  }
  getCcActivityPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcActivity/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putCcActivity(data: any) {
    return this.http.put<any>(
      `${this.url}/CcActivity/update`,
      data
    );
  }
  deleteCcActivity(id: number) {
    console.log("id in cc activity:", id)
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
  getCcFunctionPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcFunction/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putCcFunction(data: any) {
    return this.http.put<any>(
      `${this.url}/CcFunction/update`,
      data
    );
  }
  deleteCcFunction(id: number) {
    console.log("id in cc Function:", id)
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
  getCcRegionPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcRegion/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putCcRegion(data: any) {
    return this.http.put<any>(
      `${this.url}/CcRegion/update`,
      data
    );
  }
  deleteCcRegion(id: number) {
    console.log("id in cc Region:", id)
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
  getCcSubReginPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcSubRegion/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putCcSubRegion(data: any) {
    return this.http.put<any>(
      `${this.url}/CcSubRegion/update`,
      data
    );
  }
  deleteCcSubRegion(id: number) {
    console.log("id in cc SubRegion:", id)
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
  getCcPlantPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcPlant/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putPlant(data: any) {
    return this.http.put<any>(
      `${this.url}/CcPlant/update`,
      data
    );
  }
  deletePlant(id: number) {
    console.log("id in cc SubRegion:", id)
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
  getCcSourcePaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcSource/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putCcSource(data: any) {
    return this.http.put<any>(
      `${this.url}/CcSource/update`,
      data
    );
  }
  deleteCcSource(id: number) {
    console.log("id in cc Source:", id)
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
  getCcPlantComponentPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcPlantComponent/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putCcPlantComponent(data: any) {
    console.log("data in post:", data)
    return this.http.put<any>(
      `${this.url}/CcPlantComponent/update`,
      data
    );
  }
  deleteCcPlantComponent(id: number) {
    console.log("id in cc PlantComponent:", id)
    return this.http.delete<any>(
      `${this.url}/CcPlantComponent/delete/${id}`
    );
  }
  postCcPlantComponent(data: any) {
    return this.http.post<any>(`${this.url}/CcPlantComponent/Add`, data);
  }
  /////////////////Cc Equipment//////////////////
  getEquipment() {
    return this.http.get<any>(`${this.url}/CcEquipment/get/all`);
  }
  getCcEquipmentPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcEquipment/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putEquipment(data: any) {
    console.log("data in post:", data)
    return this.http.put<any>(
      `${this.url}/CcEquipment/update`,
      data
    );
  }
  deleteEquipment(id: number) {
    console.log("id in cc PlantComponent:", id)
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

  /////////////////Cc CostCenter//////////////////
  getCcCostCenterLastCode() {
    return this.http.get<any>(`${this.url}/CcCostCenter/Get/Last/Code`);
  }
  getCostCenter() {
    return this.http.get<any>(`${this.url}/CcCostCenter/get/all`);
  }
  getCcCostCenterPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/CcCostCenter/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putCostCenter(data: any) {
    console.log("data in post:", data)
    return this.http.put<any>(
      `${this.url}/CcCostCenter/update`,
      data
    );
  }
  deleteCostCenter(id: number) {
    console.log("id in cc PlantComponent:", id)
    return this.http.delete<any>(
      `${this.url}/CcCostCenter/Delete/${id}`
    );
  }
  postCostCenter(data: any) {
    return this.http.post<any>(`${this.url}/CcCostCenter/Add`, data);
  }
  getAllFunctionnes() {

    return this.http.get<any>(`${this.url}/CcFunction/get/all`);
  }
  getAllSources() {

    return this.http.get<any>(`${this.url}/CcSource/get/all`);
  }
  getAllRegiones() {

    return this.http.get<any>(`${this.url}/CcRegion/get/all`);
  }
  getAllSubRegioness() {

    return this.http.get<any>(`${this.url}/CcSubRegion/get/all`);
  }
  getAllPlantes() {

    return this.http.get<any>(`${this.url}/CcPlant/get/all`);
  }
  getAllActivityes() {

    return this.http.get<any>(`${this.url}/CcActivity/get/all`);
  }
  getAllplantComponentes() {

    return this.http.get<any>(`${this.url}/CcPlantComponent/get/all`);
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

  postCcEntry(data: any) {
    return this.http.post<any>(`${this.url}/CcEntry/Add`, data);
  }
  getCcEntry() {
    return this.http.get<any>(`${this.url}/CcEntry/get/all`);
  }
  getCcEntryPaginate(currentPage: any, pageSize: any) {
    let urlPassed = `${this.url}/CcEntry/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putCcEntry(data: any) {
    console.log('put ccEntry data with id: ', data);
    return this.http.put<any>(`${this.url}/CcEntry/update`, data);
  }
  deleteCcEntry(id: number) {
    return this.http.delete<any>(`${this.url}/CcEntry/Delete/` + id);
  }

  postCcEntryDetails(data: any) {
    return this.http.post<any>(`${this.url}/CcEntryDetails/Add`, data);
  }
  getCcEntryDetails() {
    return this.http.get<any>(`${this.url}/CcEntryDetails/get/all`);
  }
  getCcEntryDetailsByMasterId(id: any) {
    return this.http.get<any>(`${this.url}/CcEntryDetails/get/By/Header/${id}`);
  }
  getCcEntryDetailsPaginateByMasterId(currentPage: any, pageSize: any, HeaderId: any) {
    let urlPassed = `${this.url}/CcEntryDetails/get/by/pagination?page=${currentPage}&pageSize=${pageSize}&HeaderId=${HeaderId}`;
    return urlPassed;
  }
  putCcEntryDetails(data: any) {
    console.log('put ccEntryDetails data with id: ', data);
    return this.http.put<any>(`${this.url}/CcEntryDetails/update/`, data);
  }
  deleteCcEntryDetails(HeaderId: number) {
    console.log('deleted row id: ', HeaderId);
    return this.http.delete<any>(
      `${this.url}/CcEntryDetails/Delete/` + HeaderId
    );
  }
  // getFiEntrySearach(no: any,  accountId: any, startDate: any, endDate: any, FiscalYearId: any, Description: any) {
  //   console.log(
  //     "values search passed: 'no: '", no,

  //     "' accountId: '", accountId,
  //     "' startDate: '", startDate,
  //     "' endDate: '", endDate,

  //     'FiscalYearId: ', FiscalYearId,
  //     'Description: ', Description
  //   );
  //   this.mycondition = `${this.url}/FIEntry/search?`;


  //   if (!no == false) {
  //     this.mycondition = ` ${this.mycondition}&No=${no}`;
  //   }

  //   if (!startDate == false) {
  //     this.mycondition = ` ${this.mycondition}&StartDate=${startDate}`;
  //   }
  //   if (!endDate == false) {
  //     this.mycondition = ` ${this.mycondition}&EndDate=${endDate}`;
  //   }
  //   if (!accountId == false) {
  //     this.mycondition = ` ${this.mycondition}&AccountId=${accountId}`;
  //   }

  //   if (!FiscalYearId == false) {
  //     this.mycondition = ` ${this.mycondition}&FiscalYearId=${FiscalYearId}`;
  //   }
  //   if (!Description == false) {
  //     this.mycondition = ` ${this.mycondition}&Description=${Description}`;
  //   }


  //   console.log('url', this.mycondition);

  //   return this.http.get<any>(`${this.mycondition}`);
  // }

  // getFiEntryReport(
  //   no: any,  startDate: any, endDate: any,  FiscalYearId: any, Description: any, report:any,reportType:any
  // ) {
  //   // console.log(
  //   //   'no. : ',
  //   //   no,
  //   //   'store : ',
  //   //   store,
  //   //   'date: ',
  //   //   StartDate,
  //   //   'fiscalYear: ',
  //   //   fiscalYear,
  //   //   'reportName:', report, 'reportType:', reportType

  //   // );
  //   `${this.url}/FIEntry/get/Report?`;
  //   this.mycondition = `${this.url}/FIEntry/get/Report?reportName=${report}&reportType=${reportType}`;

  //   if (!no == false) {
  //     this.mycondition = ` ${this.mycondition}&No=${no}`;
  //   }

  //   if (!report == false) {
  //     this.mycondition = ` ${this.mycondition}&reportName=${report}`;
  //   }

  //   if (!reportType == false) {
  //     this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
  //   }


  //   if (!startDate == false) {
  //     this.mycondition = ` ${this.mycondition}&StartDate=${startDate}`;
  //   }
  //   if (!endDate == false) {
  //     this.mycondition = ` ${this.mycondition}&EndDate=${endDate}`;
  //   }


  //   if (!FiscalYearId == false) {
  //     this.mycondition = ` ${this.mycondition}&FiscalYearId=${FiscalYearId}`;
  //   }
  //   if (!Description == false) {
  //     this.mycondition = ` ${this.mycondition}&Description=${Description}`;
  //   }
  //   // if (!costCenter == false) {
  //   //   this.mycondition = ` ${this.mycondition}&GroupId=${costCenter}`;
  //   // }

  //   console.log('url', this.mycondition);

  //   // return this.http.get<any>(`${this.mycondition}`);
  //   return this.http.get(`${this.mycondition}`, {
  //     observe: 'response',
  //     responseType: 'blob',
  //   });
  // }

  //////////////////////////Reports/////////////////////////////////////
  getAccountreports(

    StartDate: any, EndDate: any, account: any, report: any, reportType: any
  ) {
    console.log(


      'startdate: ',
      StartDate, 'account', account,

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
