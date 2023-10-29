import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/pages/services/global.service'; 

import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';

import { TrTrainingCenterCourseDialogComponent } from '../tr-training-center-course-dialog/tr-training-center-course-dialog.component';
export class course {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}
export class traingingCenter {
  constructor(public id: number, public name: string,public global:GlobalService) {
   
  }
}
@Component({
  selector: 'app-tr-plan-course-data',
  templateUrl: './tr-plan-course-data.component.html',
  styleUrls: ['./tr-plan-course-data.component.css']
})
export class TrPlanCourseDataComponent{

  courseCtrl: FormControl;
  filteredCourses: Observable<course[]>;
  courses: course[] = [];
  selectedCourse!: course;
  traingingCenterCtrl: FormControl;
  filteredTraingingCenteres: Observable<traingingCenter[]>;
  traingingCenteres: traingingCenter[] = [];
  selectedTraingingCenter!: traingingCenter;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [ 'code','courseName','positionName','price','notes' , 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog,private toastr: ToastrService, private api: ApiService,private global:GlobalService,private hotkeysService: HotkeysService) {
    this.courseCtrl = new FormControl();
    global.getPermissionUserRoles(4, 'stores', ' الإدارة العامة للتدريب', '')
    this.filteredCourses = this.courseCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCourses(value))
    );
    this.traingingCenterCtrl = new FormControl();
    this.filteredTraingingCenteres = this.traingingCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTraingingCenteres(value))
    );
    global.getPermissionUserRoles(4, 'stores', ' الموديل', '')
  }
  ngOnInit(): void {
    // console.log(productForm)
    
    this.getAllTraining();
    this.api.getAllCourse().subscribe((courses) => {
      this.courses = courses;
    });
    this.api.getAllTrainingCenter().subscribe((traingingCenteres) => {
      this.traingingCenteres = traingingCenteres;
    });
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog
      .open(TrTrainingCenterCourseDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllTraining();
        }
      });
  }

  displayCourseName(course: any): string {
    return course && course.name ? course.name : '';
  }
  courseSelected(event: MatAutocompleteSelectedEvent): void {
    const course = event.option.value as course;
    this.selectedCourse = course;
    this.gradeForm.patchValue({ courseId: course.id });
    this.gradeForm.patchValue({ courseName: course.name });
  }
  private _filterCourses(value: string): course[] {
    const filterValue = value.toLowerCase();
    return this.courses.filter(course =>
      course.name.toLowerCase().includes(filterValue) 
    );
  }
  displayTrainingCenterName(trainingCenter: any): string {
    return trainingCenter && trainingCenter.name ? trainingCenter.name : '';
  }
  traingingCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const traingingCenter = event.option.value as traingingCenter;
    this.selectedTraingingCenter = traingingCenter;
    this.gradeForm.patchValue({ traingingCenterId: traingingCenter.id });
    this.gradeForm.patchValue({ traingingCenterName: traingingCenter.name });
  }
  private _filterTraingingCenteres(value: string): traingingCenter[] {
    const filterValue = value.toLowerCase();
    return this.traingingCenteres.filter(traingingCenter =>
      traingingCenter.name.toLowerCase().includes(filterValue) 
    );
  }
  getAllTraining() {
    this.api.getTrainingCenterCourse().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  editClassRoom(row: any) {
    this.dialog
      .open(TrTrainingCenterCourseDialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllTraining();
        }
      });
  }

  deleteClassRoom(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteTrainingCenterCourse(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllTraining();

        }else{
          alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
        }
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
  }
  

  openAutoCourse() {
    this.courseCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.courseCtrl.updateValueAndValidity();
  }
  openAutoTraingingCenter() {
    this.traingingCenterCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.traingingCenterCtrl.updateValueAndValidity();
  }
  // async getSearchModels(name: any) {
  //   this.api.getModel().subscribe({
  //     next: (res) => {
        //enter id
        // if (this.selectedVendor && name == '') {
        //   console.log('filter ID id: ', this.selectedVendor, 'name: ', name);

        //   this.dataSource = res.filter(
        //     (res: any) => res.vendorId == this.selectedVendor.id!
        //   );
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // }
        //enter both
        // else if (this.selectedVendor && name != '') {
        //   console.log('filter both id: ', this.selectedVendor, 'name: ', name);

        //   // this.dataSource = res.filter((res: any)=> res.name==name!)
        //   this.dataSource = res.filter(
        //     (res: any) =>
        //       res.vendorId == this.selectedVendor.id! &&
        //       res.name.toLowerCase().includes(name.toLowerCase())
        //   );
        //   this.dataSource.paginator = this.paginator;
        //   this.dataSource.sort = this.sort;
        // }
        //enter name
        // else {
        //   console.log('filter name id: ', this.selectedVendor, 'name: ', name);
          // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
      //     this.dataSource = res.filter((res: any) =>
      //       res.name.toLowerCase().includes(name.toLowerCase())
      //     );
      //     this.dataSource.paginator = this.paginator;
      //     this.dataSource.sort = this.sort;
      //   }
      // },
    //   error: (err) => {
    //     alert('Error');
    //   },
    // });
    // this.getAllProducts()
  // }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}


