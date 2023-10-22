
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
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

  /********************************  Instructor crud  **********************************/

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

  postExternalInstructor(data: any) {
    console.log(
      'InstructorId33333dataaa: ',
      data
    );
    return this.http.post<any>(`${this.url}/TrInstructorData/Add`, data);
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
  getTrTarckPaginate(currentPage: any, pageSize: any) {

    console.log("currentt pagggeeeeee", currentPage)
    let urlPassed = `${this.url}/TrTarck/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }

  postTrTrackDetails(data: any) {
    return this.http.post<any>(`${this.url}/TrTrackDetails/Add`, data);
  }
  getTrTrackDetails() {
    return this.http.get<any>(`${this.url}/TrTrackDetails/get/all`);
  }
  getTrTrackDetailsByMasterId(id: any) {
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


  getTrTrackSearach(startDate: any, endDate: any, track: any, course: any) {
    console.log(
      "' startDate: '", startDate,
      "' endDate: '", endDate,

    );
    this.mycondition = `${this.url}/TrTrackDetails/search?`;



    if (!track == false) {
      this.mycondition = ` ${this.mycondition}&TrackId=${track}`;
    }
    if (!course == false) {
      this.mycondition = ` ${this.mycondition}&CourseId=${course}`;
    }



    if (!startDate == false) {
      this.mycondition = ` ${this.mycondition}&StartDate=${startDate}`;
    }
    if (!endDate == false) {
      this.mycondition = ` ${this.mycondition}&EndDate=${endDate}`;
    }





    console.log('url', this.mycondition);

    return this.http.get<any>(`${this.mycondition}`);
  }

  getLastFiscalYear() {
    return this.http.get<any>(
      `${this.url}/STRFiscalYear/get/Last/fisical/year`
    );
  }
  getFiscalYears() {
    return this.http.get<any>(
      `${this.url}/STRFiscalYear/get/all`
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

  getTrCourse() {
    return this.http.get<any>(`${this.url}/TrCourse/get/all`);

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
  getAllTrainingCenter() {
    return this.http.get<any>(`${this.url}/TrTrainingCenter/get/all`);
  }
  /********************************  TrCourseCategory crud  **********************************/

  postTrCourseCategory(data: any) {
    return this.http.post<any>(`${this.url}/TrCourseCategory/Add`, data);
  }
  // here
  getTrCourseCategory() {
    return this.http.get<any>(`${this.url}/TrCourseCategory/get/all`);
  }
  putTrCourseCategory(data: any) {
    return this.http.put<any>(
      `${this.url}/TrCourseCategory/update`,
      data
    );
  }
  deleteTrCourseCategory(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrCourseCategory/Delete/${id}`
    );
  }
  /********************************  TrCourseCategory crud  **********************************/

  postTrCoporteClient(data: any) {
    return this.http.post<any>(`${this.url}/TrCoporteClient/Add`, data);
  }
  // here
  getTrCoporteClient() {
    return this.http.get<any>(`${this.url}/TrCoporteClient/get/all`);
  }
  putTrCoporteClient(data: any) {
    return this.http.put<any>(
      `${this.url}/TrCoporteClient/update`,
      data
    );
  }
  deleteTrCoporteClient(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrCoporteClient/Delete/${id}`
    );
  }
  getAllCitis(): Observable<any> {
    return this.http.get<any>(`${this.url}/HrCity/get/all`);
  }

  /********************************  CourseType crud  **********************************/

  postCourseType(data: any) {
    return this.http.post<any>(`${this.url}/TrCourseType/Add`, data);
  }
  getCourseType() {
    return this.http.get<any>(`${this.url}/TrCourseType/get/all`);
  }
  putCourseType(data: any) {
    return this.http.put<any>(
      `${this.url}/TrCourseType/update`,
      data
    );
  }
  deleteCourseType(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrCourseType/Delete/${id}`
    );
  }

  /********************************  TrCourse crud  **********************************/

  postCourse(data: any) {
    return this.http.post<any>(`${this.url}/TrCourse/Add`, data);
  }
  getCourse() {
    return this.http.get<any>(`${this.url}/TrCourse/get/all`);
  }
  putCourse(data: any) {
    return this.http.put<any>(
      `${this.url}/TrCourse/update`,
      data
    );
  }
  deleteCourse(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrCourse/Delete/${id}`
    );

  }
  getAllCategory() {
    return this.http.get<any>(`${this.url}/TrCourseCategory/get/all `);
  }


  /********************************  TrInstructorCourse crud  **********************************/

  postTrainingCenter(data: any) {
    return this.http.post<any>(`${this.url}/TrTrainingCenter/Add`, data);
  }

  getTrainingCenter() {
    return this.http.get<any>(`${this.url}/TrTrainingCenter/get/all`);
  }

  putTrainingCenter(data: any) {
    return this.http.put<any>(
      `${this.url}/TrTrainingCenter/update`,
      data
    );
  }
  deleteTrainingCenter(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrTrainingCenter/Delete/${id}`
    );

  }

  getAllCities() {
    return this.http.get<any>(`${this.url}/HrCity/get/all`);
  }

  /********************************  TrInstructorCourse crud  **********************************/

  postInstructorCourse(data: any) {
    return this.http.post<any>(`${this.url}/TrInstructorCourse/Add`, data);
  }
  getInstructorCourse() {
    return this.http.get<any>(`${this.url}/TrInstructorCourse/get/all`);
  }
  putInstructorCourse(data: any) {
    return this.http.put<any>(
      `${this.url}/TrInstructorCourse/update`,
      data
    );
  }
  deleteInstructorCourse(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrInstructorCourse/Delete/${id}`
    );

  }

  /////////////////////////////////////// TrTrainee ////////////////////////////////////////

  postTrTrainee(data: any) {
    return this.http.post<any>(`${this.url}/TrTrainee/Add`, data);
  }
  getTrTrainee() {
    return this.http.get<any>(`${this.url}/TrTrainee/get/all`);
  }
  putTrTrainee(data: any) {
    return this.http.put<any>(`${this.url}/TrTrainee/update`, data);
  }
  deleteTrTrainee(id: number) {
    return this.http.delete<any>(`${this.url}/TrTrainee/Delete/${id}`);
  }
  /******************************** TrTrainingCenterCourse **********************************/
  postTrainingCenterCourse(data: any) {
    return this.http.post<any>(`${this.url}/TrTrainingCenterCourse/Add`, data);
  }
  // here
  getTrainingCenterCourse() {
    return this.http.get<any>(`${this.url}/TrTrainingCenterCourse/get/all`);
  }
  putTrainingCenterCourse(data: any) {
    return this.http.put<any>(
      `${this.url}/TrTrainingCenterCourse/update`,
      data
    );
  }
  deleteTrainingCenterCourse(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrTrainingCenterCourse/Delete/${id}`
    );
  }
  getAllCourse() {
    return this.http.get<any>(`${this.url}/TrCourse/get/all`);
  }
  getAllTrainingCenterr() {
    return this.http.get<any>(`${this.url}/TrTrainingCenter/get/all`);
  }


  //////////////////// Tr-Plan & TrPlanFinancier & TrPlanInstructor & TrPlanPosition ///////////////////
  getPurpose() {
    return this.http.get<any>(`${this.url}/TrPurpose/get/all`);
  }

  getFinancialDegree() {
    return this.http.get<any>(`${this.url}/HrFinancialDegree/get/all`);
  }


  postTrPlan(data: any) {
    return this.http.post<any>(`${this.url}/TrPlan/Add`, data);
  }
  getTrPlan() {
    return this.http.get<any>(`${this.url}/TrPlan/get/all`);
  }
  // getPyItemGroupPaginate(currentPage: any, pageSize: any) {
  //   let urlPassed = `${this.url}/PyItemGroup/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
  //   return urlPassed;
  // }
  putTrPlan(data: any) {
    return this.http.put<any>(`${this.url}/TrPlan/update`, data);
  }
  deleteTrPlan(id: number) {
    return this.http.delete<any>(`${this.url}/TrPlan/Delete/` + id);
  }


  // postPyItemGroupDetails(data: any) {
  //   return this.http.post<any>(`${this.url}/PyItemGroupDetails/Add`, data);
  // }
  // getPyItemGroupDetails() {
  //   return this.http.get<any>(`${this.url}/PyItemGroupDetails/get/all`);
  // }
  // getPyItemGroupDetailsByHeaderId(id: any) {
  //   return this.http.get<any>(`${this.url}/PyItemGroupDetails/get/by/header/${id}`);
  // }
  // putPyItemGroupDetails(data: any) {
  //   return this.http.put<any>(`${this.url}/PyItemGroupDetails/update`, data);
  // }
  // deletePyItemGroupDetails(id: number) {
  //   return this.http.delete<any>(`${this.url}/PyItemGroupDetails/delete/` + id);
  // }

  // postPyItemGroupEmployee(data: any) {
  //   return this.http.post<any>(`${this.url}/PyItemGroupEmployee/Add`, data);
  // }
  // getPyItemGroupEmployee() {
  //   return this.http.get<any>(`${this.url}/PyItemGroupEmployee/get/all`);
  // }
  // getPyItemGroupEmployeeByHeaderId(id: any) {
  //   return this.http.get<any>(`${this.url}/PyItemGroupEmployee/get/by/header/${id}`);
  // }
  // putPyItemGroupEmployee(data: any) {
  //   return this.http.put<any>(`${this.url}/PyItemGroupEmployee/update`, data);
  // }
  // deletePyItemGroupEmployee(id: number) {
  //   return this.http.delete<any>(`${this.url}/PyItemGroupEmployee/delete/` + id);
  // }
  //////////////////////////////////////////////////////////////////////////////
}