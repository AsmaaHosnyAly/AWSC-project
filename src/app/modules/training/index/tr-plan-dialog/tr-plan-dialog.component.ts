import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/pages/services/global.service';
import { Router, Params } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TrPlanInstructorDetailsDialogComponent } from '../tr-plan-instructor-details-dialog/tr-plan-instructor-details-dialog.component';
import { TrPlanPositionDetailsDialogComponent } from '../tr-plan-position-details-dialog/tr-plan-position-details-dialog.component';
import { TrPlanFinancierDetailsDialogComponent } from '../tr-plan-financier-details-dialog/tr-plan-financier-details-dialog.component';

// export class PyItem {
//   constructor(public id: number, public name: string) { }
// }

export class TrainingCenter {
  constructor(public id: number, public name: string) { }
}

export class ClassRoom {
  constructor(public id: number, public name: string) { }
}

export class Course {
  constructor(public id: number, public name: string) { }
}

export class Purpose {
  constructor(public id: number, public name: string) { }
}

export class FinancialDegree {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-tr-plan-dialog',
  templateUrl: './tr-plan-dialog.component.html',
  styleUrls: ['./tr-plan-dialog.component.css']
})
export class TrPlanDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  groupDetailsForm!: FormGroup;
  groupMasterForm!: FormGroup;
  actionBtnMaster: string = 'Save';
  actionBtnDetails: string = 'Save';
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  // dataSourceEmployee!: MatTableDataSource<any>;
  dataSourceInstructor!: MatTableDataSource<any>;
  dataSourcePosition!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  sumOfCreditTotals = 0;
  sumOfDebitTotals = 0;
  resultOfBalance = 0;

  getMasterRowId: any;
  getDetailsRowId: any;
  journalsList: any;
  sourcesList: any;
  accountsList: any;
  accountItemsList: any;
  employeesList: any;
  distEmployeesList: any;
  costCentersList: any;
  itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;
  test: any;
  testMain: any;

  currentDate: any;
  defaultFiscalYearSelectValue: any;

  displayedColumns: string[] = ['financierName', 'action'];
  // displayedEmployeesColumns: string[] = ['instructorId', 'action'];
  displayedInstructorsColumns: string[] = ['instructorName', 'action'];
  displayedPositionsColumns: string[] = ['positionName', 'action'];

  sessionId = Math.random();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // trainingCentersList: any;
  trainingCentersList: TrainingCenter[] = [];
  trainingCenterCtrl: FormControl;
  filteredTrainingCenter: Observable<TrainingCenter[]>;
  selectedTrainingCenter: TrainingCenter | undefined;
  // classRoomsList: any;
  classRoomsList: ClassRoom[] = [];
  classRoomCtrl: FormControl;
  filteredClassRoom: Observable<ClassRoom[]>;
  selectedClassRoom: ClassRoom | undefined;
  // coursesList: any;
  coursesList: Course[] = [];
  courseCtrl: FormControl;
  filteredCourse: Observable<Course[]>;
  selectedCourse: Course | undefined;
  // purposesList: any;
  purposesList: Purpose[] = [];
  purposeCtrl: FormControl;
  filteredPurpose: Observable<Purpose[]>;
  selectedPurpose: Purpose | undefined;
  // financialDegreesList: any;
  financialDegreesList: FinancialDegree[] = [];
  financialDegreeCtrl: FormControl;
  filteredFinancialDegree: Observable<FinancialDegree[]>;
  selectedFinancialDegree: FinancialDegree | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public global: GlobalService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    // private toastr: ToastrService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<TrPlanDialogComponent>,
    private router: Router
  ) {
    this.currentDate = new Date();

    this.trainingCenterCtrl = new FormControl();
    this.filteredTrainingCenter = this.trainingCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTrainingCenters(value))
    );

    this.classRoomCtrl = new FormControl();
    this.filteredClassRoom = this.classRoomCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterClassRooms(value))
    );

    this.courseCtrl = new FormControl();
    this.filteredCourse = this.courseCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCourses(value))
    );

    this.purposeCtrl = new FormControl();
    this.filteredPurpose = this.purposeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPurposes(value))
    );

    this.financialDegreeCtrl = new FormControl();
    this.filteredFinancialDegree = this.financialDegreeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterFinancialDegrees(value))
    );

  }

  ngOnInit(): void {
    this.getTrainingCenter();
    this.getClassRoom();
    this.getFiscalYears();
    this.getCourse();
    this.getPurpose();
    this.getFinancialDegree();

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      tittle: ['', Validators.required],
      days: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      noTrainee: ['', Validators.required],
      trainingCenterId: ['', Validators.required],
      classRoomId: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      courseId: ['', Validators.required],
      purposeId: ['', Validators.required],
      finanacielDegreeId: ['', Validators.required],
      transactionUserId: ['', Validators.required]
    });

    if (this.editData) {
      console.log('master edit form: ', this.editData);
      this.actionBtnMaster = 'Update';
      this.groupMasterForm.controls['tittle'].setValue(this.editData.tittle);
      this.groupMasterForm.controls['days'].setValue(this.editData.days);
      this.groupMasterForm.controls['startDate'].setValue(this.editData.startDate);
      this.groupMasterForm.controls['endDate'].setValue(this.editData.endDate);
      this.groupMasterForm.controls['noTrainee'].setValue(this.editData.noTrainee);
      this.groupMasterForm.controls['trainingCenterId'].setValue(this.editData.trainingCenterId);
      this.groupMasterForm.controls['classRoomId'].setValue(this.editData.classRoomId);
      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      this.groupMasterForm.controls['purposeId'].setValue(this.editData.purposeId);
      this.groupMasterForm.controls['courseId'].setValue(this.editData.courseId);
      this.groupMasterForm.controls['finanacielDegreeId'].setValue(this.editData.finanacielDegreeId);
      this.groupMasterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsFinancierForms();
    this.getAllDetailsInstructorForms();
    this.getAllDetailsPositionForms();
  }


  private _filterTrainingCenters(value: string): TrainingCenter[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.trainingCentersList.filter(
      (trainingCenter) =>
        trainingCenter.name.toLowerCase().includes(filterValue)
    );
  }

  displayTrainingCenterName(trainingCenter: any): string {
    return trainingCenter && trainingCenter.name ? trainingCenter.name : '';
  }
  TrainingCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const trainingCenter = event.option.value as TrainingCenter;
    console.log("trainingCenter selected: ", trainingCenter);
    this.selectedTrainingCenter = trainingCenter;
    this.groupMasterForm.patchValue({ trainingCenterId: trainingCenter.id });
  }
  openAutoTrainingCenter() {
    this.trainingCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.trainingCenterCtrl.updateValueAndValidity();
  }


  private _filterClassRooms(value: string): ClassRoom[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.classRoomsList.filter(
      (classRoom) =>
        classRoom.name.toLowerCase().includes(filterValue)
    );
  }

  displayClassRoomName(classRoom: any): string {
    return classRoom && classRoom.name ? classRoom.name : '';
  }
  ClassRoomSelected(event: MatAutocompleteSelectedEvent): void {
    const classRoom = event.option.value as ClassRoom;
    console.log("classRoom selected: ", classRoom);
    this.selectedClassRoom = classRoom;
    this.groupMasterForm.patchValue({ classRoomId: classRoom.id });
  }
  openAutoClassRoom() {
    this.classRoomCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.classRoomCtrl.updateValueAndValidity();
  }


  private _filterCourses(value: string): Course[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.coursesList.filter(
      (course) =>
        course.name.toLowerCase().includes(filterValue)
    );
  }

  displayCourseName(course: any): string {
    return course && course.name ? course.name : '';
  }
  CourseSelected(event: MatAutocompleteSelectedEvent): void {
    const course = event.option.value as Course;
    console.log("course selected: ", course);
    this.selectedCourse = course;
    this.groupMasterForm.patchValue({ courseId: course.id });
  }
  openAutoCourse() {
    this.courseCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.courseCtrl.updateValueAndValidity();
  }


  private _filterPurposes(value: string): Purpose[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.purposesList.filter(
      (purpose) =>
        purpose.name.toLowerCase().includes(filterValue)
    );
  }
  displayPurposeName(purpose: any): string {
    return purpose && purpose.name ? purpose.name : '';
  }
  PurposeSelected(event: MatAutocompleteSelectedEvent): void {
    const purpose = event.option.value as Purpose;
    console.log("purpose selected: ", purpose);
    this.selectedPurpose = purpose;
    this.groupMasterForm.patchValue({ purposeId: purpose.id });
  }
  openAutoPurpose() {
    this.purposeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.purposeCtrl.updateValueAndValidity();
  }



  private _filterFinancialDegrees(value: string): FinancialDegree[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.financialDegreesList.filter(
      (financialDegree) =>
        financialDegree.name.toLowerCase().includes(filterValue)
    );
  }
  displayFinancialDegreeName(financialDegree: any): string {
    return financialDegree && financialDegree.name ? financialDegree.name : '';
  }
  FinancialDegreeSelected(event: MatAutocompleteSelectedEvent): void {
    const financialDegree = event.option.value as FinancialDegree;
    console.log("financialDegree selected: ", financialDegree);
    this.selectedFinancialDegree = financialDegree;
    this.groupMasterForm.patchValue({ finanacielDegreeId: financialDegree.id });
  }
  openAutoFinancialDegree() {
    this.financialDegreeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.financialDegreeCtrl.updateValueAndValidity();
  }


  getAllDetailsFinancierForms() {

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      if (this.getMasterRowId) {
        this.api.getTrPlanFinancierDetailsByHeaderId(this.getMasterRowId.id).subscribe({
          next: (res) => {
            console.log("TrFinancr: ", res);

            this.matchedIds = res;
            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee TrFinancr: ", res);

            if (this.matchedIds) {

              this.dataSource = new MatTableDataSource(this.matchedIds);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

            }
          },
          error: (err) => {
            // console.log("fetch items data err: ", err);
            // alert("خطا اثناء جلب العناصر !");
          }
        })
      }
    }
  }

  // getAllDetailsEmployeeForms() {

  //   console.log("mastered row get all data: ", this.getMasterRowId)
  //   if (this.getMasterRowId) {
  //     this.api.getTrInstructorByHeaderId(this.getMasterRowId.id).subscribe({
  //       next: (res) => {
  //         console.log("TrInstructor: ", res);

  //         this.matchedIds = res;
  //         console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee TrInstructor: ", res);

  //         if (this.matchedIds) {

  //           this.dataSourceInstructor = new MatTableDataSource(this.matchedIds);
  //           this.dataSourceInstructor.paginator = this.paginator;
  //           this.dataSourceInstructor.sort = this.sort;

  //         }
  //       },
  //       error: (err) => {
  //         // console.log("fetch items data err: ", err);
  //         // alert("خطا اثناء جلب العناصر !");
  //       }
  //     })
  //   }
  // }

  getAllDetailsInstructorForms() {

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getTrPlanInstructor().subscribe({
        next: (res) => {
          console.log("TrInstructor: ", res);

          this.matchedIds = res.filter((a: any) => {
            return a.planId == this.getMasterRowId.id
          });

          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee TrInstructor: ", res);

          if (this.matchedIds) {

            this.dataSourceInstructor = new MatTableDataSource(this.matchedIds);
            this.dataSourceInstructor.paginator = this.paginator;
            this.dataSourceInstructor.sort = this.sort;

          }
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
    }
  }

  getAllDetailsPositionForms() {

    console.log("mastered row get plan position details data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getTrPlanPositionByHeaderId(this.getMasterRowId.id).subscribe({
        next: (res) => {

          // this.matchedIds = res;
          console.log("trPlanPosition DETAILS res: ", res);

          if (res) {

            this.dataSourcePosition = new MatTableDataSource(res);
            this.dataSourcePosition.paginator = this.paginator;
            this.dataSourcePosition.sort = this.sort;

          }
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
    }
  }

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');
    this.groupMasterForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log('trPlan master form: ', this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      console.log('Master add form : ', this.groupMasterForm.value);
      this.api.postTrPlan(this.groupMasterForm.value).subscribe({
        next: (res) => {
          console.log('ID trPlan after post: ', res);
          this.getMasterRowId = {
            id: res,
          };
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          this.toastrSuccess();
          this.getAllDetailsFinancierForms();
          this.getAllDetailsInstructorForms();
          this.addDetailsInfo();
        },
        error: (err) => {
          console.log('header post err: ', err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        },
      });
    }
  }

  async addDetailsInfo() {
    console.log('check id for insert: ', this.getDetailedRowData, 'edit data form: ', this.editData, 'main id: ', this.getMasterRowId.id);

    if (this.getMasterRowId.id) {
      if (this.getMasterRowId.id) {
        console.log('form  headerId: ', this.getMasterRowId);
      }
    }
    else {
      this.updateMaster();
    }
  }

  editDetailsFinancierForm(row: any) {
    this.dialog
      .open(TrPlanFinancierDetailsDialogComponent, {
        width: '40%',
        height: '78%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsFinancierForms();
          // this.getAllDetailsEmployeeForms();
          // this.getAllDetailsPositionForms();
        }
      });
  }

  deleteFormDetailsFinancier(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteTrPlanFinancier(id).subscribe({
        next: (res) => {
          this.toastrDeleteSuccess();
          this.getAllDetailsFinancierForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }

  deleteFormDetailsPosition(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteTrPlanPosition(id).subscribe({
        next: (res) => {
          this.toastrDeleteSuccess();
          this.getAllDetailsFinancierForms();
          this.getAllDetailsPositionForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }

  editDetailsInstrutcorForm(row: any) {
    this.dialog
      .open(TrPlanInstructorDetailsDialogComponent, {
        width: '40%',
        height: '78%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsInstructorForms();
        }
      });
  }

  editDetailsPositionForm(row: any) {
    console.log("position details row: ", row);
    this.dialog
      .open(TrPlanPositionDetailsDialogComponent, {
        width: '40%',
        height: '78%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsPositionForms();
        }
      });
  }

  deleteFormDetailsInstructor(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteTrPlanInstructor(id).subscribe({
        next: (res) => {
          this.toastrDeleteSuccess();
          this.getAllDetailsInstructorForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }


  getAllMasterForms() {
    this.dialogRef.close('save');
  }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);

    console.log('ooo:', !this.getDetailedRowData);

    this.api.putTrPlan(this.groupMasterForm.value).subscribe({
      next: (res) => {
        this.toastrUpdateSuccess();
        this.getDetailedRowData = '';
      },
    });
  }

  OpenDetailsFinancierDialog() {
    this.router.navigate(['/TrPlan', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(TrPlanFinancierDetailsDialogComponent, {
        width: '40%',
        height: '78%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsFinancierForms();
        }
      });
  }

  OpenDetailsInstructorDialog() {
    this.router.navigate(['/TrPlan', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(TrPlanInstructorDetailsDialogComponent, {
        width: '40%',
        height: '78%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsInstructorForms();
        }
      });
  }

  OpenDetailsPositionDialog() {
    this.router.navigate(['/TrPlan', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(TrPlanPositionDetailsDialogComponent, {
        width: '40%',
        height: '78%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsPositionForms();
        }
      });
  }

  getTrainingCenter() {
    this.api.getAllTrainingCenter().subscribe({
      next: (res) => {
        console.log("trainingCenter res: ", res);
        this.trainingCentersList = res;
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  getClassRoom() {
    this.api.getClassRoom().subscribe({
      next: (res) => {
        console.log("getClassRoom res: ", res);
        this.classRoomsList = res;
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  async getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: async (res) => {
        this.fiscalYearsList = res;

        this.api.getLastFiscalYear().subscribe({
          next: async (res) => {

            this.defaultFiscalYearSelectValue = await res;
            console.log('selectedYearggggggggggggggggggg: ', this.defaultFiscalYearSelectValue);
            if (this.editData) {
              this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
            }
            else {
              this.groupMasterForm.controls['fiscalYearId'].setValue(this.defaultFiscalYearSelectValue.id);
            }
          },
          error: (err) => {
            // console.log("fetch fiscalYearId data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          },
        });
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  getCourse() {
    this.api.getCourse().subscribe({
      next: (res) => {
        console.log("getCourse res: ", res);
        this.coursesList = res;
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  getPurpose() {
    this.api.getPurpose().subscribe({
      next: (res) => {
        console.log("getPurpose res: ", res);
        this.purposesList = res;
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  getFinancialDegree() {
    this.api.getFinancialDegree().subscribe({
      next: (res) => {
        console.log("getFinancialDegree res: ", res);
        this.financialDegreesList = res;
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrUpdateSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
