import { FiscalYear } from './../hr/hr-incentive-allowance-dialog/hr-incentive-allowance-dialog.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  /******************************** crud Group **********************************/
  url = 'http://ims.aswan.gov.eg/api';
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
    return this.http.post<any>('http://ims.aswan.gov.eg/api/STRUnit/Add', data);
  }
  // here
  getunit() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRUnit/get/all');
  }
  putunit(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRUnit/update',
      data
    );
  }
  deleteunit(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/STRUnit/delete/${id}`
    );
  }

  // start crud grade
  //selvana
  postGrade(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRGrade/Add',
      data
    );
  }
  getGrade() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRGrade/get/all');
  }
  putGrade(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRGrade/update',
      data
    );
  }
  deleteGrade(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/STRGrade/delete/${id}`
    );
  }
  getAllCommodity(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/get/all'
    );
  }

  getGradeCode(data: any) {
    return this.http.get<any>(
      `http://ims.aswan.gov.eg/api/STRGrade/AutoCode?commidtyId=${data}`
    );
  }

  getStrOpenDetails() {
    return this.http.get<any>('http://localhost:3000/StrOpenDetails/');
  }

  getStoreList() {
    return this.http.get<any>('http://localhost:3000/StoreList/');
  }
  getStoreByID(id: number) {
    return this.http.get<any>('http://localhost:3000/StoreList/' + id);
  }

  // FIAccountHierarchy
  getFIAccountHierarchy() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/FIAccountHierarchy/get/all'
    );
  }
  putFIAccountHierarchy(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/FIAccountHierarchy/update',
      data
    );
  }
  deleteFIAccountHierarchy(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/FIAccountHierarchy/delete/${id}`
    );
  }
  postFIAccountHierarchy(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/FIAccountHierarchy/Add',
      data
    );
  }
  // FiAccountItem
  getFiAccountItem() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/FiAccountItem/get/all'
    );
  }
  putFiAccountItem(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/FiAccountItem/update',
      data
    );
  }
  deleteFiAccountItem(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/FiAccountItem/delete/${id}`
    );
  }
  postFiAccountItem(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/FiAccountItem/Add',
      data
    );
  }
  getAllAccounts(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/FIAccount/get/all');
  }
  // FIJournal
  getFIJournal() {
    return this.http.get<any>(' http://ims.aswan.gov.eg/api/FIJournal/get/all');
  }
  putFIJournal(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/FIJournal/update',
      data
    );
  }
  deleteFIJournal(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/FIJournal/delete/${id}`
    );
  }
  postFIJournal(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/FIJournal/Add',
      data
    );
  }
  // HrCity
  getHrCity() {
    return this.http.get<any>(' http://ims.aswan.gov.eg/api/HrCity/get/all');
  }
  putHrCity(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrCity/update',
      data
    );
  }
  deleteHrCity(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrCity/delete/${id}`
    );
  }
  postHrCity(data: any) {
    return this.http.post<any>('http://ims.aswan.gov.eg/api/HrCity/Add', data);
  }
  // HrCityState
  getHrCityState() {
    return this.http.get<any>(
      ' http://ims.aswan.gov.eg/api/HrCityState/get/all'
    );
  }
  putHrCityState(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrCityState/update',
      data
    );
  }
  deleteHrCityState(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrCityState/delete/${id}`
    );
  }
  postHrCityState(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/HrCityState/Add',
      data
    );
  }
  getAllCitis(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/HrCity/get/all');
  }

  //Fatma

  //Platoon

  postPlatoon(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRPlatoon/Add',
      data
    );
  }
  getPlatoon() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRPlatoon/get/all');
  }
  putPlatoon(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRPlatoon/update',
      data
    );
  }
  deletePlatoon(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/STRPlatoon/delete/${id}`
    );
  }

  getPlatoonCode(GradeId: any) {
    console.log('gradeId:', GradeId);

    return this.http.get<any>(
      `http://ims.aswan.gov.eg/api/STRPlatoon/AutoCode?GradeId=${GradeId}`
    );
  }

  getAllCommodities(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/get/all'
    );
  }
  getAllGrades(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRGrade/get/all');
  }

  //Group

  postGroups(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRGroup/Add',
      data
    );
  }
  getGroups() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRGroup/get/all');
  }
  putGroups(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRGroup/update',
      data
    );
  }
  deleteGroups(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/STRGroup/delete/${id}`
    );
  }
  getAllCommoditiesg(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/get/all'
    );
  }
  getAllGradesg(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRGrade/get/all');
  }

  getAllPlatoonsg(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRPlatoon/get/all');
  }

  getGroupCode(data: any) {
    console.log('platoon id:', data);

    return this.http.get<any>(
      `http://ims.aswan.gov.eg/api/STRGroup/AutoCode?PlatoonId=${data}`
    );
  }

  //Item

  postItems(data: any) {
    return this.http.post<any>('http://ims.aswan.gov.eg/api/STRItem/Add', data);
  }
  getItemNo(data: any) {
    console.log('No:', data);
    return this.http.get<any>(
      `http://ims.aswan.gov.eg/api/STRItem/Get/lastNo?GroupId=${data}`
    );
  }
  getItem() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRItem/get/all');
  }
  putItem(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRItem/update',
      data
    );
  }
  deleteItems(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/STRItem/delete/${id}`
    );
  }
  getAllCommoditiesi(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/get/all'
    );
  }
  getAllGradesi(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRGrade/get/all');
  }

  getAllPlatoonsi(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRPlatoon/get/all');
  }

  getAllGroupsi(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRGroup/get/all');
  }

  getAllUnitsi(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRUnit/get/all');
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
    unit: any
  ) {
    'http://ims.aswan.gov.eg/api/STRItem/getReport?reportName=STRItemsReport&reportType=pdf';
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
    'http://ims.aswan.gov.eg/api/STRItem/getReport?reportName=STRItemsReport&reportType=pdf';
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

  strAdd(no: any, store: any, date: any) {
    ('http://ims.aswan.gov.eg/api/STRAdd/getReport?reportName=STRAddReport&reportType=pdf');
    this.mycondition = `${this.url}/STRAdd/getReport?reportName=STRAddReport&reportType=pdf`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&Name=${no}`;
    }
    if (!store == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${store}`;
    }

    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&CommodityId=${date}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  openingStock(no: any, store: any, date: any, fiscalYear: any, item: any) {
    'http://ims.aswan.gov.eg/api/STROpeningStock/getReport?reportName=OpeningStockReport&reportType=pdf';
    this.mycondition = `${this.url}/STROpeningStock/getReport?reportName=OpeningStockReport&reportType=pdf`;

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
    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  getStrEmployeeCustody(
    no: any,
    costCenterId: any,
    employeeId: any,
    date: any,
    itemId: any
  ) {
    'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustody/getReport?reportName=EmployeeOpeningReport&reportType=pdf';
    this.mycondition = `${this.url}/STREmployeeOpeningCustody/getReport?reportName=EmployeeOpeningReport&reportType=pdf`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&Name=${no}`;
    }
    if (!costCenterId == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${costCenterId}`;
    }

    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&Type=${employeeId}`;
    }

    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&CommodityId=${date}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&GradeId=${itemId}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  getStrEmployeeExchangeItem(
    no: any,
    costCenterId: any,
    employeeId: any,
    date: any,
    distEmployee: any
  ) {
    'http://ims.aswan.gov.eg/api/STRItem/getReport?reportName=STRItemsReport&reportType=pdf';
    this.mycondition = `${this.url}/STRItem/getReport?reportName=STRItemsReport&reportType=pdf`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&Name=${no}`;
    }
    if (!costCenterId == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${costCenterId}`;
    }

    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&Type=${employeeId}`;
    }

    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&CommodityId=${date}`;
    }
    if (!distEmployee == false) {
      this.mycondition = ` ${this.mycondition}&GradeId=${distEmployee}`;
    }

    console.log('url', this.mycondition);

    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  getStr(
    no: any,
    store: any,
    date: any,
    fiscalYear: any,
    item: any,
    employee: any,
    costCenter: any
  ) {
    'http://ims.aswan.gov.eg/api/STRWithdraw/getReport?reportName=STRWithdrawReport&reportType=pdf';
    this.mycondition = `${this.url}/STRWithdraw/getReport?reportName=STRWithdrawReport&reportType=pdf`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&Name=${no}`;
    }
    if (!store == false) {
      this.mycondition = ` ${this.mycondition}&FullCode=${store}`;
    }

    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&Type=${date}`;
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

  // Account

  postAccount(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/FIAccount/Add',
      data
    );
  }
  getAccount() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/FIAccount/get/all');
  }
  putAccount(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/FIAccount/update',
      data
    );
  }
  deleteAccount(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/FIAccount/delete/${id}`
    );
  }
  getAllAccountHierarchy(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/FIAccountHierarchy/get/all'
    );
  }

  //FiEntrySourceType
  postEntrySourceType(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/FiEntrySourceType/Add',
      data
    );
  }
  getEntrySourceType() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/FiEntrySourceType/get/all'
    );
  }
  putEntrySourceType(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/FiEntrySourceType/update',
      data
    );
  }
  deleteEntrySourceType(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/FiEntrySourceType/delete/${id}`
    );
  }
  getAllEntrySources(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/FiEntrySource/get/all'
    );
  }

  //FiEntrySource
  postEntrySource(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/FiEntrySource/Add',
      data
    );
  }
  getEntrySource() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/FiEntrySource/get/all'
    );
  }
  putEntrySource(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/FiEntrySource/update',
      data
    );
  }
  deleteEntrySource(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/FiEntrySource/delete/${id}`
    );
  }

  //AccountParent
  postAccountParent(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/FIAccountParent/Add',
      data
    );
  }
  getAccountParent() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/FIAccountParent/get/all'
    );
  }
  putAccountParent(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/FIAccountParent/update',
      data
    );
  }
  deleteAccountParent(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/FIAccountParent/delete/${id}`
    );
  }
  getAllAccountsParents(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/FIAccount/get/all');
  }

  //HrQualification

  postQualification(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/HrQualification/Add',
      data
    );
  }
  getQualification() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/HrQualification/get/all'
    );
  }
  putQualification(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrQualification/update',
      data
    );
  }
  deleteQualification(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrQualification/delete/${id}`
    );
  }
  getAllQualitativeGroups(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/HrQualitativeGroup/get/all'
    );
  }

  //HrSeveranceReason

  postSeveranceReason(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/HrSeveranceReason/Add',
      data
    );
  }
  getSeveranceReason() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/HrSeveranceReason/get/all'
    );
  }
  putSeveranceReason(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrSeveranceReason/update',
      data
    );
  }
  deleteSeveranceReason(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrSeveranceReason/delete/${id}`
    );
  }

  /**crud group */

  postStores(data: any, id: number) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRStore/Add' + id,
      data
    );
  }

  getstores() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRStore/get/all');
  }

  putstores(data: any, id: number) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRStore/update ' + id,
      data
    );
  }

  deletestores(id: number) {
    console.log('id in delete store:', id);
    return this.http.delete<any>(
      'http://ims.aswan.gov.eg/api/STRStore/delete/' + id
    );
  }
  getAllTodos(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/commidity/');
  }

  getAllstores(): Observable<any> {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRStore/get/all');
  }

  postCostCenter(data: any) {
    return this.http.post<any>(`${this.url}/FICostCenter/Add`, data);
  }

  getCostCenter() {
    return this.http.get<any>(`${this.url}/FICostCenter/get/all `);
  }

  putCostCenter(data: any) {
    return this.http.put<any>(`${this.url}/FICostCenter/update`, data);
  }

  deleteCostCenter(id: number) {
    return this.http.delete<any>(`${this.url}/FICostCenter/delete/` + id);
  }

  // crud items

  postItem(data: any) {
    console.log('post data:', data);
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STR_Item/Add-item',
      data
    );
  }

  getcommodity() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/get/all'
    );
  }
  postStrOpenItems(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STR_Item/Add-item',
      data
    );
  }

  putItems(data: any) {
    console.log('put data:', data);
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STR_Item/update-Item',
      data
    );
  }

  deleteItem(id: number) {
    return this.http.delete<any>(
      'http://ims.aswan.gov.eg/api/STR_Item/delete-Item-by-id/' + id
    );
  }

  getAllcommodity(): any {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/get/all'
    );
  }
  getAllplatoon(): any {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STR_Platoon/get-all-Platoons'
    );
  }
  getAllgroup(): any {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRGroup/get/all ');
  }

  getAllgrade(): any {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRGrade/get/all ');
  }
  getAllunit(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STR_Unit/get-all-Unit'
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
  //  commodity
  postCommodity(data: any) {
    console.log('add product data: ', data);

    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/Add ',
      data
    );
  }

  getCommodity() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/get/all'
    );
  }

  putCommodity(data: any) {
    console.log('edit data by id: ', data);

    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/update',
      data
    );
  }

  deleteCommodity(id: number) {
    console.log('delete by id: ', id);
    return this.http.delete<any>(
      'http://ims.aswan.gov.eg/api/STRCommodity/delete/' + id
    );
  }

  ///////////////////////////////// STR-Group /////////////////////////////
  getStrGroupAutoCode(lastPlatoonId: any) {
    console.log('send req to get autoCode , lastPlatoonId is: ', lastPlatoonId);
    return this.http.get<any>(
      `http://ims.aswan.gov.eg/api/STRGroup/AutoCode?PlatoonId=${lastPlatoonId}`
    );
  }

  getCommodityAutoCode() {
    return this.http.get<any>(
      `http://ims.aswan.gov.eg/api/STRCommodity/AutoCode`
    );
  }

  // getCostCenterAutoCode(){
  //   return this.http.get<any>(`http://ims.aswan.gov.eg/api/STRCostCenter/AutoCode`);

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
      `${this.url}/STROpeningStock/get/AutoNo?StoreId=${storeId}&FiscalYearId=${fiscalYearId}`
    );
  }

  getStrWithdrawAutoNo(storeId: any, fiscalyearId: any) {
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
  putStrOpen(data: any) {
    return this.http.put<any>(`${this.url}/STROpeningStock/update`, data);
  }
  deleteStrOpen(id: number) {
    return this.http.delete<any>(`${this.url}/STROpeningStock/delete/` + id);
  }

  postStrOpenDetails(data: any) {
    return this.http.post<any>(`${this.url}/STROpeningStockDetails/Add`, data);
  }
  getStrOpenDetailsByMasterId(id: any) {
    return this.http.get<any>(
      `${this.url}/STROpeningStock/GetopenstockDetailsByopenStockId/${id}`
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

  getUserStores(userId: any) {
    return this.http.get<any>(
      `${this.url}/StrUserStore/getUserStore/${userId}`
    );
  }

  getItems() {
    return this.http.get<any>(`${this.url}/STRItem/get/all`);
  }

  getFiscalYears() {
    return this.http.get<any>(`${this.url}/STRFiscalYear/get/all`);
  }

  getLastFiscalYear() {
    return this.http.get<any>(
      `${this.url}/STRFiscalYear/getLastfisicalyear/all`
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

  getStrOpenSearach(
    no: any,
    storeId: any,
    date: any,
    fiscalYear: any,
    itemId: any
  ) {
    this.mycondition = `${this.url}/STROpeningStock/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!storeId == false) {
      this.mycondition = ` ${this.mycondition}&StoreId=${storeId}`;
    }
    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&Date=${date}`;
    }
    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&fiscalyear=${fiscalYear}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&itemId=${itemId}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
    //enter no.
    // if (no != '' && !storeId && !date && !fiscalYear && !itemId) {
    //   console.log('enter no. strOpen search');
    //   return this.http.get<any>(`${this.url}/STROpeningStock/search?No=${no}`);
    // }
    // //enter store
    // else if (!no && storeId && !date && !fiscalYear && !itemId) {
    //   console.log('enter store strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?StoreId=${storeId}`
    //   );
    // }
    // //enter date
    // else if (!no && !storeId && date && !fiscalYear && !itemId) {
    //   console.log('enter date strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?Date=${date}`
    //   );
    // }
    // //enter fiscalYear
    // else if (!no && !storeId && !date && fiscalYear && !itemId) {
    //   console.log('enter fisalYear strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?fiscalyear=${fiscalYear}`
    //   );
    // }
    // //enter itemId
    // else if (!no && !storeId && !date && !fiscalYear && itemId) {
    //   console.log('enter itemId strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?ItemId=${itemId}`
    //   );
    // }

    // //enter no. & store
    // else if (no && storeId && !date && !fiscalYear && !itemId) {
    //   console.log('enter no. & store strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?StoreId=${storeId}&No=${no}`
    //   );
    // }
    // //enter no. & date
    // else if (no && !storeId && date && !fiscalYear && !itemId) {
    //   console.log('enter no. & date strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?Date=${date}&No=${no}`
    //   );
    // }
    // //enter no. & fiscalYear
    // else if (no && !storeId && !date && fiscalYear && !itemId) {
    //   console.log('enter no. & fiscalYear strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?No=${no}&fiscalyear=${fiscalYear}`
    //   );
    // }
    // //enter no. & itemId
    // else if (no && !storeId && !date && !fiscalYear && itemId) {
    //   console.log('enter no. & itemId strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?No=${no}&ItemId=${itemId}`
    //   );
    // }

    // //enter store & date
    // else if (!no && storeId && date && !fiscalYear && !itemId) {
    //   console.log('enter store & date strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?StoreId=${storeId}&Date=${date}`
    //   );
    // }
    // //enter store & fiscalYear
    // else if (!no && storeId && !date && fiscalYear && !itemId) {
    //   console.log('enter store & fiscalYear strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?StoreId=${storeId}&fiscalyear=${storeId}`
    //   );
    // }
    // //enter store & itemId
    // else if (!no && storeId && !date && !fiscalYear && itemId) {
    //   console.log('enter store & itemId strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?StoreId=${storeId}&ItemId=${itemId}`
    //   );
    // }

    // //enter date & fiscalYear
    // else if (!no && !storeId && date && fiscalYear && !itemId) {
    //   console.log('enter date & fiscalYear strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?Date=${date}&fiscalyear=${fiscalYear}`
    //   );
    // }
    // //enter date & itemId
    // else if (!no && !storeId && date && !fiscalYear && itemId) {
    //   console.log('enter date & itemId strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?Date=${date}&ItemId=${itemId}`
    //   );
    // }

    // //enter fiscalYear & itemId
    // else if (!no && !storeId && !date && fiscalYear && itemId) {
    //   console.log('enter fiscalYear & itemId strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?fiscalyear=${fiscalYear}&ItemId=${itemId}`
    //   );
    // }

    // //enter all data
    // else if (
    //   no != '' &&
    //   storeId != '' &&
    //   date != '' &&
    //   fiscalYear != '' &&
    //   itemId != ''
    // ) {
    //   console.log('enter all data strOpen search');
    //   return this.http.get<any>(
    //     `${this.url}/STROpeningStock/search?StoreId=${storeId}&Date=${date}&No=${no}&fiscalyear=${fiscalYear}&ItemId=${itemId}`
    //   );
    // }

    // console.log("didn't enter any condition search");
    // return this.http.get<any>(
    //   `${this.url}/STROpeningStock/search?StoreId=${0}`
    // );
  }

  ///////////////////////////////// STR-EmployeeExchange & details/////////////////////////////
  getStrEmployeeExchangeAutoNo() {
    return this.http.get<any>(`${this.url}/STREmployeExchange/get/AutoNo`);
  }

  getHrEmployees() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
  }

  getHrEmployeeById(id: any) {
    return this.http.get<any>(`${this.url}/HREmployee/get/${id}`);
  }

  getFiCostCenter() {
    return this.http.get<any>(`${this.url}/FICostCenter/get/all`);
  }

  postStrEmployeeExchange(data: any) {
    return this.http.post<any>(`${this.url}/STREmployeExchange/Add`, data);
  }
  getStrEmployeeExchange() {
    return this.http.get<any>(`${this.url}/STREmployeExchange/get/all/`);
  }
  putStrEmployeeExchange(data: any) {
    return this.http.put<any>(`${this.url}/STREmployeExchange/update`, data);
  }
  deleteStrEmployeeExchange(id: number) {
    return this.http.delete<any>(`${this.url}/STREmployeExchange/delete/` + id);
  }

  postStrEmployeeExchangeDetails(data: any) {
    return this.http.post<any>(
      `${this.url}/STREmployeeExchangeDetails/Add`,
      data
    );
  }
  getStrEmployeeExchangeDetailsByMasterId(id: any) {
    return this.http.get<any>(
      `${this.url}/STREmployeExchange/GetEmployeeExchangeDetailsByEmployeeExchangeId/${id}`
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
      `${this.url}/STREmployeeExchangeDetails/delete/by/EmployeeExchange/` +
        HeaderId
    );
  }
  getStrEmployeeExchangeSearach(
    no: any,
    costCenterId: any,
    employeeId: any,
    date: any,
    distEmployee: any
  ) {
    console.log(
      "values search passed: 'no: '",
      no,
      "' costCenterId: '",
      costCenterId,
      "' employeeId: '",
      employeeId,
      "' date: '",
      date,
      "' distEmployee: '",
      distEmployee
    );
    this.mycondition;
    this.mycondition = `${this.url}/STREmployeExchange/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }

    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&Date=${date}`;
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
    //enter no.
    //enter no.
    // if (no != '' && !costCenterId && !employeeId && !date && !distEmployee) {
    //   console.log('enter no. employeeExchange search');

    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?No=${no}`
    //   );
    // }
    // //enter costCenter
    // else if (!no && costCenterId && !employeeId && !date && !distEmployee) {
    //   console.log('enter costCenter employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?CostCenterId=${costCenterId}`
    //   );
    // }
    // //enter employee
    // else if (!no && !costCenterId && employeeId && !date && !distEmployee) {
    //   console.log('enter employee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?EmployeeId=${employeeId}`
    //   );
    // }
    // //enter date
    // else if (!no && !costCenterId && !employeeId && date && !distEmployee) {
    //   console.log('enter date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?Date=${date}`
    //   );
    // }
    // //enter distEmployee
    // else if (!no && !costCenterId && !employeeId && !date && distEmployee) {
    //   console.log('enter distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?DestEmployeeId=${distEmployee}`
    //   );
    // }

    // //enter no. & costCenter
    // else if (no && costCenterId && !employeeId && !date && !distEmployee) {
    //   console.log('enter no. & costCenter employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?No=${no}&CostCenterId=${costCenterId}`
    //   );
    //   // console.log("url",`${this.url}/STREmployeExchange/search?No=${no}&CostCenterId=${costCenterId}`)
    // }
    // //enter no. & employee
    // else if (no && !costCenterId && employeeId && !date && !distEmployee) {
    //   console.log('enter no. & employee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?No=${no}&EmployeeId=${employeeId}`
    //   );
    // }
    // //enter no. & date
    // else if (no && !costCenterId && !employeeId && date && !distEmployee) {
    //   console.log('enter no. & date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?Date=${date}&No=${no}`
    //   );
    // }
    // //enter no & distEmployee
    // else if (no && !costCenterId && !employeeId && !date && distEmployee) {
    //   console.log('enter no. & distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?No=${no}&DestEmployeeId=${distEmployee}`
    //   );
    // }

    // //enter costCenter & employee
    // else if (!no && costCenterId && employeeId && !date && !distEmployee) {
    //   console.log('enter costCenter & employee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?CostCenterId=${costCenterId}&EmployeeId=${employeeId}`
    //   );
    // }
    // //enter costCenter & date
    // else if (!no && costCenterId && !employeeId && date && !distEmployee) {
    //   console.log('enter costCenter & date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?Date=${date}&CostCenterId=${costCenterId}`
    //   );
    // }
    // //enter costCenter & distEmployee
    // else if (!no && costCenterId && !employeeId && !date && distEmployee) {
    //   console.log('enter costCenter & distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?DestEmployeeId=${distEmployee}&CostCenterId=${costCenterId}`
    //   );
    // }

    // //enter employee & date
    // else if (!no && !costCenterId && employeeId && date && !distEmployee) {
    //   console.log('enter employee & date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?Date=${date}&EmployeeId=${employeeId}`
    //   );
    // }
    // //enter employee & distEmployee
    // else if (!no && !costCenterId && employeeId && !date && distEmployee) {
    //   console.log('enter employee & distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?DestEmployeeId=${distEmployee}&EmployeeId=${employeeId}`
    //   );
    // }

    // //enter distEmployee & date
    // else if (!no && !costCenterId && !employeeId && date && distEmployee) {
    //   console.log('enter distEmployee & date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?Date=${date}&DestEmployeeId=${distEmployee}`
    //   );
    // }

    // //enter all data
    // else if (
    //   no != '' &&
    //   costCenterId != '' &&
    //   employeeId != '' &&
    //   date != '' &&
    //   distEmployee != ''
    // ) {
    //   console.log('enter all data employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeExchange/search?Date=${date}&No=${no}&DestEmployeeId=${distEmployee}&CostCenterId=${costCenterId}&EmployeeId=${employeeId}`
    //   );
    // }

    // console.log("didn't enter any condition search");
    // return this.http.get<any>(`${this.url}/STREmployeExchange/search?No=${0}`);
  }

  // open Empoyee
  postStrEmployeeOpen(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustody/Add',
      data
    );
  }
  getStrEmployeeOpen() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustody/get/all'
    );
  }
  putStrEmployeeOpen(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustody/update',
      data
    );
  }
  deleteStrEmployeeOpen(id: number) {
    return this.http.delete<any>(
      'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustody/delete/' + id
    );
  }
  getAllEmployees() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/HREmployee/get/all');
  }

  postStrEmployeeOpenDetails(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustodyDetails/Add',
      data
    );
  }
  // getStrOpenDetails() {
  //   return this.http.get<any>("https://ims.aswan.gov.eg/api/STR_Opening_Stock/get-all-Opening_Stock_Details");
  // }
  putStrEmployeeOpenDetails(data: any) {
    console.log('putStrEmployeeOpenDetails data: ', data);
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustodyDetails/update/',
      data
    );
  }

  deleteStrEmployeeOpenDetails(HeaderId: number) {
    console.log('deleted row id: ', HeaderId);
    return this.http.delete<any>(
      'http://ims.aswan.gov.eg/api/STREmployeeOpeningCustodyDetails/delete/' +
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
    return this.http.get<any>(`${this.url}/STREmployeeOpeningCustody/GetEmployeeOpeningCustodyDetailsByStrEmployeeOpeningCustodyId/${id}`);
  }
  putStEmp(data: any) {
    return this.http.put<any>(`${this.url}/STREmployeeOpeningCustody/update`, data);
  }
  // getStrOpenDetailsByMasterId(id: any) {
  //   return this.http.get<any>(`${this.url}/STROpeningStock/GetopenstockDetailsByopenStockId/${id}`);
  // }
  /////////////withdraw///////////

  postStrWithdraw(data: any) {
    console.log('post data:', data);
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRWithdraw/Add',
      data
    );
  }

  getStrWithdraw() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRWithdraw/get/all '
    );
  }
  putStrWithdraw(data: any) {
    console.log('put data ', data);

    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRWithdraw/update ',
      data
    );
  }
  deleteStrWithdraw(id: number) {
    return this.http.delete<any>(
      'http://ims.aswan.gov.eg/api/STRWithdraw/delete/' + id
    );
  }

  postStrWithdrawDetails(data: any) {
    console.log('post details', data);
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRWithdrawDetails/Add',
      data
    );
  }
  getStrWithdrawDetails() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRWithdrawDetails/get/all '
    );
  }
  putStrWithdrawDetails(data: any) {
    console.log('put details');

    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRWithdrawDetails/update ',
      data
    );
  }
  deleteStrWithdrawDetails(HeaderId: number) {
    // console.log("deleted row id: ", HeaderId)
    return this.http.delete<any>(
      'http://ims.aswan.gov.eg/api/STRWithdrawDetails/delete/' + HeaderId
    );
  }
  getStrWithdrawSearch(
    no: any,
    store: any,
    date: any,
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
      date,
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
    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&Date=${date}`;
    }
    if (!fiscalYear == false) {
      this.mycondition = ` ${this.mycondition}&fiscalyear=${fiscalYear}`;
    }
    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&itemId=${itemId}`;
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
    return this.http.get<any>('http://ims.aswan.gov.eg/api/HREmployee/get/all');
    // return this.http.get<any>("http://localhost:3000/StoreList/");
  }
  getseller() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/PRSeller/get/all    '
    );
    // return this.http.get<any>("http://localhost:3000/StoreList/");
  }

  // postStrOpen(data: any) {
  //   return this.http.post<any>("https://ims.aswan.gov.eg/api/STR_Opening_Stock/Add-Opening_Stock", data);
  // }

  ////////file upload/////////

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
  ///////////////////////////////// STR-Product/////////////////////////////
  postStrProduct(data: any) {
    console.log('form add product data to backend: ', data);
    return this.http.post<any>(`${this.url}/STRProduct/Add`, data);
  }
  getStrProduct() {
    return this.http.get<any>(`${this.url}/STRProduct/get/all`);
  }
  putStrProduct(data: any) {
    return this.http.put<any>(`${this.url}/STRProduct/update`, data);
  }
  deleteStrProduct(id: number) {
    console.log('delete product data from api, id: ', id);
    return this.http.delete<any>(`${this.url}/STRProduct/Delete/` + id);
  }
  ///////////////////////////////// STR-Product/////////////////////////////
  // postStrProduct(data: any) {
  //   console.log('form add product data to backend: ', data);
  //   return this.http.post<any>(`${this.url}/STRProduct/Add`, data);
  // }
  // getStrProduct() {
  //   return this.http.get<any>(`${this.url}/STRProduct/get/all`);
  // }
  // putStrProduct(data: any) {
  //   return this.http.put<any>(`${this.url}/STRProduct/update`, data);
  // }
  // deleteStrProduct(id: number) {
  //   console.log('delete product data from api, id: ', id);
  //   return this.http.delete<any>(`${this.url}/STRProduct/Delete/` + id);
  // }

  getVendors() {
    return this.http.get<any>(`${this.url}/STRVendor/get/all`);
  }

  // getModels() {
  //   return this.http.get<any>(
  //     `${this.url}/STRModel/get/all`
  //   );
  // }

  //   return this.http.get<any>(`${this.url}/STRVendor/get/all`);
  // }

  getModels() {
    return this.http.get<any>(`${this.url}/STRModel/get/all`);
  }

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
  getFiEntrySearach(
    no: any,
    journalId: any,
    accountId: any,
    date: any,
    sourceId: any
  ) {
    console.log(
      "values search passed: 'no: '",
      no,
      "' journalId: '",
      journalId,
      "' accountId: '",
      accountId,
      "' date: '",
      date,
      'sourceId: ',
      sourceId
    );
    // enter no.
    if (no != '' && !journalId && !accountId && !date && !sourceId) {
      console.log('enter no. fiEntry search');
      return this.http.get<any>(`${this.url}/FIEntry/search?No=${no}`);
    }
    //enter journalId
    else if (!no && journalId && !accountId && !date && !sourceId) {
      console.log('enter journalId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?JournalId=${journalId}`
      );
    }
    //enter accountId
    else if (!no && !journalId && accountId && !date && !sourceId) {
      console.log('enter accountId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?AccountId=${accountId}`
      );
    }
    //enter date
    else if (!no && !journalId && !accountId && date && !sourceId) {
      console.log('enter date fiEntry search');
      return this.http.get<any>(`${this.url}/FIEntry/search?Date=${date}`);
    }
    //enter sourceId
    else if (!no && !journalId && !accountId && !date && sourceId) {
      console.log('enter sourceId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?FiEntrySourceTypeId=${sourceId}`
      );
    }

    //enter no. & journalId
    else if (no && journalId && !accountId && !date && !sourceId) {
      console.log('enter no. & journalId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?No=${no}&JournalId=${journalId}`
      );
    }
    //enter no. & accountId
    else if (no && !journalId && accountId && !date && !sourceId) {
      console.log('enter no. & accountId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?No=${no}&AccountId=${accountId}`
      );
    }
    //enter no. & date
    else if (no && !journalId && !accountId && date && !sourceId) {
      console.log('enter no. & date fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?Date=${date}&No=${no}`
      );
    }
    //enter no & sourceId
    else if (no && !journalId && !accountId && !date && sourceId) {
      console.log('enter no & sourceId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?No=${no}&FiEntrySourceTypeId=${sourceId}`
      );
    }

    //enter journalId & accountId
    else if (!no && journalId && accountId && !date && !sourceId) {
      console.log('enter journalId & accountId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?JournalId=${journalId}&AccountId=${accountId}`
      );
    }
    //enter journalId & date
    else if (!no && journalId && !accountId && date && !sourceId) {
      console.log('enter journalId & date fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?Date=${date}&JournalId=${journalId}`
      );
    }
    //enter journalId & sourceId
    else if (!no && journalId && !accountId && !date && sourceId) {
      console.log('enter journalId & sourceId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?JournalId=${journalId}&FiEntrySourceTypeId=${sourceId}`
      );
    }

    //enter accountId & date
    else if (!no && !journalId && accountId && date && !sourceId) {
      console.log('enter accountId & date fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?Date=${date}&AccountId=${accountId}`
      );
    }
    //enter accountId & sourceId
    else if (!no && !journalId && accountId && !date && sourceId) {
      console.log('enter accountId & sourceId fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?FiEntrySourceTypeId=${sourceId}&AccountId=${accountId}`
      );
    }

    //enter sourceId & date
    else if (!no && !journalId && !accountId && date && sourceId) {
      console.log('enter sourceId & date fiEntry search');
      return this.http.get<any>(
        `${this.url}/FIEntry/search?Date=${date}&FiEntrySourceTypeId=${sourceId}`
      );
    }

    //enter all data
    else if (
      no != '' &&
      journalId != '' &&
      accountId != '' &&
      date != '' &&
      sourceId != ''
    ) {
      console.log('enter all data strOpen search');
      return this.http.get<any>(
        `https://ims.aswan.gov.eg/api/STR_Employe_Exchange/search?Date=${date}&No=${no}&JournalId=${journalId}&FiEntrySourceTypeId=${sourceId}&AccountId=${accountId}`
      );
    }

    console.log("didn't enter any condition search");
    return this.http.get<any>(
      `https://ims.aswan.gov.eg/api/STR_Employe_Exchange/search?No=${0}`
    );
  }

  // ----Start Add----

  getStrAddAutoNo() {
    return this.http.get<any>(`${this.url}/STRAdd/get/AutoNo`);
  }

  postStrAdd(data: any) {
    console.log('dataaaaaa: ', data);
    return this.http.post<any>('http://ims.aswan.gov.eg/api/STRAdd/Add', data);
  }
  getStrAdd() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRAdd/get/all');
  }
  putStrAdd(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRAdd/update',
      data
    );
  }
  deleteStrAdd(id: number) {
    return this.http.delete<any>(
      'http://ims.aswan.gov.eg/api/STRAdd/Delete/' + id
    );
  }
  getAllSellers() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/PRSeller/get/all');
  }
  getAllEmployee() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/HREmployee/get/all');
  }
  getAllStore() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRStore/get/all');
  }

  GetAddGeTAddDetailsByAddId(id: number) {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRAdd/GetAddGeTAddDetailsByAddId/' + id
    );
  }

  postStrAddDetails(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRAddDetails/Add',
      data
    );
  }
  getStrAddDetailsByAddId(id: any) {
    return this.http.get<any>(`${this.url}/STRAdd/GeTAddDetailsByAddId/${id}`);
  }
  putStrAddDetails(data: any) {
    console.log('strOpenDetails data: ', data);
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRAddDetails/Update/',
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

  // -------end add--------

  // getStrOpenDetails() {
  //   return this.http.get<any>("https://ims.aswan.gov.eg/api/STR_Opening_Stock/get-all-Opening_Stock_Details");
  // }
  // putStrOpenDetails(data: any, id: number) {
  //   console.log("strOpenDetails id: ", id, "strOpenDetails data: ", data);
  //   return this.http.put<any>("https://ims.aswan.gov.eg/api/STR_Opening_Stock/update-Opening_Stock_Details-by-id/" + id, data);
  // }
  // deleteStrOpenDetails(HeaderId: number) {
  //   // console.log("deleted row id: ", HeaderId)
  //   return this.http.delete<any>("https://ims.aswan.gov.eg/api/STR_Opening_Stock/delete-Opening_Stock_Details-by-id/" + HeaderId);
  // }

  // getStore() {
  //   return this.http.get<any>("http://ims.aswan.gov.eg/api/STRStore/get/all");
  //   // return this.http.get<any>("http://localhost:3000/StoreList/");
  // }
  getType() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRAddType/get/all');
    // return this.http.get<any>("http://localhost:3000/StoreList/");
  }
  getSeller() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/PRSeller/get/all');
    // return this.http.get<any>("http://localhost:3000/StoreList/");
  }
  getReciept() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/STRAddReceipt/get/all'
    );
    // return this.http.get<any>("http://localhost:3000/StoreList/");
  }
  // getEmployee() {
  //   return this.http.get<any>("http://ims.aswan.gov.eg/api/HREmployee/get/all");
  //   // return this.http.get<any>("http://localhost:3000/StoreList/");
  // }

  // getItems() {
  //   return this.http.get<any>("http://ims.aswan.gov.eg/api/STRItem/get/all");
  // }

  // getFiscalYears() {
  //   return this.http.get<any>("http://ims.aswan.gov.eg/api/STRFiscalYear/get/all");
  // }

  getStrAddSearach(no: any, storeId: any, date: any) {
    //enter no.
    this.mycondition = `${this.url}/STRAdd/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!storeId == false) {
      this.mycondition = ` ${this.mycondition}&StoreId=${storeId}`;
    }
    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&Date=${date}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
    // if (no != '' && !storeId && !date) {
    //   console.log('enter no. stradd search');
    //   return this.http.get<any>(
    //     `http://ims.aswan.gov.eg/api/STRAdd/search?No=${no}`
    //   );
    // }
    // //enter store
    // else if (!no && storeId && !date) {
    //   console.log('enter store stradd search');
    //   return this.http.get<any>(
    //     `http://ims.aswan.gov.eg/api/STRAdd/search?StoreId=${storeId}`
    //   );
    // }
    // //enter date
    // else if (!no && !storeId && date) {
    //   console.log('enter date stradd search');
    //   return this.http.get<any>(
    //     `http://ims.aswan.gov.eg/api/STRAdd/search?Date=${date}`
    //   );
    // }
    // //enter no. & store
    // else if (no && storeId && !date) {
    //   console.log('enter no. & store stradd search');
    //   return this.http.get<any>(
    //     `http://ims.aswan.gov.eg/api/STRAdd/search?StoreId=${storeId}&No=${no}`
    //   );
    // }
    // //enter no. & date
    // else if (no && !storeId && date) {
    //   console.log('enter no. & date stradd search');
    //   return this.http.get<any>(
    //     `http://ims.aswan.gov.eg/api/STRAdd/search?Date=${date}&No=${no}`
    //   );
    // }
    // //enter store & date
    // else if (!no && storeId && date) {
    //   console.log('enter store & date stradd search');
    //   return this.http.get<any>(
    //     `http://ims.aswan.gov.eg/api/STRAdd/search?StoreId=${storeId}&Date=${date}`
    //   );
    // }
    // //enter all data
    // else if (no != '' && storeId != '' && date != '') {
    //   console.log('enter all data stradd search');
    //   return this.http.get<any>(
    //     `http://ims.aswan.gov.eg/api/STRAdd/search?StoreId=${storeId}&Date=${date}&No=${no}`
    //   );
    // }

    // console.log("didn't enter any condition search");
    // return this.http.get<any>(
    //   `http://ims.aswan.gov.eg/api/STRAdd/search?StoreId=${0}`
    // );
  }

  // vendor
  postVendor(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRVendor/Add',
      data
    );
  }
  // here
  getVendor() {
    return this.http.get<any>('http://ims.aswan.gov.eg/api/STRVendor/get/all');
  }
  putVendor(data: any) {
    console.log('data');
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/STRVendor/update',
      data
    );
  }
  daleteVendor(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/STRVendor/delete/${id}`
    );
  }

  ////////Hr JobTitle/////

  getHrJobTitle() {
    // console.log("deleted row id: ", HeaderId)
    return this.http.get<any>(`${this.url}/HrJobTitle/get/all`);
  }
  deleteHrJobTitle(id: number) {
    return this.http.delete<any>(
      `${this.url}/HrJobTitle/delete-JobTitle/` + id
    );
  }
  postHrJobTitle(data: any) {
    return this.http.post<any>(`${this.url}/HrJobTitle/Add`, data);
  }
  putHrJobTitle(data: any) {
    return this.http.put<any>(`${this.url}/HrJobTitle/update`, data);
  }

  ////////Hr position/////

  getHrPosition() {
    // console.log("deleted row id: ", HeaderId)
    return this.http.get<any>(`${this.url}/HrPosition/get/all`);
  }
  deleteHrPosition(id: number) {
    return this.http.delete<any>(`${this.url}/HrPosition/delete/` + id);
  }
  postHrPosition(data: any) {
    return this.http.post<any>(`${this.url}/HrPosition/Add`, data);
  }
  putHrPosition(data: any) {
    return this.http.put<any>(`${this.url}/HrPosition/update`, data);
  }

  ///////////////////////////////// HR-IncentiveAllowance /////////////////////////////
  postHrIncentiveAllowance(data: any) {
    // console.log('form add data to apiii: ', data);
    return this.http.post<any>(
      `${this.url}/HrIncentiveAllowance/Add-IncentiveAllowance`,
      data
    );
  }
  getHrIncentiveAllowance() {
    return this.http.get<any>(
      `${this.url}/HrIncentiveAllowance/get-all-IncentiveAllowance`
    );
  }
  putHrIncentiveAllowance(data: any) {
    return this.http.put<any>(
      `${this.url}/HrIncentiveAllowance/update-IncentiveAllowance`,
      data
    );
  }
  deleteHrIncentiveAllowance(id: number) {
    // console.log('form delete data from apiii, id: ', id);
    return this.http.delete<any>(
      `${this.url}/HrIncentiveAllowance/delete-IncentiveAllowance/` + id
    );
  }

  ///////////////////////////////// HR-HrHiringType /////////////////////////////
  postHrHiringType(data: any) {
    // console.log('form add data to apiii: ', data);
    return this.http.post<any>(`${this.url}/HrHiringType/Add`, data);
  }
  getHrHiringType() {
    return this.http.get<any>(`${this.url}/HrHiringType/get/all`);
  }
  putHrHiringType(data: any) {
    return this.http.put<any>(`${this.url}/HrHiringType/update`, data);
  }
  deleteHrHiringType(id: number) {
    // console.log('form delete data from apiii, id: ', id);
    return this.http.delete<any>(`${this.url}/HrHiringType/delete/` + id);
  }

  // MillitryState
  postMillitryState(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/HrMillitryState/Add',
      data
    );
  }
  // here

  // here
  getMillitryState() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/HrMillitryState/get/all'
    );
  }
  putMillitryState(data: any) {
    console.log('data');
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrMillitryState/update',
      data
    );
  }
  daleteMillitryState(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrMillitryState/delete/${id}`
    );
  }
  postVacation(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/HrVacation/Add',
      data
    );
  }
  // here
  getVacation() {
    return this.http.get<any>(`${this.url}/HrVacation/get/all`);
  }
  putVacation(data: any) {
    console.log('data');
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrVacation/update',
      data
    );
  }
  daleteVacation(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrVacation/delete/${id}`
    );
  }

  /////////////HR Disciplinary////////////
  postHrDisciplinary(data: any) {
    // console.log('form add data to apiii: ', data);
    return this.http.post<any>(
      `${this.url}/HrDisciplinary/Add-Disciplinary`,
      data
    );
  }
  getHrDisciplinary() {
    return this.http.get<any>(
      `${this.url}/HrDisciplinary/get-all-Disciplinary`
    );
  }
  putHrDisciplinary(data: any) {
    return this.http.put<any>(
      `${this.url}/HrDisciplinary/update-Disciplinary`,
      data
    );
  }
  deleteHrDisciplinary(id: number) {
    // console.log('form delete data from apiii, id: ', id);
    return this.http.delete<any>(
      `${this.url}/HrDisciplinary/delete-Disciplinary/` + id
    );
  }

  /////////////HR employeeDisciplinary////////////
  postHrEmployeeDisciplinary(data: any) {
    console.log('post in employeedisciplinary: ', data);
    return this.http.post<any>(
      `${this.url}/HrEmployeeDisciplinary/Add-EmployeeDisciplinary`,
      data
    );
  }
  getHrEmployeeDisciplinary() {
    return this.http.get<any>(
      `${this.url}/HrEmployeeDisciplinary/get-all-EmployeeDisciplinary`
    );
  }
  putHrEmployeeDisciplinary(data: any) {
    console.log('put in employeedisciplinary: ', data);

    return this.http.put<any>(
      `${this.url}/HrEmployeeDisciplinary/update-EmployeeDisciplinary`,
      data
    );
  }
  deleteHrEmployeeDisciplinary(id: number) {
    // console.log('form delete data from apiii, id: ', id);
    return this.http.delete<any>(
      `${this.url}/HrEmployeeDisciplinary/delete-EmployeeDisciplinary/` + id
    );
  }

  ///////////////////////////////// HR-EmployeeVacation /////////////////////////////
  postHrEmployeeVacation(data: any) {
    // console.log('form add data to apiii: ', data);
    return this.http.post<any>(`${this.url}/HrEmployeeVacation/Add`, data);
  }
  getHrEmployeeVacation() {
    return this.http.get<any>(`${this.url}/HrEmployeeVacation/get/all`);
  }
  putHrEmployeeVacation(data: any) {
    return this.http.put<any>(`${this.url}/HrEmployeeVacation/update`, data);
  }
  deleteHrEmployeeVacation(id: number) {
    // console.log('form delete data from apiii, id: ', id);
    return this.http.delete<any>(`${this.url}/HrEmployeeVacation/delete/` + id);
  }

  ///////////////////////////////// HR-EmployeeVacationBalance /////////////////////////////
  postHrEmployeeVacationBalance(data: any) {
    // console.log('form add data to apiii: ', data);
    return this.http.post<any>(
      `${this.url}/HrEmployeeVacationBalance/Add`,
      data
    );
  }
  getHrEmployeeVacationBalance() {
    return this.http.get<any>(`${this.url}/HrEmployeeVacationBalance/get/all`);
  }
  putHrEmployeeVacationBalance(data: any) {
    return this.http.put<any>(
      `${this.url}/HrEmployeeVacationBalance/update`,
      data
    );
  }
  deleteHrEmployeeVacationBalance(id: number) {
    // console.log('form delete data from apiii, id: ', id);
    return this.http.delete<any>(
      `${this.url}/HrEmployeeVacationBalance/delete/` + id
    );
  }

  ///////////////////////////////// PR-Group & PR-GroupRole/////////////////////////////
  getPrRole() {
    return this.http.get<any>(`${this.url}/PRRole/get/all`);
  }

  postPrGroup(data: any) {
    return this.http.post<any>(`${this.url}/PRGroup/Add`, data);
  }
  getPrGroup() {
    return this.http.get<any>(`${this.url}/PRGroup/get/all`);
  }
  putPrGroup(data: any) {
    console.log('prGroup edit data: ', data);
    return this.http.put<any>(`${this.url}/PRGroup/update`, data);
  }
  deletePrGroup(id: number) {
    console.log('deleted header bbbb row id: ', id);
    return this.http.delete<any>(`${this.url}/PRGroup/delete/` + id);
  }

  postPrGroupRole(data: any) {
    return this.http.post<any>(`${this.url}/PRGroupRole/add`, data);
  }
  putPrGroupRole(data: any) {
    console.log('PrGroupRole data: ', data);
    return this.http.put<any>(`${this.url}/PRGroupRole/update/`, data);
  }
  deletePrGroupRole(HeaderId: number) {
    console.log('deleted detaild row id: ', HeaderId);
    return this.http.delete<any>(`${this.url}/PRGroupRole/delete/` + HeaderId);
  }

  ///////////////////////////////// PR-User & PR-UserGroup /////////////////////////////
  postPrUser(data: any) {
    return this.http.post<any>(`${this.url}/PRUser/Add`, data);
  }
  getPrUser() {
    return this.http.get<any>(`${this.url}/PRUser/get/all`);
  }
  putPrUser(data: any) {
    console.log('prGroup edit data: ', data);
    return this.http.put<any>(`${this.url}/PRUser/update`, data);
  }
  deletePrUser(id: number) {
    console.log('deleted header bbbb row id: ', id);
    return this.http.delete<any>(`${this.url}/PRUser/delete/` + id);
  }

  postPrUserGroup(data: any) {
    return this.http.post<any>(`${this.url}/PRUserGroup/add`, data);
  }
  putPrUserGroup(data: any) {
    console.log('PrGroupRole data: ', data);
    return this.http.put<any>(`${this.url}/PRUserGroup/update`, data);
  }
  deletePrUserGroup(HeaderId: number) {
    console.log('deleted detaild row id: ', HeaderId);
    return this.http.delete<any>(`${this.url}/PRUserGroup/delete/` + HeaderId);
  }

  //hr
  getHrWorkPlace() {
    return this.http.get<any>(
      ' http://ims.aswan.gov.eg/api/HrWorkPlace/get/all'
    );
  }
  putHrWorkPlace(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrWorkPlace/update',
      data
    );
  }
  deleteHrWorkPlace(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrWorkPlace/delete/${id}`
    );
  }
  postHrWorkPlace(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/HrWorkPlace/Add',
      data
    );
  }
  getAllCityState(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/HrCityState/get/all'
    );
  }
  getHrspecialization() {
    return this.http.get<any>(
      ' http://ims.aswan.gov.eg/api/HrSpecialization/get/all'
    );
  }
  putHrspecialization(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrSpecialization/update',
      data
    );
  }
  deleteHrspecialization(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrSpecialization/delete/${id}`
    );
  }
  postHrspecialization(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/HrSpecialization/Add',
      data
    );
  }
  getAllqualification(): Observable<any> {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/HrQualification/get/all'
    );
  }
  getHrQualitativeGroup() {
    return this.http.get<any>(
      ' http://ims.aswan.gov.eg/api/HrQualitativeGroup/get/all'
    );
  }
  putHrQualitativeGroup(data: any) {
    return this.http.put<any>(
      'http://ims.aswan.gov.eg/api/HrQualitativeGroup/update',
      data
    );
  }
  deleteHrQualitativeGroup(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/HrQualitativeGroup/delete/${id}`
    );
  }
  postHrQualitativeGroup(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/HrQualitativeGroup/Add',
      data
    );
  }
  getAllVendor() {
    return this.http.get<any>(' http://ims.aswan.gov.eg/api/STRVendor/get/all');
  }
  // MODEL
  postModel(data: any) {
    return this.http.post<any>(
      'http://ims.aswan.gov.eg/api/STRModel/Add',
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
      'http://ims.aswan.gov.eg/api/STRModel/update',
      data
    );
  }
  deleteModel(id: number) {
    return this.http.delete<any>(
      `http://ims.aswan.gov.eg/api/STRModel/delete/${id}`
    );
  }

  getStrEmployeeOpenSearach(
    no: any,
    costCenterId: any,
    employeeId: any,
    date: any,
    itemId: any
  ) {
    console.log(
      "values search passed: 'no: '",
      no,
      "' costCenterId: '",
      costCenterId,
      "' employeeId: '",
      employeeId,
      "' date: '",
      date,
      "' distEmployee: '",
      itemId
    );
    this.mycondition=`${this.url}/STREmployeeOpeningCustody/search?`
    this.mycondition = `${this.url}/STREmployeeOpeningCustody/search?`;

    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }

    if (!date == false) {
      this.mycondition = ` ${this.mycondition}&Date=${date}`;
    }

    if (!itemId == false) {
      this.mycondition = ` ${this.mycondition}&itemId=${itemId}`;
    }
    if (!employeeId == false) {
      this.mycondition = ` ${this.mycondition}&EmployeeId=${employeeId}`;
    }
    if (!costCenterId == false) {
      this.mycondition = ` ${this.mycondition}&costCenterId=${costCenterId}`;
    }

    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
    // //enter no.
    // if (no != '' && !costCenterId && !employeeId && !date && !itemId) {
    //   console.log('enter no. employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?No=${no}`
    //   );
    // }
    // //enter costCenter
    // else if (!no && costCenterId && !employeeId && !date && !itemId) {
    //   console.log('enter costCenter employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?CostCenterId=${costCenterId}`
    //   );
    // }
    // //enter employee
    // else if (!no && !costCenterId && employeeId && !date && !itemId) {
    //   console.log('enter employee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?EmployeeId=${employeeId}`
    //   );
    // }
    // //enter date
    // else if (!no && !costCenterId && !employeeId && date && !itemId) {
    //   console.log('enter date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?Date=${date}`
    //   );
    // }
    // //enter distEmployee
    // else if (!no && !costCenterId && !employeeId && !date && itemId) {
    //   console.log('enter distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?ItemId=${itemId}`
    //   );
    // }

    // //enter no. & costCenter
    // else if (no != '' && costCenterId && !employeeId && !date && !itemId) {
    //   console.log('enter no. & costCenter employeeExchange search');
    //   return this.http.get<any>(

    //     `${this.url}/STREmployeeOpeningCustody/search?No=${no}&CostCenterId=${costCenterId}`
    //   );
    // }
    // //enter no. & employee
    // else if (no != '' && !costCenterId && employeeId && !date && !itemId) {
    //   console.log('enter no. & employee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?No=${no}&EmployeeId=${employeeId}`
    //   );
    // }
    // //enter no. & date
    // else if (no && !costCenterId && !employeeId && date && !itemId) {
    //   console.log('enter no. & date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?Date=${date}&No=${no}`
    //   );
    // }
    // //enter no & distEmployee
    // else if (no && !costCenterId && !employeeId && !date && itemId) {
    //   console.log('enter no. & distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?No=${no}&ItemId=${itemId}`
    //   );
    // }

    // //enter costCenter & employee
    // else if (no != '' && costCenterId && employeeId && !date && !itemId) {
    //   console.log('enter costCenter & employee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?CostCenterId=${costCenterId}&EmployeeId=${employeeId}`
    //   );
    // }
    // //enter costCenter & date
    // else if (no != '' && !costCenterId && !employeeId && !date && !itemId) {
    //   console.log('enter costCenter & date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}//STREmployeeOpeningCustody/search?Date=${date}&CostCenterId=${costCenterId}`
    //   );
    // }
    // //enter costCenter & distEmployee
    // else if (!no && costCenterId && !employeeId && !date && itemId) {
    //   console.log('enter costCenter & distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?ItemId=${itemId}&CostCenterId=${costCenterId}`
    //   );
    // }

    // //enter employee & date
    // else if (no != '' && !costCenterId && employeeId && date && !itemId) {
    //   console.log('enter employee & date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?Date=${date}&EmployeeId=${employeeId}`
    //   );
    // }
    // //enter employee & distEmployee
    // else if (!no && !costCenterId && employeeId && !date && itemId) {
    //   console.log('enter employee & distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?ItemId=${itemId}&EmployeeId=${employeeId}`
    //   );
    // } else if (!no && costCenterId && employeeId && !date && !itemId) {
    //   console.log('enter employee & distEmployee employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?CostCenterId=${costCenterId}&EmployeeId=${employeeId}`
    //   );
    // }
    // //enter distEmployee & date
    // else if (!no && !costCenterId && !employeeId && date && itemId) {
    //   console.log('enter distEmployee & date employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?Date=${date}&ItemId=${itemId}`
    //   );
    // }

    // //enter all data
    // else if (no != '' && costCenterId != '' && employeeId != '' && date != '' && itemId != '') {
    //   console.log('enter all data employeeExchange search');
    //   return this.http.get<any>(
    //     `${this.url}/STREmployeeOpeningCustody/search?Date=${date}&No=${no}&ItemId=${itemId}&CostCenterId=${costCenterId}&EmployeeId=${employeeId}`
    //   );
    // }

    // console.log("didn't enter any condition search");
    // return this.http.get<any>(`${this.url}/STREmployeeOpeningCustody/search??No=${0}`);
  }
  getStrEmployeeOpenAutoNo() {
    return this.http.get<any>(
      `${this.url}/STREmployeeOpeningCustody/get/AutoNo`
    );
  }

  getAllCostCenters() {
    return this.http.get<any>(
      'http://ims.aswan.gov.eg/api/FICostCenter/get/all'
    );
  }
}
