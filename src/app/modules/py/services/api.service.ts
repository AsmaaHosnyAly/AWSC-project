
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

  mycondition: any;
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
  

  ////////py exchange///////

  postPyExchange(data: any) {
    return this.http.post<any>(`${this.url}/PyExchange/Add`, data);
  }
  getPyExchange() {
    return this.http.get<any>(`${this.url}/PyExchange/get/all`);
  }
  putPyExchange(data: any) {
    return this.http.put<any>(`${this.url}/PyExchange/update`, data);
  }
  deletePyExchange(id: number) {
    return this.http.delete<any>(`${this.url}/PyExchange/delete/` + id);
  }
  getPyExchangePaginate(currentPage: any, pageSize: any){

    console.log("currentt pagggeeeeee",currentPage)
    let urlPassed = `${this.url}/PyExchange/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  getFiEntrySearach(no: any,name:any,  startDate: any, endDate: any) {
    console.log(
      "values search passed: 'no: '", no,
      "' startDate: '", startDate,
      "' endDate: '", endDate,
   
    );
    this.mycondition = `${this.url}/FIEntry/search?`;


    if (!no == false) {
      this.mycondition = ` ${this.mycondition}&No=${no}`;
    }
    if (!name == false) {
      this.mycondition = ` ${this.mycondition}&name=${name}`;
    }
    // if (!employee == false) {
    //   this.mycondition = ` ${this.mycondition}&employee=${employee}`;
    // }
    // if (!item == false) {
    //   this.mycondition = ` ${this.mycondition}&item=${item}`;
    // }
    
   
   
    if (!startDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${startDate}`;
    }
    if (!endDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${endDate}`;
    }
   
   
   


    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
  }

  postPyExchangeDetails(data: any) {
    return this.http.post<any>(`${this.url}/PyExchangeDetails/Add`, data);
  }
  getPyExchangeDetails() {
    return this.http.get<any>(`${this.url}/PyExchangeDetails/get/all`);
  }
  getPyExchangeDetailsByMasterId(id :any) {
    return this.http.get<any>(`${this.url}/PyExchangeDetails/get/By/header/${id}`);
  }
  putPyExchangeDetails(data: any) {
    console.log('put PyExchangeDetails data with id: ', data);
    return this.http.put<any>(`${this.url}/PyExchangeDetails/update/`, data);
  }
  deletePyExchangeDetails(HeaderId: number) {
    console.log('deleted row id: ', HeaderId);
    return this.http.delete<any>(
      `${this.url}/PyExchangeDetails/delete/` + HeaderId
    );
  }







  getLastFiscalYear() {
    return this.http.get<any>(
      `${this.url}/STRFiscalYear/getLastfisicalyear/all`
    );
  }

  getFiscalYearById(id: any) {
    return this.http.get<any>(`${this.url}/STRFiscalYear/get/${id}`);
  }
  getItemById(id: any) {
    let urlPassed = `${this.url}/STRItem/get/${id}`;
    return urlPassed;
  }
  getItems() {
    return this.http.get<any>(`${this.url}/STRItem/get/all`);
  }
  getEmployee() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
   
  }


    ///////////////////////////////// Py-Item /////////////////////////////
    postPyItem(data: any) {
      return this.http.post<any>(`${this.url}/PyItem/Add`, data);
    }
    getPyItem() {
      return this.http.get<any>(`${this.url}/PyItem/get/all`);
    }
    putPyItem(data: any) {
      return this.http.put<any>(`${this.url}/PyItem/update`, data);
    }
    deletePyItem(id: number) {
      return this.http.delete<any>(`${this.url}/PyItem/delete/` + id);
    }
  
    getAllCategory() {
      return this.http.get<any>(`${this.url}/PyItemCategory/get/all`);
    }


  /////////////////////// Py-ItemGroup & ItemGroupDetails & ItemGroupEmployee ///////////////////////
  postPyItemGroup(data: any) {
    return this.http.post<any>(`${this.url}/PyItemGroup/Add`, data);
  }
  getPyItemGroup() {
    return this.http.get<any>(`${this.url}/PyItemGroup/get/all`);
  }
  putPyItemGroup(data: any) {
    return this.http.put<any>(`${this.url}/PyItemGroup/update`, data);
  }
  deletePyItemGroup(id: number) {
    return this.http.delete<any>(`${this.url}/PyItemGroup/delete/` + id);
  }


  postPyItemGroupDetails(data: any) {
    return this.http.post<any>(`${this.url}/PyItemGroupDetails/Add`, data);
  }
  getPyItemGroupDetails() {
    return this.http.get<any>(`${this.url}/PyItemGroupDetails/get/all`);
  }
  putPyItemGroupDetails(data: any) {
    return this.http.put<any>(`${this.url}/PyItemGroupDetails/update`, data);
  }
  deletePyItemGroupDetails(id: number) {
    return this.http.delete<any>(`${this.url}/PyItemGroupDetails/delete/` + id);
  }

  // getAllpyItems() {
  //   return this.http.get<any>(`${this.url}/PyItem/get/all`);
  // }

}
