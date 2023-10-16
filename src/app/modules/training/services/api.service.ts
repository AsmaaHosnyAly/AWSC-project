
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagesEnums } from 'src/app/core/enums/pages.enum';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  pageEnums = PagesEnums
  url =this.pageEnums.URL
  constructor(private http: HttpClient) { }



  /********************************  unit crud  **********************************/

  postTrInstructor(data: any) {
    return this.http.post<any>(`${this.url}/TrInstructor/Add`, data);
  }
  // here
  getTrInstructor() {
    return this.http.get<any>(`${this.url}/TrInstructor/get/all`);
  }
  putTrInstructor(data: any) {
    return this.http.put<any>(
      `${this.url}/TrInstructor/update`,
      data
    );
  }
  deleteTrInstructor(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrInstructor/Delete/${id}`
    );
  }
  getHrEmployees() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
  }
  
  getTrainingCenter() {
    return this.http.get<any>(`${this.url}/TrTrainingCenter/get/all`);
  }

  ////////////////////////////////trtrack//////////////////////////////////////////
  postTrTarck(data: any) {
    return this.http.post<any>(`${this.url}/TrTarck/Add`, data);
  }
  getTrTarck() {
    return this.http.get<any>(`${this.url}/TrTarck/get/all`);
  }
  putTrTarck(data: any) {
    return this.http.put<any>(`${this.url}/TrTarck/update`, data);
  }
  deleteTrTarck(id: number) {
    return this.http.delete<any>(`${this.url}/TrTarck/delete/` + id);
  }
  getTrTarckPaginate(currentPage: any, pageSize: any){

    console.log("currentt pagggeeeeee",currentPage)
    let urlPassed = `${this.url}/TrTarck/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }

  postTrTrackDetails(data: any) {
    return this.http.post<any>(`${this.url}/TrTrackDetails/Add`, data);
  }
  getTrTrackDetails() {
    return this.http.get<any>(`${this.url}/TrTrackDetails/get/all`);
  }
  getTrTrackDetailsByMasterId(id :any) {
    return this.http.get<any>(`${this.url}/TrTrackDetails/get/by/header/${id}`);
  }
  putTrTrackDetails(data: any) {
    console.log('put TrTrackDetails data with id: ', data);
    return this.http.put<any>(`${this.url}/TrTrackDetails/update/`, data);
  }
  deleteTrTrackDetails(HeaderId: number) {
    console.log('deleted row id: ', HeaderId);
    return this.http.delete<any>(
      `${this.url}/TrTrackDetails/delete/` + HeaderId
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
  getTrackById(id: any) {
    let urlPassed = `${this.url}/TrTarck/get/${id}`;
    return urlPassed;
  }

  getcourseById(id: any) {
    let urlPassed = `${this.url}/TrCourse/get/${id}`;
    return urlPassed;
  }
  getItems() {
    return this.http.get<any>(`${this.url}/STRItem/get/all`);
  }
  getEmployee() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
   
  }

  getTrCourse(){
    return this.http.get<any>(`${this.url}/TrCourse/get/all`);

  }
 
}