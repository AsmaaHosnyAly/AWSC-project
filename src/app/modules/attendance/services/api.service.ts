
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
  
  /************Hr-attendence-permission crud*******************/

  postHrAttendancePermission(data: any) {
    return this.http.post<any>(`${this.url}/STRUnit/Add`, data);
  }
 
  getHrAttendancePermission() {
    return this.http.get<any>(`${this.url}/HrAttendancePermission/get/all`);
  }
  putHrAttendancePermission(data: any) {
    return this.http.put<any>(
      `${this.url}/STRUnit/update`,
      data
    );
  }
  deleteHrAttendancePermission(id: number) {
    return this.http.delete<any>(
      `${this.url}/STRUnit/delete/${id}`
    );
  }

}
