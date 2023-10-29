
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
    // return this.http.get<any>(`${this.url}/TrInstructorData/get/all`);
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

  deleteTrEtrInstructor(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrInstructorData/Delete/${id}`
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

  putExternalInstructor(data: any) {
    return this.http.put<any>(
      `${this.url}/TrInstructorData/update`,
      data
    );
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
    console.log("post details data:", data)
    return this.http.post<any>(`${this.url}/TrTrackDetails/Add`, data);
  }
  getTrTrackDetails() {
    return this.http.get<any>(`${this.url}/TrTrackDetails/get/all`);
  }
  getTrTrackDetailsByMasterId(id: any) {
    return this.http.get<any>(`${this.url}/TrTrackDetails/get/by/header/${id}`);
  }
  putTrTrackDetails(data: any) {
    console.log('put TrTrackDetails data: ', data);
    return this.http.put<any>(`${this.url}/TrTrackDetails/update`, data);
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
    console.log("data in post trainee dialog:", data)
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

  //////////////////// Tr-Plan & TrPlanFinancier & TrPlanInstructor & TrPlanPosition ///////////////////
  getFinancialDegree() {
    return this.http.get<any>(`${this.url}/HrFinancialDegree/get/all`);
  }
  getHrPosition() {
    return this.http.get<any>(`${this.url}/HrPosition/get/all`);
  }
  getTrFinancial() {
    return this.http.get<any>(`${this.url}/TrFinancier/get/all`);
  }

  postTrPlan(data: any) {
    return this.http.post<any>(`${this.url}/TrPlan/Add`, data);
  }
  getTrPlan() {
    return this.http.get<any>(`${this.url}/TrPlan/get/all`);
  }
  getTrPlanPaginate(currentPage: any, pageSize: any) {
    let urlPassed = `${this.url}/TrPlan/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
    return urlPassed;
  }
  putTrPlan(data: any) {
    return this.http.put<any>(`${this.url}/TrPlan/update`, data);
  }
  deleteTrPlan(id: number) {
    return this.http.delete<any>(`${this.url}/TrPlan/Delete/` + id);
  }


  postTrPlanFinancier(data: any) {
    return this.http.post<any>(`${this.url}/TrPlanFinancier/Add`, data);
  }
  getTrPlanFinancier() {
    return this.http.get<any>(`${this.url}/TrPlanFinancier/get/all`);
  }
  getTrPlanFinancierDetailsByHeaderId(id: any) {
    return this.http.get<any>(`${this.url}/TrPlanFinancier/get/by/header/${id}`);
  }
  putTrPlanFinancier(data: any) {
    return this.http.put<any>(`${this.url}/TrPlanFinancier/update`, data);
  }
  deleteTrPlanFinancier(id: number) {
    return this.http.delete<any>(`${this.url}/TrPlanFinancier/Delete/` + id);
  }


  postTrPlanInstructor(data: any) {
    return this.http.post<any>(`${this.url}/TrPlanInstructor/Add`, data);
  }
  getTrPlanInstructor() {
    return this.http.get<any>(`${this.url}/TrPlanInstructor/get/all`);
  }
  getTrInstructorByHeaderId(id: any) {
    return this.http.get<any>(`${this.url}/TrPlanInstructor/get/Instructors/By/Plan/${id}`);
  }
  putTrPlanInstructor(data: any) {
    return this.http.put<any>(`${this.url}/TrPlanInstructor/update`, data);
  }
  deleteTrPlanInstructor(id: number) {
    return this.http.delete<any>(`${this.url}/TrPlanInstructor/Delete/` + id);
  }


  postTrPlanPosition(data: any) {
    return this.http.post<any>(`${this.url}/TrPlanPosition/Add`, data);
  }
  getTrPlanPosition() {
    return this.http.get<any>(`${this.url}/TrPlanPosition/get/all`);
  }
  getTrPlanPositionByHeaderId(id: any) {
    return this.http.get<any>(`${this.url}/TrPlanPosition/get/by/header/${id}`);
  }
  putTrPlanPosition(data: any) {
    return this.http.put<any>(`${this.url}/TrPlanPosition/update`, data);
  }
  deleteTrPlanPosition(id: number) {
    return this.http.delete<any>(`${this.url}/TrPlanPosition/Delete/` + id);
  }
  //////////////////////////////////////////////////////////////////////////////


  ////// Tr-Excuted & TrExcutedFinancier & TrExcutedInstructor & TrExcutedPosition & TrExcutedTrainee ////////
  postTrExcuted(data: any) {
    return this.http.post<any>(`${this.url}/TrExcuted/Add`, data);
  }
  getTrExcuted() {
    return this.http.get<any>(`${this.url}/TrExcuted/get/all`);
  }
  // getPyItemGroupPaginate(currentPage: any, pageSize: any) {
  //   let urlPassed = `${this.url}/PyItemGroup/get/by/pagination?page=${currentPage}&pageSize=${pageSize}`;
  //   return urlPassed;
  // }
  putTrExcuted(data: any) {
    return this.http.put<any>(`${this.url}/TrExcuted/update`, data);
  }
  deleteTrExcuted(id: number) {
    return this.http.delete<any>(`${this.url}/TrExcuted/Delete/` + id);
  }


  postTrExcutedFinancier(data: any) {
    return this.http.post<any>(`${this.url}/TrExcutedFinancier/Add`, data);
  }
  getTrExcutedFinancier() {
    return this.http.get<any>(`${this.url}/TrExcutedFinancier/get/all`);
  }
  // getTrExcutedFinancierDetailsByHeaderId(id: any) {
  //   return this.http.get<any>(`${this.url}/TrPlanFinancier/get/by/header/${id}`);
  // }
  putTrExcutedFinancier(data: any) {
    return this.http.put<any>(`${this.url}/TrExcutedFinancier/update`, data);
  }
  deleteTrExcutedFinancier(id: number) {
    return this.http.delete<any>(`${this.url}/TrExcutedFinancier/Delete/` + id);
  }


  postTrExcutedInstructor(data: any) {
    return this.http.post<any>(`${this.url}/TrExcutedInstructor/Add`, data);
  }
  getTrExcutedInstructor() {
    return this.http.get<any>(`${this.url}/TrExcutedInstructor/get/all`);
  }
  // getTrInstructorByHeaderId(id: any) {
  //   return this.http.get<any>(`${this.url}/TrPlanInstructor/get/Instructors/By/Plan/${id}`);
  // }
  putTrExcutedInstructor(data: any) {
    return this.http.put<any>(`${this.url}/TrExcutedInstructor/update`, data);
  }
  deleteTrExcutedInstructor(id: number) {
    return this.http.delete<any>(`${this.url}/TrExcutedInstructor/Delete/` + id);
  }


  postTrExcutedPosition(data: any) {
    return this.http.post<any>(`${this.url}/TrExcutedPosition/Add`, data);
  }
  getTrExcutedPosition() {
    return this.http.get<any>(`${this.url}/TrExcutedPosition/get/all`);
  }
  getTrExcutedPositionByHeaderId(id: any) {
    return this.http.get<any>(`${this.url}/TrExcutedPosition/get/By/Header/${id}`);
  }
  putTrExcutedPosition(data: any) {
    return this.http.put<any>(`${this.url}/TrExcutedPosition/update`, data);
  }
  deleteTrExcutedPosition(id: number) {
    return this.http.delete<any>(`${this.url}/TrExcutedPosition/Delete/` + id);
  }


  postTrExcutedTrainee(data: any) {
    return this.http.post<any>(`${this.url}/TrExcutedTrainee/Add`, data);
  }
  getTrExcutedTrainee() {
    return this.http.get<any>(`${this.url}/TrExcutedTrainee/get/all`);
  }
  getTrExcutedTraineeByHeaderId(id: any) {
    return this.http.get<any>(`${this.url}/TrExcutedTrainee/get/By/Header/${id}`);
  }
  putTrExcutedTrainee(data: any) {
    return this.http.put<any>(`${this.url}/TrExcutedTrainee/update`, data);
  }
  deleteTrExcutedTrainee(id: number) {
    return this.http.delete<any>(`${this.url}/TrExcutedTrainee/Delete/` + id);
  }

  //////////////////////////////////////////////////////////////////////////////


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


  /////city///
  gethrCity() {
    return this.http.get<any>(`${this.url}/HrCity/get/all`);
  }
  gethrCityState() {
    return this.http.get<any>(`${this.url}/HrCityState/get/all`);
  }
  /********************************  trPurpose  **********************************/

  postPurpose(data: any) {
    return this.http.post<any>(`${this.url}/TrPurpose/Add`, data);
  }
  getPurpose() {
    return this.http.get<any>(`${this.url}/TrPurpose/get/all`);
  }
  putPurpose(data: any) {
    return this.http.put<any>(
      `${this.url}/TrPurpose/update`,
      data
    );
  }
  deletePurpose(id: number) {
    return this.http.delete<any>(
      `${this.url}/TrPurpose/Delete/${id}`
    );
  }
}