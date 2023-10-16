
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
  /********************************  classroom  **********************************/
  postClassRoom(data: any) {
    return this.http.post<any>(`${this.url}/TrClassRoom/Add`, data);
  }
  // here
  getClassRoom() {
    return this.http.get<any>(`${this.url}/TrClassRoom/get/all`);
  }
  putClassRoom(data: any) {
    return this.http.put<any>(
      `${this.url}/TrClassRoom/update`,
      data
    );
  }
  deleteClassRoom(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrClassRoom/Delete/${id}`
    );
  }
  getAllCityState() {
    return this.http.get<any>(`${this.url}/HrCityState/get/all`);
  }
  getAllTrainingCenter(){
    return this.http.get<any>(`${this.url}/TrTrainingCenter/get/all`);
  }
}