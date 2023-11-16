import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
  constructor(public id: number, public name: string, public global: GlobalService) { }
}
export class traingingCenter {
  constructor(public id: number, public name: string, public global: GlobalService) { }
}

interface TrTrainingCenterCourse {
  traingingCenterName: any;
  courseName: any;
  rating: any;
  price: any;
  notes: any;
  action: any;
}

@Component({
  selector: 'app-tr-training-center-course',
  templateUrl: './tr-training-center-course.component.html',
  styleUrls: ['./tr-training-center-course.component.css']
})
export class TrTrainingCenterCourseComponent {
  ELEMENT_DATA: TrTrainingCenterCourse[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<TrTrainingCenterCourse> = new MatTableDataSource();

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
  displayedColumns: string[] = ['traingingCenterName', 'courseName', 'rating', 'price', 'notes', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog, private toastr: ToastrService, private api: ApiService, private global: GlobalService, private hotkeysService: HotkeysService) {
    this.courseCtrl = new FormControl();
    this.filteredCourses = this.courseCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCourses(value))
    );
    this.traingingCenterCtrl = new FormControl();
    this.filteredTraingingCenteres = this.traingingCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTraingingCenteres(value))
    );
    global.getPermissionUserRoles('IT', '', 'الإدارة العامة للتدريب', 'supervised_user_circle')
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
    // this.api.getTrainingCenterCourse().subscribe({
    //   next: (res) => {
    //     this.dataSource = new MatTableDataSource(res);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   },
    //   error: (err) => {
    //     alert('Error');
    //   },
    // });

    if (!this.currentPage) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getTrTrainingCenterCoursePaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
          this.dataSource.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }
    else {
      // this.isLoading = true;
      fetch(this.api.getTrTrainingCenterCoursePaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate: ", data);
          this.dataSource.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }

  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllTraining();
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
          if (res == 'Succeeded') {
            console.log("res of deletestore:", res)
            this.toastrDeleteSuccess();
            this.getAllTraining();

          } else {
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


