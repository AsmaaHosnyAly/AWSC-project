
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
  mycondition:any;
  /************Hr-attendence-permission crud*******************/

  postHrAttendancePermission(data: any) {
    return this.http.post<any>(`${this.url}/HrAttendancePermission/Add`, data);
  }
 
  getHrAttendancePermission() {
    return this.http.get<any>(`${this.url}/HrAttendancePermission/get/all`);
  }
  putHrAttendancePermission(data: any) {
    return this.http.put<any>(
      `${this.url}/HrAttendancePermission/update`,
      data
    );
  }
  deleteHrAttendancePermission(id: number) {
    return this.http.delete<any>(
      `${this.url}/HrAttendancePermission/delete/${id}`
    );
  }
  /************Hr-Employee-attendence-permission crud*******************/

  postHrEmployeeAttendancePermission(data: any) {
    return this.http.post<any>(`${this.url}/HrEmployeeAttendancePermission/Add`, data);
  }
 
  getHrEmployeeAttendancePermission() {
    return this.http.get<any>(`${this.url}/HrEmployeeAttendancePermission/get/all`);
  }
  putHrEmployeeAttendancePermission(data: any) {
    return this.http.put<any>(
      `${this.url}/HrEmployeeAttendancePermission/update`,
      data
    );
  }
  deleteHrEmployeeAttendancePermission(id: number) {
    return this.http.delete<any>(
      `${this.url}/HrEmployeeAttendancePermission/delete/${id}`
    );
  }
  getEmployees() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);
  }
   /************Hr-Employee-attendence- crud*******************/

   postHrEmployeeAttendance(data: any) {
    return this.http.post<any>(`${this.url}/HrEmployeeAttendance/Add`, data);
  }
 
  getHrEmployeeAttendance() {
    return this.http.get<any>(`${this.url}/HrEmployeeAttendance/get/all`);
  }
  putHrEmployeeAttendance(data: any) {
    return this.http.put<any>(
      `${this.url}/HrEmployeeAttendance/update`,
      data
    );
  }
  deleteHrEmployeeAttendance(id: number) {
    return this.http.delete<any>(
      `${this.url}/HrEmployeeAttendance/delete/${id}`
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
  getEmployee() {
    return this.http.get<any>(`${this.url}/HREmployee/get/all`);

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

  ///////////////////////////////// Hr-AttendanceSchedule /////////////////////////////
  postHrAttendanceSchedule(data: any) {
    return this.http.post<any>(`${this.url}/HrAttendanceSchedule/Add`, data);
  }
  getHrAttendanceSchedule() {
    return this.http.get<any>(`${this.url}/HrAttendanceSchedule/get/all`);
  }
  putHrAttendanceSchedule(data: any) {
    return this.http.put<any>(`${this.url}/HrAttendanceSchedule/update`, data);
  }
  deleteAttendanceSchedule(id: number) {
    return this.http.delete<any>(`${this.url}/HrAttendanceSchedule/delete/` + id);
  }

  ///////////////////////attendace reports//////////////////////////
  getAccountreports(
  
    StartDate: any, EndDate: any,account: any, report: any, reportType: any
  ) {
    console.log(
     
     
      'startdate: ',
      StartDate,'account',account,
     
      'reportName:', report, 'reportType:', reportType
  
    );
    `${this.url}/FIAccount/get/Report?`;
    this.mycondition = `${this.url}/FIAccount/get/Report?reportName=${report}&reportType=${reportType}`;
  
    
   
  
  
    if (!StartDate == false) {
      this.mycondition = ` ${this.mycondition}&startDate=${StartDate}`;
    }
    if (!EndDate == false) {
      this.mycondition = ` ${this.mycondition}&endDate=${EndDate}`;
    }
  
   
    if (!account == false) {
      this.mycondition = ` ${this.mycondition}&accountId=${account}`;
    }
    
    
  
    console.log('url', this.mycondition);
  
    // return this.http.get<any>(`${this.mycondition}`);
    return this.http.get(`${this.mycondition}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}

