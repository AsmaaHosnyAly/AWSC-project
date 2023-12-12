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
  pageEnums = PagesEnums;
  mycondition: any;
  url = this.pageEnums.URL;
  constructor(private http: HttpClient) { }

  ////////////////////////////////////////Fa-CategoryFirst///////////////////////////////////////
  getFaCategoryFirstAutoCode() {
    return this.http.get<any>(`${this.url}/FaCategoryFirst/AutoCode`);
  }
  postFaCategoryFirst(data: any) {
    return this.http.post<any>(`${this.url}/FaCategoryFirst/Add`, data);
  }
  getFaCategoryFirst() {
    return this.http.get<any>(`${this.url}/FaCategoryFirst/get/all`);
  }
  getFaCategoryFirstById(id: any) {
    return this.http.get<any>(`${this.url}/FaCategoryFirst/get/${id}`);
  }
  putFaCategoryFirst(data: any) {
    return this.http.put<any>(`${this.url}/FaCategoryFirst/update`, data);
  }
  deleteFaCategoryFirst(id: number) {
    return this.http.delete<any>(`${this.url}/FaCategoryFirst/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////


  ////////////////////////////////////////Fa-CategorySecond///////////////////////////////////////
  getFaCategorySecondAutoCode() {
    return this.http.get<any>(`${this.url}/FaCategorySecond/AutoCode`);
  }
  postFaCategorySecond(data: any) {
    return this.http.post<any>(`${this.url}/FaCategorySecond/Add`, data);
  }
  getFaCategorySecond() {
    return this.http.get<any>(`${this.url}/FaCategorySecond/get/all`);
  }
  getFaCategorySecondById(id: any) {
    return this.http.get<any>(`${this.url}/FaCategorySecond/get/${id}`);
  }
  putFaCategorySecond(data: any) {
    return this.http.put<any>(`${this.url}/FaCategorySecond/update`, data);
  }
  deleteFaCategorySecond(id: number) {
    return this.http.delete<any>(`${this.url}/FaCategorySecond/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////


  ////////////////////////////////////////Fa-CategoryThird///////////////////////////////////////
  getFaCategoryThirdAutoCode() {
    return this.http.get<any>(`${this.url}/FaCategoryThird/AutoCode`);
  }
  postFaCategoryThird(data: any) {
    return this.http.post<any>(`${this.url}/FaCategoryThird/Add`, data);
  }
  getFaCategoryThird() {
    return this.http.get<any>(`${this.url}/FaCategoryThird/get/all`);
  }
  getFaCategoryThirdById(id: any) {
    return this.http.get<any>(`${this.url}/FaCategoryThird/get/${id}`);
  }
  putFaCategoryThird(data: any) {
    return this.http.put<any>(`${this.url}/FaCategoryThird/update`, data);
  }
  deleteFaCategoryThird(id: number) {
    return this.http.delete<any>(`${this.url}/FaCategoryThird/Delete/${id}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////


  ////////////////////////////////////////Fa-FixedAsset///////////////////////////////////////
  getCcCostCenter() {
    return this.http.get<any>(`${this.url}/CcCostCenter/get/all`);
  }
  getFiEntry() {
    return this.http.get<any>(`${this.url}/FIEntry/get/all`);
  }

  getFaFixedAssetAutoCode(categoryFirstId: any, categorySecondId: any, categoryThirdId: any) {
    return this.http.get<any>(`${this.url}/FaFixedAsset/AutoCode?CategoryFirstId=${categoryFirstId}&CategorySecondId=${categorySecondId}&CategoryThirdId=${categoryThirdId}`);
  }
  postFaFixedAsset(data: any) {
    return this.http.post<any>(`${this.url}/FaFixedAsset/Add`, data);
  }
  getFaFixedAssetPaginate(currentPage: any, pageSize: any) {
    let urlPassed = `${this.url}/FaFixedAsset/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  getFaFixedAsset() {
    return this.http.get<any>(`${this.url}/FaFixedAsset/get/all`);
  }
  putFaFixedAsset(data: any) {
    return this.http.put<any>(`${this.url}/FaFixedAsset/update`, data);
  }
  deleteFaFixedAsset(id: number) {
    return this.http.delete<any>(`${this.url}/FaFixedAsset/Delete/${id}`);
  }

  getFaFixedAssetSearach(

    // Id: any, 
    Name: any, Place: any, CategoryFirstId: any, CategorySecondId: any,
    CategoryThirdId: any, Code: any, CostCenterId: any, EntryId: any, BuyDate: any,
    WorkDate: any, SpeculateDate: any
  ) {

    console.log(
      // "values search passed: 'Id: '", Id,
      "values search passed: ': '",
      "' Name: '", Name,
      "' Place: '", Place,
      "' CategoryFirstId: '", CategoryFirstId,
      "' CategorySecondId: '", CategorySecondId,
      "' CategoryThirdId: '", CategoryThirdId,
      "' Code: '", Code,
      "' CostCenterId: '", CostCenterId,
      "' EntryId: '", EntryId,
      "' BuyDate: '", BuyDate,
      "' WorkDate: '", WorkDate,
      "' SpeculateDate: '", SpeculateDate,
    );
    this.mycondition = `${this.url}/FaFixedAsset/search?`;


    // if (!Id == false) {
    //   this.mycondition = ` ${this.mycondition}&No=${Id}`;
    // }
    if (!Name == false) {
      this.mycondition = ` ${this.mycondition}&Name=${Name}`;
    }
    if (!Place == false) {
      this.mycondition = ` ${this.mycondition}&Place=${Place}`;
    }
    if (!CategoryFirstId == false) {
      this.mycondition = ` ${this.mycondition}&CategoryFirstId=${CategoryFirstId}`;
    }
    if (!CategorySecondId == false) {
      this.mycondition = ` ${this.mycondition}&CategorySecondId=${CategorySecondId}`;
    }
    if (!CategoryThirdId == false) {
      this.mycondition = ` ${this.mycondition}&CategoryThirdId=${CategoryThirdId}`;
    }
    if (!Code == false) {
      this.mycondition = ` ${this.mycondition}&Code=${Code}`;
    }
    if (!CostCenterId == false) {
      this.mycondition = ` ${this.mycondition}&CostCenterId=${CostCenterId}`;
    }
    if (!EntryId == false) {
      this.mycondition = ` ${this.mycondition}&EntryId=${EntryId}`;
    }
    if (!BuyDate == false) {
      this.mycondition = ` ${this.mycondition}&BuyDate=${BuyDate}`;
    }
    if (!WorkDate == false) {
      this.mycondition = ` ${this.mycondition}&WorkDate=${WorkDate}`;
    }
    if (!SpeculateDate == false) {
      this.mycondition = ` ${this.mycondition}&SpeculateDate=${SpeculateDate}`;
    }



    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////


  ////////////////////////////////////////Fa-MoveFixedAsset///////////////////////////////////////
  getCcActivity() {
    return this.http.get<any>(`${this.url}/CcActivity/get/all`);
  }

  postFaMoveFixedAsset(data: any) {
    return this.http.post<any>(`${this.url}/FaMoveFixedAsset/Add`, data);
  }
  getFaMoveFixedAssetPaginate(currentPage: any, pageSize: any) {
    let urlPassed = `${this.url}/FaMoveFixedAsset/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  getFaMoveFixedAsset() {
    return this.http.get<any>(`${this.url}/FaMoveFixedAsset/get/all`);
  }
  putFaMoveFixedAsset(data: any) {
    return this.http.put<any>(`${this.url}/FaMoveFixedAsset/update`, data);
  }
  deleteFaMoveFixedAsset(id: number) {
    return this.http.delete<any>(`${this.url}/FaMoveFixedAsset/Delete/${id}`);
  }

  getFaMoveFixedAssetSearach(

    // Id: any, 
    Move_Type: any, Move_No: any, Description: any, Statement: any,
    Document_NO: any, Document_Date: any, Rate: any, CostCenterId: any, FixedAssetId: any,
    ActivityId: any
  ) {

    console.log(
      // "values search passed: 'Id: '", Id,
      "values search passed: ': '",
      "' Move_Type: '", Move_Type,
      "' Move_No: '", Move_No,
      "' Description: '", Description,
      "' Statement: '", Statement,
      "' Document_NO: '", Document_NO,
      "' Document_Date: '", Document_Date,
      "' Rate: '", Rate,
      "' CostCenterId: '", CostCenterId,
      "' FixedAssetId: '", FixedAssetId,
      "' ActivityId: '", ActivityId
    );
    this.mycondition = `${this.url}/FaMoveFixedAsset/search?`;


    // if (!Id == false) {
    //   this.mycondition = ` ${this.mycondition}&No=${Id}`;
    // }
    if (!Move_Type == false) {
      this.mycondition = ` ${this.mycondition}&Move_Type=${Move_Type}`;
    }
    if (!Move_No == false) {
      this.mycondition = ` ${this.mycondition}&Move_No=${Move_No}`;
    }
    if (!Description == false) {
      this.mycondition = ` ${this.mycondition}&Description=${Description}`;
    }
    if (!Statement == false) {
      this.mycondition = ` ${this.mycondition}&Statement=${Statement}`;
    }
    if (!Document_NO == false) {
      this.mycondition = ` ${this.mycondition}&Document_NO=${Document_NO}`;
    }
    if (!Document_Date == false) {
      this.mycondition = ` ${this.mycondition}&Document_Date=${Document_Date}`;
    }
    if (!Rate == false) {
      this.mycondition = ` ${this.mycondition}&Rate=${Rate}`;
    }
    if (!CostCenterId == false) {
      this.mycondition = ` ${this.mycondition}&CostCenterId=${CostCenterId}`;
    }
    if (!FixedAssetId == false) {
      this.mycondition = ` ${this.mycondition}&FixedAssetId=${FixedAssetId}`;
    }
    if (!ActivityId == false) {
      this.mycondition = ` ${this.mycondition}&ActivityId=${ActivityId}`;
    }



    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
  }
  //////////////////////////////////////////End////////////////////////////////////////////////

}