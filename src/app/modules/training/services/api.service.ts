
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
 
}