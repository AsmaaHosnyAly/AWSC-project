
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
  
  getTrainingCenter() {
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
      
}