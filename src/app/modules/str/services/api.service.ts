
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagesEnums } from 'src/app/core/enums/pages.enum';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  pageEnums = PagesEnums
  url = this.pageEnums.URL
  constructor(private http: HttpClient) { }
  /******************************** crud Group **********************************/

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

  /********************************  unit crud  **********************************/

  postunit(data: any) {
    return this.http.post<any>(`${this.url}/STRUnit/Add`, data);
  }
  // here
  getunit() {
    return this.http.get<any>(`${this.url}/STRUnit/get/all`);
  }
  putunit(data: any) {
    return this.http.put<any>(
      `${this.url}/STRUnit/update`,
      data
    );
  }
  deleteunit(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRUnit/delete/${id}`
    );
  }

  // start crud grade
  //selvana
  postGrade(data: any) {
    return this.http.post<any>(
      `${this.url}/STRGrade/Add`,
      data
    );
  }
  getGrade() {
    return this.http.get<any>(`${this.url}/STRGrade/get/all`);
  }
  putGrade(data: any) {
    return this.http.put<any>(
      `${this.url}/STRGrade/update`,
      data
    );
  }
  deleteGrade(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRGrade/delete/${id}`
    );
  }
  getAllCommodity(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/STRCommodity/get/all`
    );
  }

  getGradeCode(data: any) {
    return this.http.get<any>(
      `${this.url}/STRGrade/AutoCode?commidtyId=${data}`
    );
  }

  getStrOpenDetails() {
    return this.http.get<any>('http://localhost:3000/StrOpenDetails/');
  }

  getStoreList() {
    return this.http.get<any>('http://localhost:3000/StoreList/');
  }
  //Platoon

  postPlatoon(data: any) {
    return this.http.post<any>(
      `${this.url}/STRPlatoon/Add`,
      data
    );
  }
  getPlatoon() {
    return this.http.get<any>(`${this.url}/STRPlatoon/get/all`);
  }
  putPlatoon(data: any) {
    return this.http.put<any>(
      `${this.url}/STRPlatoon/update`,
      data
    );
  }
  deletePlatoon(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRPlatoon/delete/${id}`
    );
  }

  getPlatoonCode(GradeId: any) {
    console.log('gradeId:', GradeId);

    return this.http.get<any>(
      `${this.url}/STRPlatoon/AutoCode?GradeId=${GradeId}`
    );
  }

  getAllCommodities(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/STRCommodity/get/all`
    );
  }

  getAllAccount(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/FIAccount/get/all`
    );
  }
  getAllGrades(): Observable<any> {
    return this.http.get<any>(`${this.url}/STRGrade/get/all`);
  }

  //Group

  postGroups(data: any) {
    return this.http.post<any>(
      `${this.url}/STRGroup/Add`,
      data
    );
  }
  getGroups() {
    return this.http.get<any>(`${this.url}/STRGroup/get/all`);
  }
  putGroups(data: any) {
    return this.http.put<any>(
      `${this.url}/STRGroup/update`,
      data
    );
  }
  deleteGroups(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRGroup/delete/${id}`
    );
  }
  getAllCommoditiesg(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/STRCommodity/get/all`
    );
  }
  getAllGradesg(): Observable<any> {
    return this.http.get<any>(`${this.url}/STRGrade/get/all`);
  }

  getAllPlatoonsg(): Observable<any> {
    return this.http.get<any>(`${this.url}/STRPlatoon/get/all`);
  }

  getGroupCode(data: any) {
    console.log('platoon id:', data);

    return this.http.get<any>(
      `${this.url}/STRGroup/AutoCode?PlatoonId=${data}`
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
  getItemPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/STRItem/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putItem(data: any) {
    return this.http.put<any>(
      `${this.url}/STRItem/update`,
      data
    );
  }
  deleteItems(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRItem/delete/${id}`
    );
  }
  getAllCommoditiesi(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/STRCommodity/get/all`
    );
  }
  getAllGradesi(): Observable<any> {
    return this.http.get<any>(`${this.url}/STRGrade/get/all`);
  }

  getAllPlatoonsi(): Observable<any> {
    return this.http.get<any>(`${this.url}/STRPlatoon/get/all`);
  }

  getAllGroupsi(): Observable<any> {
    return this.http.get<any>(`${this.url}/STRGroup/get/all`);
  }

  getAllUnitsi(): Observable<any> {
    return this.http.get<any>(`${this.url}/STRUnit/get/all`);
  }

  getSearchItem(
    name: any,
    fullcode: any,
    type: any,
    commodity: any,
    grade: any,
    platoon: any,
    group: any,
    unit: any
  ) {
    this.mycondition = `${this.url}/STRItem/search?`;

    if (!name == false) {
      this.mycondition = ` ${this.mycondition}&Name=${name}`;
    }
    if (!fullcode == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${fullcode}`;
    }

    if (!type == false) {
      this.mycondition = ` ${this.mycondition}&Type=${type}`;
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

    return this.http.get<any>(`${this.mycondition}`);
  }

  printReportItems(
    name: any,
    fullcode: any,
    type: any,
    commodity: any,
    grade: any,
    platoon: any,
    group: any,
    unit: any,
    storeId: any,
    itemId: any,
    StartDate: any,
    EndDate: any,
    reportName: any,
    reportType: any
  ) {
    `${this.url}/STRItem/get/Report?`;
    this.mycondition = `${this.url}/STRItem/get/Report?reportName=${reportName}&reportType=${reportType}`;
    // `${this.url}/STRItem/getReport?reportName=STRItemsReport&reportType=${reportType}`;
    // this.mycondition = `${this.url}/STRItem/get/Report?reportName=STRItemsReport&reportType=pdf`;

    if (!name == false) {
      this.mycondition = ` ${this.mycondition}&Name=${name}`;
    }
    if (!fullcode == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${fullcode}`;
    }

    if (!type == false) {
      this.mycondition = ` ${this.mycondition}&Type=${type}`;
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
    if (!storeId == false) {
      this.mycondition = ` ${this.mycondition}&soreId=${storeId}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&itemId=${itemId}`;
    }
    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&startdate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&enddate=${EndDate}`;
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



  strAdd(
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
    `${this.url}/STRAdd/get/Report?`;
    this.mycondition = `${this.url}/STRAdd/get/Report?reportName=${report}&reportType=${reportType}`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&Name=${no}`;
    }
    if (!store == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${store}`;
    }
    // if (!report == false) {
    //   this.mycondition = ` ${this.mycondition}&reportName=${report}`;
    // }

    // if (!reportType == false) {
    //   this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
    // }


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

  openingStock(
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
    `${this.url}/STROpeningStock/get/Report?`;
    this.mycondition = `${this.url}/STROpeningStock/get/Report?reportName=${report}&reportType=${reportType}`;

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

  getStrEmployeeCustodyReport(
    no: any, StartDate: any, EndDate: any, fiscalYear: any, itemId: any, employeeId: any,
    costCenterId: any, report: any, reportType: any

  ) {

    console.log(
      'no. : ',
      no,
      'employee', employeeId, 'costcenter:', costCenterId,
      'date: ',
      StartDate,
      'fiscalYear: ',
      fiscalYear,
      'reportName:', report, 'reportType:', reportType

    );

    `${this.url}/STREmployeeOpeningCustody/get/Report?`;
    this.mycondition = `${this.url}/STREmployeeOpeningCustody/get/Report?reportName=${report}&reportType=${reportType}`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!costCenterId == false) {
      this.mycondition = ` ${this.mycondition}&CostCenterId=${costCenterId}`;
    }

    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&EmployeeId=${employeeId}`;
    }

    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }
    if (!report == false) {
      this.mycondition = ` ${this.mycondition}&reportName=${report}`;
    }
    if (!reportType == false) {
      this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${itemId}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  getStrEmployeeExchangeItem(
    no: any, distEmployee: any, StartDate: any, EndDate: any, Fiscalyear: any, item: any,
    employeeId: any, costCenterId: any, report: any, reportType: any

  ) {
    `${this.url}/STRItem/get/Report?`;
    this.mycondition = `${this.url}/STREmployeeExchange/get/Report?reportName=${report}&reportType=${reportType}`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!costCenterId == false) {
      this.mycondition = ` ${this.mycondition}&CostCenterId=${costCenterId}`;
    }

    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&EmployeeId=${employeeId}`;
    }

    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }
    if (!Fiscalyear == false) {
      this.mycondition = ` ${this.mycondition}&FiscalYearId=${Fiscalyear}`;
    }
    if (!item == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${item}`;
    }
    if (!report == false) {
      this.mycondition = ` ${this.mycondition}&reportName=${report}`;
    }
    if (!reportType == false) {
      this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
    }
    if (!distEmployee == false) {
      this.mycondition = ` ${this.mycondition}&DestEmployeeId=${distEmployee}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }


  getStrStockTakingItem(
    id: any,
    no: any,
    startDate: any,
    endDate: any,
    storeId: any,
    fiscalYear: any,
    itemId: any,
    report: any, reportType: any

  ) {

    `${this.url}/STRItem/get/Report?`;
    this.mycondition = `${this.url}/StrStockTaking/get/Report?reportName=${report}&reportType=${reportType}`;

    if (!id == false) {
      this.mycondition = ` ${this.mycondition}&Id=${id}`;
    }
    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!startDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${startDate}`;
    }
    if (!endDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${endDate}`;
    }
    if (!storeId == false) {
      this.mycondition = ` ${this.mycondition}&StoreId=${storeId}`;
    }

    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&fiscalyearId=${fiscalYear}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${itemId}`;
    }
    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  getStrStockTakingDetailsReport(
    id: any,
    startDate: any,
    endDate: any,
    report: any,
    reportType: any
  ) {

    `${this.url}/STRItem/get/Report?`;
    this.mycondition = `${this.url}/StrStockTaking/get/Report?reportName=${report}&reportType=${reportType}`;

    if (!id == false) {
      this.mycondition = ` ${this.mycondition}&Id=${id}`;
    }
    if (!startDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${startDate}`;
    }
    if (!endDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${endDate}`;
    }
    console.log('url', this.mycondition);

    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }


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
    // if (!report == false) {
    //   this.mycondition = ` ${this.mycondition}&reportName=${report}`;
    // }

    // if (!reportType == false) {
    //   this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
    // }


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

  /**crud group */

  postStores(data: any, id: number) {
    return this.http.post<any>(
      `${this.url}/STRStore/Add` + id,
      data
    );
  }

  getstores() {
    return this.http.get<any>(`${this.url}/STRStore/get/all`);
  }

  getStoreById(id: any) {
    let urlPassed = `${this.url}/STRStore/get/${id}`;
    return urlPassed;
  }

  putstores(data: any, id: number) {
    return this.http.put<any>(
      `${this.url}/STRStore/update` + id,
      data
    );
  }

  deletestores(id: number) {
    console.log('id in delete store:', id);
    return this.http.delete<any>(
      `${this.url}/STRStore/delete/` + id
    );
  }


  getAllstores(): Observable<any> {
    return this.http.get<any>(`${this.url}/STRStore/get/all`);
  }

  postCostCenter(data: any) {
    return this.http.post<any>(`${this.url}/FICostCenter/Add`, data);
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/FiCostCenterCategory/get/all`
    );
  }

  getCostCenter() {
    return this.http.get<any>(`${this.url}/CcCostCenter/get/all`);
  }
  getFiCostCenterPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/FICostCenter/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }

  getAllCostCenter() {
    return this.http.get<any>(`${this.url}/CcCostCenter/get/all`);
  }

  getAllCostCenterById(id: any) {
    let urlPassed = `${this.url}/CcCostCenter/get/${id}`;
    return urlPassed;
  }

  getCostCenterById(id: any) {
    let urlPassed = `${this.url}/FICostCenter/get/${id}`;
    return urlPassed;
  }
  putCostCenter(data: any) {
    return this.http.put<any>(`${this.url}/FICostCenter/update`, data);
  }

  deleteCostCenter(id: number) {
    return this.http.delete<any>(`${this.url}/FICostCenter/delete/` + id);
  }

  getCostCenterAutoCode() {
    return this.http.get<any>(
      `${this.url}/FICostCenter/Get/Last/Code`
    );
  }

  // crud items

  postItem(data: any) {
    console.log('post data:', data);
    return this.http.post<any>(
      `${this.url}/STR_Item/Add-item`,
      data
    );
  }

  getcommodity() {
    return this.http.get<any>(
      `${this.url}/STRCommodity/get/all`
    );
  }
  postStrOpenItems(data: any) {
    return this.http.post<any>(
      `${this.url}/STR_Item/Add-item`,
      data
    );
  }

  putItems(data: any) {
    console.log('put data:', data);
    return this.http.put<any>(
      `${this.url}/STR_Item/update-Item`,
      data
    );
  }

  deleteItem(id: number) {
    return this.http.delete<any>(
      `${this.url}/STR_Item/delete-Item-by-id/` + id
    );
  }

  getAllcommodity(): any {
    return this.http.get<any>(
      `${this.url}/STRCommodity/get/all`
    );
  }
  getAllplatoon(): any {
    return this.http.get<any>(
      `${this.url}/STR_Platoon/get-all-Platoons`
    );
  }
  getAllgroup(): any {
    return this.http.get<any>(`${this.url}/STRGroup/get/all `);
  }

  getAllgrade(): any {
    return this.http.get<any>(`${this.url}/STRGrade/get/all`);
  }
  getAllunit(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/STR_Unit/get-all-Unit`
    );
  }

  // CRUD STORE

  postStore(data: any) {
    return this.http.post<any>(`${this.url}/STRStore/Add`, data);
  }

  putStore(data: any) {
    return this.http.put<any>(`${this.url}/STRStore/update`, data);
  }

  deleteStore(id: number) {
    return this.http.delete<any>(`${this.url}/STRStore/delete/` + id);
  }

  getEmployees(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/HREmployee/get/all`
    );
  }

  getStoreAutoCode() {
    return this.http.get<any>(
      `${this.url}/STRStore/AutoCode`
    );
  }
  //  commodity
  postCommodity(data: any) {
    console.log('add product data: ', data);

    return this.http.post<any>(
      `${this.url}/STRCommodity/Add `,
      data
    );
  }

  getCommodity() {
    return this.http.get<any>(
      `${this.url}/STRCommodity/get/all`
    );
  }

  putCommodity(data: any) {
    console.log('edit data by id: ', data);

    return this.http.put<any>(
      `${this.url}/STRCommodity/update`,
      data
    );
  }

  deleteCommodity(id: number) {
    console.log('delete by id: ', id);
    return this.http.delete<any>(
      `${this.url}/STRCommodity/delete/` + id
    );
  }

  ///////////////////////////////// STR-Group /////////////////////////////
  getStrGroupAutoCode(lastPlatoonId: any) {
    console.log('send req to get autoCode , lastPlatoonId is: ', lastPlatoonId);
    return this.http.get<any>(
      `${this.url}/STRGroup/AutoCode?PlatoonId=${lastPlatoonId}`
    );
  }

  getCommodityAutoCode() {
    return this.http.get<any>(
      `${this.url}/STRCommodity/AutoCode`
    );
  }

  // getCostCenterAutoCode(){
  //   return this.http.get<any>(`${this.url}/STRCostCenter/AutoCode`);

  // }

  postGroup(data: any) {
    console.log('form add data to apiii: ', data);
    return this.http.post<any>(`${this.url}/STRGroup/Add`, data);
  }
  getGroup() {
    return this.http.get<any>(`${this.url}/STRGroup/get/all`);
  }
  putGroup(data: any) {
    return this.http.put<any>(`${this.url}/STRGroup/update`, data);
  }
  deleteGroup(id: number) {
    console.log('form delete data from apiii, id: ', id);
    return this.http.delete<any>(`${this.url}/STRGroup/delete/` + id);
  }

  getPlatoons() {
    return this.http.get<any>(`${this.url}/STRPlatoon/get/all`);
  }

  ///////////////////////////////// STR-OpeningStock & details/////////////////////////////
  getStrOpenAutoNo(storeId: any, fiscalYearId: any) {
    return this.http.get<any>(
      `${this.url}/STROpeningStock/get/Get/Last/No?StoreId=${storeId}&FiscalYearId=${fiscalYearId}`
    );
  }

  getStrWithdrawAutoNo(storeId: any, fiscalyearId: any) {
    console.log("REQUEST to get AUTONO storeId: ", storeId, "fiscalYearId: ", fiscalyearId);
    return this.http.get<any>(
      `${this.url}/STRWithdraw/get/AutoNo?StoreId=${storeId}&FiscalYearId=${fiscalyearId}`
    );
  }

  postStrOpen(data: any) {
    return this.http.post<any>(`${this.url}/STROpeningStock/Add`, data);
  }
  getStrOpen() {
    return this.http.get<any>(`${this.url}/STROpeningStock/get/all`);
  }
  getStrOpeningStockPaginate(currentPage: any, pageSize: any) {
    console.log("page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/STROpeningStock/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putStrOpen(data: any) {
    return this.http.put<any>(`${this.url}/STROpeningStock/update`, data);
  }
  deleteStrOpen(id: number) {
    return this.http.delete<any>(`${this.url}/STROpeningStock/delete/` + id);
  }

  postStrOpenDetails(data: any) {
    return this.http.post<any>(`${this.url}/STROpeningStockDetails/Add`, data);
  }
  getStrOpenDetailsPaginateByMasterId(masterId: any, currentPage: any, pageSize: any) {
    console.log("masterId: ", masterId, "page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/STROpeningStockDetails/get/by/pagination?id=${masterId}&page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  getStrOpenAllDetails() {
    return this.http.get<any>(`${this.url}/STROpeningStockDetails/get/all`);
  }
  getStrOpenDetailsByMasterId(id: any) {
    return this.http.get<any>(
      `${this.url}/STROpeningStockDetails/Get/by/header/${id}`
    );
  }
  putStrOpenDetails(data: any, id: number) {
    console.log('strOpenDetails id: ', id, 'strOpenDetails data: ', data);
    return this.http.put<any>(
      `${this.url}/STROpeningStockDetails/update/` + id,
      data
    );
  }
  deleteStrOpenDetails(HeaderId: number) {
    // console.log("deleted row id: ", HeaderId)
    return this.http.delete<any>(
      `${this.url}/STROpeningStockDetails/delete/` + HeaderId
    );
  }

  getStore() {
    return this.http.get<any>(`${this.url}/STRStore/get/all`);
  }
  getStoresForAllUsers() {
    return this.http.get<any>(
      `${this.url}/StrUserStore/get/all`
    );
  }
  getUserStores(userId: any) {
    return this.http.get<any>(
      `${this.url}/StrUserStore/get/User/Store/${userId}`
    );
  }

  getItems() {
    return this.http.get<any>(`${this.url}/STRItem/get/all`);
  }

  getItemsPositive(storeId: any, fiscalyearId: any) {
    console.log("storeId: ", storeId, "fiscalYear: ", fiscalyearId);
    return this.http.get<any>(`${this.url}/STRItem/Get/Items/WithPositive/TotalQty?storeId=${storeId}&fiscalyearId=${fiscalyearId}`);
  }

  getItemById(id: any) {
    let urlPassed = `${this.url}/STRItem/get/${id}`;
    return urlPassed;
  }

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

  getAvgPrice(storeid: any, FiscalYearid: any, Date: any, itemid: any) {
    console.log(
      'Avg price inputs to backend',
      'storeid: ',
      storeid,
      ' fiscalyaer: ',
      FiscalYearid,
      'date: ',
      Date,
      'itemId: ',
      itemid
    );
    return this.http.get<any>(
      `${this.url}/STRAddDetails/get/Avg/Price/${storeid}/${FiscalYearid}/${Date}/${itemid}`
    );
  }
  getSearchStrStockTaking(
    no: any,
    storeId: any,
    fiscalYear: any,
    itemId: any) {
    console.log(
      'no. : ',
      no,
      'store : ',
      storeId,

      'fiscalYear: ',
      fiscalYear,
      'item:',
      itemId

    );

    this.mycondition = `${this.url}/StrStockTaking/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!storeId == false) {
      this.mycondition = ` ${this.mycondition}&StoreId=${storeId}`;
    }

    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&fiscalyearId=${fiscalYear}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${itemId}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
  }



  getStrOpenSearach(
    no: any,
    storeId: any,

    fiscalYear: any,
    itemId: any, StartDate: any, EndDate: any
  ) {
    console.log(
      'no. : ',
      no,
      'store : ',
      storeId,
      'StartDate: ',
      StartDate,
      'fiscalYear: ',
      fiscalYear,
      'item:',
      itemId, 'EndDate: ',
      EndDate

    );

    this.mycondition = `${this.url}/STROpeningStock/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!storeId == false) {
      this.mycondition = ` ${this.mycondition}&StoreId=${storeId}`;
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
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${itemId}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);

  }

  ///////////////////////////////// STR-EmployeeExchange & details/////////////////////////////
  getStrEmployeeExchangeAutoNo() {
    return this.http.get<any>(`${this.url}/STREmployeeExchange/get/AutoNo`);
  }

  getHrEmployees() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
  }

  getHrEmployeeById(id: any) {
    let urlPassed = `${this.url}/HREmployee/get/${id}`;
    return urlPassed;
  }

  getFiCostCenter() {
    return this.http.get<any>(`${this.url}/FICostCenter/get/all`);
  }

  postStrEmployeeExchange(data: any) {
    return this.http.post<any>(`${this.url}/STREmployeeExchange/Add`, data);
  }
  getStrEmployeeExchange() {
    return this.http.get<any>(`${this.url}/STREmployeeExchange/get/all`);
  }
  putStrEmployeeExchange(data: any) {
    return this.http.put<any>(`${this.url}/STREmployeeExchange/update`, data);
  }
  deleteStrEmployeeExchange(id: number) {
    return this.http.delete<any>(`${this.url}/STREmployeeExchange/delete/` + id);
  }

  postStrEmployeeExchangeDetails(data: any) {
    return this.http.post<any>(
      `${this.url}/STREmployeeExchangeDetails/Add`,
      data
    );
  }
  getStrEmployeeExchangeDetails() {
    return this.http.get<any>(`${this.url}/STREmployeeExchangeDetails/get/all`);
  }
  getStrEmployeeExchangeDetailsByMasterId(id: any) {
    return this.http.get<any>(
      `${this.url}/STREmployeeExchangeDetails/get/by/header/${id}`
    );
  }
  putStrEmployeeExchangeDetails(data: any) {
    console.log('StrEmployeeExchangeDetails data: ', data);
    return this.http.put<any>(
      `${this.url}/STREmployeeExchangeDetails/update/`,
      data
    );
  }
  deleteStrEmployeeExchangeDetails(HeaderId: number) {
    console.log('deleted row id: ', HeaderId);
    return this.http.delete<any>(
      `${this.url}/STREmployeeExchangeDetails/delete/` +
      HeaderId
    );
  }

  getStrEmployeeExchangeSearach(
    no: any,
    costCenterId: any,
    employeeId: any, item: any,

    distEmployee: any, StartDate: any, EndDate: any, Fiscalyaer: any
  ) {
    console.log(
      "values search passed: 'no: '",
      no,
      "' costCenterId: '",
      costCenterId,
      "' employeeId: '",
      employeeId,
      "' StartDate: '",
      StartDate,
      "' distEmployee: '",
      distEmployee,
      "' EndDate: '",
      EndDate, 'fiscalyear:', Fiscalyaer
    );
    this.mycondition;
    this.mycondition = `${this.url}/STREmployeeExchange/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!item == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${item}`;
    }


    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }
    if (!Fiscalyaer == false) {
      this.mycondition = ` ${this.mycondition}&FiscalYearId=${Fiscalyaer}`;
    }

    if (!distEmployee == false) {
      this.mycondition = ` ${this.mycondition}&DestEmployeeId=${distEmployee}`;
    }
    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&EmployeeId=${employeeId}`;
    }
    if (!costCenterId == false) {
      this.mycondition = ` ${this.mycondition}&costCenterId=${costCenterId}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);

  }

  // open Empoyee
  postStrEmployeeOpen(data: any) {
    return this.http.post<any>(
      `${this.url}/STREmployeeOpeningCustody/Add`,
      data
    );
  }
  getStrEmployeeOpen() {
    return this.http.get<any>(
      `${this.url}/STREmployeeOpeningCustody/get/all`
    );
  }
  putStrEmployeeOpen(data: any) {
    return this.http.put<any>(
      `${this.url}/STREmployeeOpeningCustody/update`,
      data
    );
  }
  deleteStrEmployeeOpen(id: number) {
    return this.http.delete<any>(
      `${this.url}/STREmployeeOpeningCustody/delete/` + id
    );
  }
  getAllEmployees() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
  }

  postStrEmployeeOpenDetails(data: any) {
    return this.http.post<any>(
      `${this.url}/STREmployeeOpeningCustodyDetails/Add`,
      data
    );
  }

  getStrEmployeeOpenDetails() {
    return this.http.get<any>(`${this.url}/STREmployeeOpeningCustodyDetails/get/all`);
  }


  // getStrOpenDetails() {
  //   return this.http.get<any>("https://ims.aswan.gov.eg/api/STR_Opening_Stock/get-all-Opening_Stock_Details");
  // }
  putStrEmployeeOpenDetails(data: any) {
    console.log('putStrEmployeeOpenDetails data: ', data);
    return this.http.put<any>(
      `${this.url}/STREmployeeOpeningCustodyDetails/update/`,
      data
    );
  }

  deleteStrEmployeeOpenDetails(HeaderId: number) {
    console.log('deleted row id: ', HeaderId);
    return this.http.delete<any>(
      `${this.url}/STREmployeeOpeningCustodyDetails/delete/` +
      HeaderId
    );
  }
  putStrEmployeeOpenDetail(data: any, id: number) {
    console.log('strOpenDetails id: ', id, 'strOpenDetails data: ', data);
    return this.http.put<any>(
      `${this.url}/STREmployeeOpeningCustodyDetails/update/` + id,
      data
    );
  }
  getStrEmployeeOpenDetailsByMasterId(id: any) {
    console.log("custodyId: ", id);
    return this.http.get<any>(
      `${this.url}/STREmployeeOpeningCustodyDetails/get/by/header/${id}`
    );
  }
  putStEmp(data: any) {
    return this.http.put<any>(
      `${this.url}/STREmployeeOpeningCustody/update`,
      data
    );
  }
  // getStrOpenDetailsByMasterId(id: any) {
  //   return this.http.get<any>(`${this.url}/STROpeningStock/GetopenstockDetailsByopenStockId/${id}`);
  // }
  /////////////withdraw///////////

  postStrWithdraw(data: any) {
    console.log('post data:', data);
    return this.http.post<any>(
      `${this.url}/STRWithdraw/Add`,
      data
    );
  }

  getStrWithdraw() {
    return this.http.get<any>(
      `${this.url}/STRWithdraw/get/all`
    );
  }
  getStrWithdrawUserStorePaginateByMasterId(userId: any, currentPage: any, pageSize: any) {
    let urlPassed = `${this.url}/STRWithdraw/get/By/User/Stores/${userId}?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putStrWithdraw(data: any) {
    console.log('put data ', data);

    return this.http.put<any>(
      `${this.url}/STRWithdraw/update`,
      data
    );
  }
  deleteStrWithdraw(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRWithdraw/delete/` + id
    );
  }

  postStrWithdrawDetails(data: any) {
    console.log('post details', data);
    return this.http.post<any>(
      `${this.url}/STRWithdrawDetails/Add`,
      data
    );
  }
  getStrWithdrawDetails() {
    return this.http.get<any>(
      `${this.url}/api/STRWithdraw/get/{id}`
    );
  }
  getStrWithdrawDetailsPaginateByMasterId(currentPage: any, pageSize: any, HeaderId: any) {
    let urlPassed = `${this.url}/STRWithdrawDetails/get/by/pagination?page=${currentPage}&pageSize=${pageSize}&HeaderId=${HeaderId}`;
    return urlPassed;
  }
  getStrWithdrawDetailsByMasterId(id: any) {
    return this.http.get<any>(
      `${this.url}/STRWithdrawDetails/get/by/header/${id}`
    );
  }
  putStrWithdrawDetails(data: any) {
    console.log('put details', data);

    return this.http.put<any>(
      `${this.url}/STRWithdrawDetails/update `,
      data
    );
  }
  deleteStrWithdrawDetails(HeaderId: number) {
    // console.log("deleted row id: ", HeaderId)
    return this.http.delete<any>(
      `${this.url}/STRWithdrawDetails/delete/` + HeaderId
    );
  }
  getStrWithdrawSearch(
    no: any,
    store: any,
    StartDate: any, EndDate: any,
    fiscalYear: any,
    itemId: any,
    employeeId: any,
    costCenterId: any
  ) {
    // mycondition :String;
    console.log(
      'no. : ',
      no,
      'store : ',
      store,
      'date: ',
      StartDate,
      'fiscalYear: ',
      fiscalYear,
      'item:',
      itemId,
      'employee: ',
      employeeId,
      'costCenter:',
      costCenterId
    );

    this.mycondition = `${this.url}/STRWithdraw/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!store == false) {
      this.mycondition = ` ${this.mycondition}&StoreId=${store}`;
    }
    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }
    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&fiscalyearId=${fiscalYear}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${itemId}`;
    }
    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&EmployeeId=${employeeId}`;
    }
    if (!costCenterId == false) {
      this.mycondition = ` ${this.mycondition}&costCenterId=${costCenterId}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
  }
  getEmployee() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);

  }
  getseller() {
    return this.http.get<any>(
      `${this.url}/PRSeller/get/all`
    );

  }

  getSellerById(id: any) {
    let urlPassed = `${this.url}/PRSeller/get/${id}`;
    return urlPassed;
  }


  ////////file upload/////////

  ////////file upload/////////
  upload(file: any): Observable<any> {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append('file', file);

    // Make http post request over api
    // with formData as req

    return this.http.post(`${this.url}/STRProduct/UploadFile`, formData);
    // alert(this.baseApiUrl)
  }

  ///////////////////////////////// STR-Product/////////////////////////////
  postStrProduct(data: any) {
    console.log('form add product data to backend: ', data);
    return this.http.post<any>(`${this.url}/STRProduct/Add`, data);
  }

  uploadStrProduct(data: any) {
    console.log('form add product data to backend: ', data);
    return this.http.post<any>(`${this.url}/STRProduct/upload`, data);
  }
  getStrProduct() {
    return this.http.get<any>(`${this.url}/STRProduct/get/all`);
  }
  putStrProduct(data: any) {
    return this.http.put<any>(`${this.url}/STRProduct/update`, data);
  }

  uploadedFile(data: any) {
    console.log('form add product data to backend: ', data);
    return this.http.post<any>(`${this.url}/STRProduct/UploadFile`, data);
  }

  deleteStrProduct(id: number) {
    console.log('delete product data from api, id: ', id);
    return this.http.delete<any>(`${this.url}/STRProduct/Delete/` + id);
  }

  getProductAutoCode() {
    return this.http.get<any>(
      `${this.url}/STRProduct/AutoCode`
    );
  }

  public uploadFile(payload: FormData) {
    return this.http.post('${this.url}/STRProduct/UploadFile', payload);
  }

  getVendors() {
    return this.http.get<any>(`${this.url}/STRVendor/get/all`);
  }

  getModels() {
    return this.http.get<any>(`${this.url}/STRModel/get/all`);
  }
  // ----Start Add----

  GetWithDrawByDestStore(storeId: any) {
    return this.http.get<any>(`${this.url}/STRWithdraw/get/By/Dest/Store/${storeId}`);
  }
  postAcceptOrRejectWithDrawByDestStore(data: any) {
    console.log("dataaa: ", data);

    return this.http.post<any>(`${this.url}/STRAdd/AddFromStore`, data);
  }

  getStrAddAutoNo(storeId: any, fiscalYearId: any) {
    return this.http.get<any>(
      `${this.url}/STRAdd/get/AutoNo?StoreId=${storeId}&FiscalYearId=${fiscalYearId}`
    );
  }
  postStrAdd(data: any) {
    console.log('dataaaaaa: ', data);
    return this.http.post<any>(`${this.url}/STRAdd/Add`, data);
  }
  getStrAdd() {
    return this.http.get<any>(`${this.url}/STRAdd/get/all`);
  }
  getStrAddPaginateByUserId(userId: any, currentPage: any, pageSize: any) {
    let urlPassed = `${this.url}/STRAdd/get/By/User/Stores/${userId}?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putStrAdd(data: any) {
    return this.http.put<any>(
      `${this.url}/STRAdd/update`,
      data
    );
  }
  deleteStrAdd(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRAdd/Delete/` + id
    );
  }
  getAllSellers() {
    return this.http.get<any>(`${this.url}/PRSeller/get/all`);
  }
  getAllEmployee() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
  }
  getAllStore() {
    return this.http.get<any>(`${this.url}/STRStore/get/all`);
  }

  GetAddGeTAddDetailsByAddId(id: number) {
    return this.http.get<any>(
      `${this.url}/STRAdd/GetAddGeTAddDetailsByAddId/` + id
    );
  }

  postStrAddDetails(data: any) {
    return this.http.post<any>(
      `${this.url}/STRAddDetails/Add`,
      data
    );
  }
  getStrAddDetails() {
    return this.http.get<any>(`${this.url}/STRAddDetails/get/all`);
  }
  getStrAddDetailsByAddId(id: any) {
    return this.http.get<any>(`${this.url}/STRAddDetails/get/by/header/${id}`);
  }
  putStrAddDetails(data: any) {
    console.log('strOpenDetails data: ', data);
    return this.http.put<any>(
      `${this.url}/STRAddDetails/Update/`,
      data
    );
  }
  deleteStrAddDetails(HeaderId: number) {
    // console.log("deleted row id: ", HeaderId)
    return this.http.delete<any>(
      `${this.url}/STRAddDetails/Delete/` + HeaderId
    );
  }
  getNewAvgPrice(
    storeid: any,
    FiscalYearid: any,
    Date: any,
    itemid: any,
    price: any,
    qty: any
  ) {
    console.log('Avg price inputs to backend');
    return this.http.get<any>(
      `${this.url}/STRAddDetails/get/new/Avg/Price/${storeid}/${FiscalYearid}/${Date}/${itemid}/${price}/${qty}`
    );
  }
  getSumQuantity(storeid: any, itemid: any) {
    console.log('Avg price inputs to backend');
    return this.http.get<any>(
      `${this.url}/STRAddDetails/get/sum/quantity/${storeid}/${itemid}`
    );
  }
  getAllItems() {
    console.log('Avg price inputs to backend');
    return this.http.get<any>(`${this.url}/STRItem/get/all/`);
  }
  getUpload(formData: any): Observable<any> {
    console.log('Avg price inputs to backend');
    return this.http.get<any>(`${this.url}/STRProduct/UploadFile`);
  }
  getType() {
    return this.http.get<any>(`${this.url}/STRAddType/get/all`);

  }

  getStrApprovalStatus() {
    return this.http.get<any>(`${this.url}/StrApprovalStatus/get/all`);
  }

  getTypeById(id: any) {
    let urlPassed = `${this.url}/STRAddType/get/${id}`;
    return urlPassed;
  }
  getSeller() {
    return this.http.get<any>(`${this.url}/PRSeller/get/all`);

  }
  getReciept() {
    return this.http.get<any>(
      `${this.url}/STRAddReceipt/get/all`
    );

  }

  getRecieptById(id: any) {
    let urlPassed = `${this.url}/STRAddReceipt/get/${id}`;
    return urlPassed;
  }

  getStrStockTaking() {
    console.log('Avg price inputs to backend');
    return this.http.get<any>(`${this.url}/StrStockTaking/get/all`);
  }


  getStrStockTakingDetailsByMasterId(id: any) {
    return this.http.get<any>(
      `${this.url}/StrStockTakingDetails/get/by/header/${id}`)

  }

  getStrStockTakingDetailsPaginateByMasterId(masterId: any, currentPage: any, pageSize: any) {
    console.log("masterId: ", masterId, "page: ", currentPage, "pageSize: ", pageSize);
    let urlPassed = `${this.url}/StrStockTakingDetails/get/by/pagination?StockTakingid=${masterId}&page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }

  // getStrAddDetailsByMasterId(id:any){
  //   return this.http.get<any>(
  //     `${this.url}/STRAdd/GeTAddDetailsByid/${id}`)
  // }

  postStrStockTaking(data: any) {
    console.log("data in posttt:", data)
    return this.http.post<any>(`${this.url}/StrStockTaking/Add`, data)
  }
  putStrStockTaking(data: any) {
    return this.http.put<any>(`${this.url}/StrStockTaking/update`, data)
  }

  postStrStockTakingDetails(data: any) {
    console.log("data in post details:", data)
    return this.http.post<any>(`${this.url}/StrStockTakingDetails/Add`, data)
  }

  putStrStockTakingDetails(data: any, id: any) {
    return this.http.put<any>(`${this.url}/StrStockTakingDetails/update/${id}`, data)
  }

  deleteStockTakingDetails(id: any) {
    return this.http.delete<any>(`${this.url}/StrStockTakingDetails/delete/` + id);
  }

  deleteStrStockTking(id: any) {
    return this.http.delete<any>(`${this.url}/StrStockTaking/delete/` + id);
  }

  getStrStockTakingSearach(
    no: any,
    storeId: any,

    fiscalYear: any,
    itemId: any, StartDate: any, EndDate: any
  ) {
    console.log(
      'no. : ',
      no,
      'store : ',
      storeId,
      'StartDate: ',
      StartDate,
      'fiscalYear: ',
      fiscalYear,
      'item:',
      itemId, 'EndDate: ',
      EndDate

    );

    this.mycondition = `${this.url}/StrStockTaking/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!storeId == false) {
      this.mycondition = ` ${this.mycondition}&StoreId=${storeId}`;
    }
    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }
    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&fiscalyearId=${fiscalYear}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${itemId}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);

  }


  getStrOpeningStockReport(
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
    `${this.url}/StrStockTaking/get/Report?`;
    this.mycondition = `${this.url}/StrStockTaking/get/Report?reportName=${report}&reportType=${reportType}`;

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




  getStrAddSearach(no: any, EntryNo: any, fiscalYear: any, employeeId: any, itemId: any, store: any, StartDate: any, EndDate: any) {
    //enter no.

    console.log(
      'no. : ',
      no,
      'EntryNo: ',
      EntryNo,
      'store : ',
      store,
      'startdate: ',
      StartDate,
      'fiscalYear: ',
      fiscalYear,
      'item:',
      itemId,
      'employee: ',
      employeeId,
      'enddate: ',
      EndDate,


    );
    this.mycondition = `${this.url}/STRAdd/search?`;


    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!EntryNo == false) {
      this.mycondition = ` ${this.mycondition}&EntryNo=${EntryNo}`;
    }
    if (!store == false) {
      this.mycondition = ` ${this.mycondition}&StoreId=${store}`;
    }
    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }
    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&fiscalyearId=${fiscalYear}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&itemId=${itemId}`;
    }
    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&EmployeeId=${employeeId}`;
    }


    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);

  }

  // vendor
  postVendor(data: any) {
    return this.http.post<any>(
      `${this.url}/STRVendor/Add`,
      data
    );
  }
  // here
  getVendor() {
    return this.http.get<any>(`${this.url}/STRVendor/get/all`);
  }
  putVendor(data: any) {
    console.log('data');
    return this.http.put<any>(
      `${this.url}/STRVendor/update`,
      data
    );
  }
  daleteVendor(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRVendor/delete/${id}`
    );
  }



  getAllVendor() {
    return this.http.get<any>(`${this.url}/STRVendor/get/all`);
  }
  // MODEL
  postModel(data: any) {
    return this.http.post<any>(
      `${this.url}/STRModel/Add`,
      data
    );
  }
  // here
  getModel() {
    return this.http.get<any>(`${this.url}/STRModel/get/all`);
  }
  putModel(data: any) {
    console.log('data');
    return this.http.put<any>(
      `${this.url}/STRModel/update`,
      data
    );
  }
  deleteModel(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRModel/delete/${id}`
    );
  }
  getModelId(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRModel/get/${id}`
    );
  }
  getStrEmployeeOpenSearach(
    no: any,
    costCenterId: any,
    employeeId: any, itemId: any,
    StartDate: any, EndDate: any,
    FiscalYear: any



  ) {
    console.log(
      "values search passed: 'no: '",
      no,
      "' costCenterId: '",
      costCenterId,
      "' employeeId: '",
      employeeId,
      "' startdate: '",
      StartDate,
      "' item: '",
      itemId, "fiscalyear", FiscalYear
    );
    this.mycondition = `${this.url}/STREmployeeOpeningCustody/search?`;
    this.mycondition = `${this.url}/STREmployeeOpeningCustody/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }

    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
    }

    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&ItemId=${itemId}`;
    }
    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&EmployeeId=${employeeId}`;
    }
    if (!costCenterId == false) {
      this.mycondition = ` ${this.mycondition}&costCenterId=${costCenterId}`;
    }

    if (!FiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&FiscalYearId=${FiscalYear}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
    return this.http.get<any>(`${this.url}/STREmployeeOpeningCustody/search??No=${0}`);
  }
  getStrEmployeeOpenAutoNo() {
    return this.http.get<any>(
      `${this.url}/STREmployeeOpeningCustody/get/AutoNo`
    );
  }

  getAllCostCenters() {
    return this.http.get<any>(
      `${this.url}/FICostCenter/get/all`
    );
  }


  postProductserail(data: any) {
    return this.http.post<any>(
      `${this.url}/STRProductSerial/Add`,
      data
    );
  }
  getProductserail() {
    return this.http.get<any>(`${this.url}/STRProductSerial/get/all`);
  }
  putProductserail(data: any) {
    console.log("")
    return this.http.put<any>(
      `${this.url}/STRProductSerial/update`,
      data
    );
  }
  deleteProductserail(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRProductSerial/Delete/${id}`
    );
  }
  getAllProductes(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/STRProduct/get/all`
    );
  }

  // userstore

  getAllUseres(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/PRUser/get/all`
    );
  }
  getAllStores(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/STRStore/get/all`
    );
  }
  getuserstoreCode(GradeId: any) {
    console.log('gradeId:', GradeId);

    return this.http.get<any>(
      `${this.url}/STRPlatoon/AutoCode?GradeId=${GradeId}`
    );
  }
  // dddd

  //  userstore
  postUserstore(data: any) {
    return this.http.post<any>(
      `${this.url}/StrUserStore/Add`,
      data
    );
  }
  getUserstore() {
    return this.http.get<any>(`${this.url}/StrUserStore/get/all`);
  }
  putUserstore(data: any) {
    console.log("")
    return this.http.put<any>(
      `${this.url}/StrUserStore/update`,
      data
    );
  }
  deleteUserstore(id: number) {
    return this.http.delete<any>(
      `${this.url}/StrUserStore/delete/${id}`
    );
  }




  ////////////////////reports//////////////
  // getreports(

  //   store: any,StartDate: any, EndDate: any, report: any, reportType: any
  // ) {
  //   console.log(

  //     'store : ',
  //     store,
  //     'startdate: ',
  //     StartDate,

  //     'reportName:', report, 'reportType:', reportType

  //   );
  //   `${this.url}/STRItem/Get/Sum/Of/Qty/Between/Two/Date?`;
  //   this.mycondition = `${this.url}/STRItem/Get/Sum/Of/Qty/Between/Two/Date?reportName=${report}&reportType=${reportType}`;


  //   if (!store == false) {
  //     this.mycondition = ` ${this.mycondition}&storeid=${store}`;
  //   }
  //   if (!report == false) {
  //     this.mycondition = ` ${this.mycondition}&reportName=${report}`;
  //   }

  //   if (!reportType == false) {
  //     this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
  //   }


  //   if (!StartDate == false) {
  //     this.mycondition = ` ${this.mycondition}&StartDate=${StartDate}`;
  //   }
  //   if (!EndDate == false) {
  //     this.mycondition = ` ${this.mycondition}&EndDate=${EndDate}`;
  //   }


  //   // if (!item == false) {
  //   //   this.mycondition = ` ${this.mycondition}&itemId=${item}`;
  //   // }



  //   console.log('url', this.mycondition);

  //   // return this.http.get<any>(`${this.mycondition}`);
  //   return this.http.get(`${this.mycondition}`, {
  //     observe: 'response',
  //     responseType: 'blob',
  //   });
  // }

  getTranscriptreports(

    store: any, StartDate: any, EndDate: any, item: any, report: any, reportType: any
  ) {
    console.log(

      'store : ',
      store,
      'startdate: ',
      StartDate, 'item', item,

      'reportName:', report, 'reportType:', reportType

    );
    `${this.url}/STRItem/get/Report?`;
    this.mycondition = `${this.url}/STRItem/get/Report?reportName=${report}&reportType=${reportType}`;


    if (!store == false) {
      this.mycondition = ` ${this.mycondition}&soreId=${store}`;
    }
    // if (!report == false) {
    //   this.mycondition = ` ${this.mycondition}&reportName=${report}`;
    // }

    // if (!reportType == false) {
    //   this.mycondition = ` ${this.mycondition}&reportType=${reportType}`;
    // }


    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&startdate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&enddate=${EndDate}`;
    }


    if (!item == false) {
      this.mycondition = ` ${this.mycondition}&itemId=${item}`;
    }



    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }



}