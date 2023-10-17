
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

  
}