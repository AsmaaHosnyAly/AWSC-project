
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
  constructor(private http: HttpClient) {}


  ///////////////////////////////// HR-AttendanceMachine /////////////////////////////
  postHrAttendanceMachine(data: any) {
    return this.http.post<any>(`${this.url}/HrAttendanceMachine/Add`, data);
  }
  getHrAttendanceMachine() {
    return this.http.get<any>(`${this.url}/HrAttendanceMachine/get/all`);
  }
  putHrAttendanceMachine(data: any) {
    return this.http.put<any>(`${this.url}/HrAttendanceMachine/update`, data);
  }
  deleteHrAttendanceMachine(id: number) {
    return this.http.delete<any>(`${this.url}/HrAttendanceMachine/delete/` + id);
  }
}
