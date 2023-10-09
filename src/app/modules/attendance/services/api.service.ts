
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

  ///////////////////////////////// HR-AttendanceMachineWorkPlace /////////////////////////////
  postHrAttendanceMachineWorkPlace(data: any) {
    return this.http.post<any>(`${this.url}/HrAttendanceMachineWorkPlace/Add`, data);
  }
  getHrAttendanceMachineWorkPlace() {
    return this.http.get<any>(`${this.url}/HrAttendanceMachineWorkPlace/get/all`);
  }
  putHrAttendanceMachineWorkPlace(data: any) {
    return this.http.put<any>(`${this.url}/HrAttendanceMachineWorkPlace/update`, data);
  }
  deleteHrAttendanceMachineWorkPlace(id: number) {
    return this.http.delete<any>(`${this.url}/HrAttendanceMachineWorkPlace/delete/` + id);
  }

  getHrWorkPlace() {
    return this.http.get<any>(`${this.url}/HrWorkPlace/get/all`);
  }


  ///////////////////////////////// Hr-EmployeeAttendanceSchedule /////////////////////////////
  postHrEmployeeAttendanceSchedule(data: any) {
    return this.http.post<any>(`${this.url}/HrEmployeeAttendanceSchedule/Add`, data);
  }
  getHrEmployeeAttendanceSchedule() {
    return this.http.get<any>(`${this.url}/HrEmployeeAttendanceSchedule/get/all`);
  }
  putHrEmployeeAttendanceSchedule(data: any) {
    return this.http.put<any>(`${this.url}/HrEmployeeAttendanceSchedule/update`, data);
  }
  deleteHrEmployeeAttendanceSchedule(id: number) {
    return this.http.delete<any>(`${this.url}/HrEmployeeAttendanceSchedule/delete/` + id);
  }
  getAllEmployees() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
  }
  getAllAttendanceSchedules() {
    return this.http.get<any>(`${this.url}/HrAttendanceSchedule/get/all`);
  }
}

