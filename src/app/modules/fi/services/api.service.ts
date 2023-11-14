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

  constructor(private http: HttpClient) { }
  /******************************** crud Group **********************************/
  url = this.pageEnums.URL
  mycondition: any;

  // baseApiUrl = 'https://file.io';
  // attachmentURL='src\app\files\str-uploads';
  // mycondition: any;

  public reportData: [] = [];

  public reportName: string = '';

  getSubGrads(selectedOption: any) {
    throw new Error('Method not implemented.');
  }
  get(arg0: string) {
    throw new Error('Method not implemented.');
  }



  // FIAccountHierarchy
  getFIAccountHierarchy() {
    return this.http.get<any>(
      `${this.url}/FIAccountHierarchy/get/all`
    );
  }
  putFIAccountHierarchy(data: any) {
    return this.http.put<any>(
      `${this.url}/FIAccountHierarchy/update`,
      data
    );
  }
  deleteFIAccountHierarchy(id: number) {
    return this.http.delete<any>(
      `${this.url}/FIAccountHierarchy/delete/${id}`
    );
  }
  postFIAccountHierarchy(data: any) {
    return this.http.post<any>(
      `${this.url}/FIAccountHierarchy/Add`,
      data
    );
  }
  // FiAccountItem
  getFiAccountItem() {
    return this.http.get<any>(
      `${this.url}/FiAccountItem/get/all`
    );
  }
  putFiAccountItem(data: any) {
    return this.http.put<any>(
      `${this.url}/FiAccountItem/update`,
      data
    );
  }
  deleteFiAccountItem(id: number) {
    return this.http.delete<any>(
      `${this.url}/FiAccountItem/delete/${id}`
    );
  }
  postFiAccountItem(data: any) {
    return this.http.post<any>(
      `${this.url}/FiAccountItem/Add`,
      data
    );
  }
  getAllAccounts(): Observable<any> {
    return this.http.get<any>(`${this.url}/FIAccount/get/all`);
  }

  getAllAccountItemCategory(): Observable<any> {
    return this.http.get<any>(`${this.url}/FIAccountItemCategory/get/all`);
  }
  // FIJournal
  getFIJournal() {
    return this.http.get<any>(`${this.url}/FIJournal/get/all`);

  }
  getFiJournalPaginate(currentPage: any, pageSize: any) {
    let urlPassed = `${this.url}/FIJournal/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  getFIJournalSearch(no: any, Description: any, StartDate: any, EndDate: any, fiscalYear: any) {
    console.log("no", no, 'descri', Description, 'startdate', StartDate, 'enddate', EndDate, 'fiscal', fiscalYear)
    this.mycondition = `${this.url}/FIJournal/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!Description == false) {
      this.mycondition = ` ${this.mycondition}&Description=${Description}`;
    }
    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }
    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&FiscalYearId=${fiscalYear}`;
    }
    // if (!itemId == false) {
    //   this.mycondition = ` ${this.mycondition}&ItemId=${itemId}`;
    // }
    // if (!employeeId == false) {
    //   this.mycondition = ` ${this.mycondition}&EmployeeId=${employeeId}`;
    // }
    // if (!costCenterId == false) {
    //   this.mycondition = ` ${this.mycondition}&costCenterId=${costCenterId}`;
    // }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
  }
  putFIJournal(data: any) {
    return this.http.put<any>(
      `${this.url}/FIJournal/update`,
      data
    );
  }
  deleteFIJournal(id: number) {
    console.log("id", id)
    return this.http.delete<any>(
      `${this.url}/FIJournal/delete/${id}`
    );
  }
  postFIJournal(data: any) {
    return this.http.post<any>(
      `${this.url}/FIJournal/Add`,
      data
    );
  }




  //Item

  postItems(data: any) {
    return this.http.post<any>(`${this.url}/STRItem/Add`, data);
  }
  getItemNo(data: any) {
    console.log('No:', data);
    return this.http.get<any>(
      `${this.url}/STRItem/Get/lastNo?GroupId=${data}`
    );
  }
  getItem() {
    return this.http.get<any>(`${this.url}/STRItem/get/all`);
  }
  getItemById(id: any) {
    let urlPassed = `${this.url}/STRItem/get/${id}`;
    return urlPassed;
  }
  putItem(data: any) {
    return this.http.put<any>(
      `${this.url}/STRItem/update`,
      data
    );
  }


  printReportItems(
    name: any,
    fullcode: any,
    type: any,
    commodity: any,
    grade: any,
    platoon: any,
    group: any,
    unit: any
  ) {
    `${this.url}/STRItem/getReport?reportName=STRItemsReport&reportType=pdf`;
    this.mycondition = `${this.url}/STRItem/getReport?reportName=STRItemsReport&reportType=pdf`;

    if (!name == false) {
      this.mycondition = ` ${this.mycondition}&Name=${name}`;
    }
    if (!fullcode == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${fullcode}`;
    }

    if (!type == false) {
      this.mycondition = ` ${this.mycondition}&Type=${fullcode}`;
    }

    if (!commodity == false) {
      this.mycondition = ` ${this.mycondition}&CommodityId=${commodity}`;
    }
    if (!grade == false) {
      this.mycondition = ` ${this.mycondition}&GradeId=${grade}`;
    }
    if (!platoon == false) {
      this.mycondition = ` ${this.mycondition}&PlatoonId=${platoon}`;
    }
    if (!group == false) {
      this.mycondition = ` ${this.mycondition}&GroupId=${group}`;
    }
    if (!unit == false) {
      this.mycondition = ` ${this.mycondition}&UnitId=${unit}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  addTable(
    no: any,
    store: any,
    date: any,
    fiscalYear: any,
    item: any,
    employee: any,
    costCenter: any
  ) {
    `${this.url}/STRItem/getReport?reportName=STRItemsReport&reportType=pdf`;
    this.mycondition = `${this.url}/STRItem/getReport?reportName=STRItemsReport&reportType=pdf`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&Name=${no}`;
    }
    if (!store == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${store}`;
    }

    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&Type=${fiscalYear}`;
    }

    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&CommodityId=${date}`;
    }
    if (!item == false) {
      this.mycondition = ` ${this.mycondition}&GradeId=${item}`;
    }
    if (!employee == false) {
      this.mycondition = ` ${this.mycondition}&GradeId=${employee}`;
    }
    if (!costCenter == false) {
      this.mycondition = ` ${this.mycondition}&GradeId=${costCenter}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  // Account

  postAccount(data: any) {
    return this.http.post<any>(
      `${this.url}/FIAccount/Add`,
      data
    );
  }
  getAccount() {
    return this.http.get<any>(`${this.url}/FIAccount/get/all`);
  }
  putAccount(data: any) {
    return this.http.put<any>(
      `${this.url}/FIAccount/update`,
      data
    );
  }
  deleteAccount(id: number) {
    return this.http.delete<any>(
      `${this.url}/FIAccount/delete/${id}`
    );
  }
  getAllAccountHierarchy(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/FIAccountHierarchy/get/all`
    );
  }

  //FiEntrySourceType
  postEntrySourceType(data: any) {
    console.log("data", data)
    return this.http.post<any>(
      `${this.url}/FiEntrySourceType/Add`,
      data
    );
  }
  getEntrySourceType() {
    return this.http.get<any>(
      `${this.url}/FiEntrySourceType/get/all`
    );
  }
  putEntrySourceType(data: any) {
    console.log("data", data)
    return this.http.put<any>(
      `${this.url}/FiEntrySourceType/update`,
      data
    );
  }
  deleteEntrySourceType(id: number) {
    return this.http.delete<any>(
      `${this.url}/FiEntrySourceType/delete/${id}`
    );
  }
  getAllEntrySources(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/FiEntrySource/get/all`
    );
  }

  //FiEntrySource
  postEntrySource(data: any) {
    return this.http.post<any>(
      `${this.url}/FiEntrySource/Add`,
      data
    );
  }
  getEntrySource() {
    return this.http.get<any>(
      `${this.url}/FiEntrySource/get/all`
    );
  }
  putEntrySource(data: any) {
    return this.http.put<any>(
      `${this.url}/FiEntrySource/update`,
      data
    );
  }
  deleteEntrySource(id: number) {
    console.log("id:", id)
    return this.http.delete<any>(
      `${this.url}/FiEntrySource/delete/${id}`
    );
  }

  //AccountParent
  postAccountParent(data: any) {
    return this.http.post<any>(
      `${this.url}/FIAccountParent/Add`,
      data
    );
  }
  getAccountParent() {
    return this.http.get<any>(
      `${this.url}/FIAccountParent/get/all`
    );
  }
  putAccountParent(data: any) {
    return this.http.put<any>(
      `${this.url}/FIAccountParent/update`,
      data
    );
  }
  deleteAccountParent(id: number) {
    return this.http.delete<any>(
      `${this.url}/FIAccountParent/delete/${id}`
    );
  }
  getAllAccountsParents(): Observable<any> {
    return this.http.get<any>(`${this.url}/FIAccount/get/all`);
  }

  // crud items
  getFiscalYears() {
    return this.http.get<any>(`${this.url}/STRFiscalYear/get/all`);
  }

  getLastFiscalYear() {
    return this.http.get<any>(
      `${this.url}/STRFiscalYear/get/Last/fisical/year`
    );
  }

  getFiscalYearById(id: any) {
    return this.http.get<any>(`${this.url}/STRFiscalYear/get/${id}`);
  }

  ////////file upload/////////
  upload(file: any): Observable<any> {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append('file', file);

    // Make http post request over api
    // with formData as req

    return this.http.post('http://192.168.100.213/files/str-uploads', formData);
    // alert(this.baseApiUrl)
  }
  //  showfile(file:any){
  //   const formData = new FormData();

  //   // Store form name as "file" with file data
  //   formData.append("file", file);

  //   // Make http post request over api
  //   // with formData as req
  //   return this.http.get(this.baseApiUrl)
  // }

  ///////////////////////////////// Fi-Entry & details/////////////////////////////
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
  getFiEntryPaginate(currentPage: any, pageSize: any) {
    let urlPassed = `${this.url}/FIEntry/get/pagnation?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putFiEntry(data: any) {
    console.log('put fiEntry data with id: ', data);
    return this.http.put<any>(`${this.url}/FIEntry/update`, data);
  }
  deleteFiEntry(id: number) {
    return this.http.delete<any>(`${this.url}/FIEntry/delete/` + id);
  }

  postFiEntryDetails(data: any) {
    return this.http.post<any>(`${this.url}/FIEntryDetails/Add`, data);
  }
  getFiEntryDetails() {
    return this.http.get<any>(`${this.url}/FIEntryDetails/get/all`);
  }
  getFiEntryDetailsByMasterId(id: any) {
    return this.http.get<any>(`${this.url}/FIEntryDetails/get/By/Header/${id}`);
  }
  putFiEntryDetails(data: any) {
    console.log('put fiEntryDetails data with id: ', data);
    return this.http.put<any>(`${this.url}/FIEntryDetails/update/`, data);
  }
  deleteFiEntryDetails(HeaderId: number) {
    console.log('deleted row id: ', HeaderId);
    return this.http.delete<any>(
      `${this.url}/FIEntryDetails/delete/` + HeaderId
    );
  }
  getFiEntrySearach(no: any, journalId: any, accountId: any, startDate: any, endDate: any, sourceId: any, FiscalYearId: any, Description: any) {
    console.log(
      "values search passed: 'no: '", no,
      "' journalId: '", journalId,
      "' accountId: '", accountId,
      "' startDate: '", startDate,
      "' endDate: '", endDate,
      'sourceId: ', sourceId,
      'FiscalYearId: ', FiscalYearId,
      'Description: ', Description
    );
    this.mycondition = `${this.url}/FIEntry/search?`;


    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!journalId == false) {
      this.mycondition = ` ${this.mycondition}&JournalId=${journalId}`;
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
    if (!sourceId == false) {
      this.mycondition = ` ${this.mycondition}&FiEntrySourceTypeId=${sourceId}`;
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

  /////////////////////reports/////////////////////////
  // getAccountreports(

  //   StartDate: any, EndDate: any, account: any, report: any, reportType: any
  // ) {
  //   console.log(


  //     'startdate: ',
  //     StartDate, 'account', account,

  //     'reportName:', report, 'reportType:', reportType

  //   );
  //   `${this.url}/FIAccount/get/Report?`;
  //   this.mycondition = `${this.url}/FIAccount/get/Report?reportName=${report}&reportType=${reportType}`;





  //   if (!StartDate == false) {
  //     this.mycondition = ` ${this.mycondition}&startDate=${StartDate}`;
  //   }
  //   if (!EndDate == false) {
  //     this.mycondition = ` ${this.mycondition}&endDate=${EndDate}`;
  //   }


  //   if (!account == false) {
  //     this.mycondition = ` ${this.mycondition}&accountId=${account}`;
  //   }



  //   console.log('url', this.mycondition);

  //   // return this.http.get<any>(`${this.mycondition}`);
  //   return this.http.get(`${this.mycondition}`, {
  //     observe: 'response',
  //     responseType: 'blob',
  //   });
  // }

  getAccountreports(
    StartDate: any, EndDate: any, PrevstartDate: any, PrevendDate: any, account: any, report: any, reportType: any
  ) {
    console.log(
      'startdate: ', StartDate,
      'PrevstartDate: ', PrevstartDate,
      'EndDate: ', EndDate,
      'PrevendDate: ', PrevendDate,
      'account', account,
      'reportName:', report,
      'reportType:', reportType
    );

    `${this.url}/FIAccount/get/Report?`;
    this.mycondition = `${this.url}/FIAccount/get/Report?reportName=${report}&reportType=${reportType}`;

    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&startDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&endDate=${EndDate}`;
    }
    if (!PrevstartDate == false) {
      this.mycondition = ` ${this.mycondition}&PrevstartDate=${PrevstartDate}`;
    }
    if (!PrevendDate == false) {
      this.mycondition = ` ${this.mycondition}&PrevendDate=${PrevendDate}`;
    }
    if (!account == false) {
      this.mycondition = ` ${this.mycondition}&code=${account}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }


  //////////////////FiEntryreport////////////////
  getStr(
    no: any,
    store: any,
    StartDate: any, EndDate: any,
    fiscalYear: any,
    item: any,
    employee: any,
    costCenter: any, report: any, reportType: any
  ) {
    console.log(
      'no. : ',
      no,
      'store : ',
      store,
      'date: ',
      StartDate,
      'fiscalYear: ',
      fiscalYear,
      'reportName:', report, 'reportType:', reportType

    );
    `${this.url}/STRWithdraw/get/Report?`;
    this.mycondition = `${this.url}/STRWithdraw/get/Report?reportName=${report}&reportType==${reportType}`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&Name=${no}`;
    }
    if (!store == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${store}`;
    }
    if (!report == false) {
      this.mycondition = ` ${this.mycondition}&reportName=${report}`;
    }

    if (!reportType == false) {
      this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
    }


    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }

    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&CommodityId=${fiscalYear}`;
    }
    if (!item == false) {
      this.mycondition = ` ${this.mycondition}&GradeId=${item}`;
    }
    if (!employee == false) {
      this.mycondition = ` ${this.mycondition}&PlatoonId=${employee}`;
    }
    if (!costCenter == false) {
      this.mycondition = ` ${this.mycondition}&GroupId=${costCenter}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }


  getFiEntryReport(
    no: any, journalId: any, startDate: any, endDate: any, sourceId: any, FiscalYearId: any, Description: any, report: any, reportType: any
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
    if (!journalId == false) {
      this.mycondition = ` ${this.mycondition}&JournalId=${journalId}`;
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

    if (!sourceId == false) {
      this.mycondition = ` ${this.mycondition}&FiEntrySourceTypeId=${sourceId}`;
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