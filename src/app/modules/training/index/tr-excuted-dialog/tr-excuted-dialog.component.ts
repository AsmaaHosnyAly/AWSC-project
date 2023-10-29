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
import { TrExcutedInstructorDetailsDialogComponent } from '../tr-excuted-instructor-details-dialog/tr-excuted-instructor-details-dialog.component';
import { TrExcutedPositionDetailsDialogComponent } from '../tr-excuted-position-details-dialog/tr-excuted-position-details-dialog.component';
import { TrExcutedFinancierDetailsDialogComponent } from '../tr-excuted-financier-details-dialog/tr-excuted-financier-details-dialog.component';
import { TrExcutedTraineeDetailsDialogComponent } from '../tr-excuted-trainee-details-dialog/tr-excuted-trainee-details-dialog.component';

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

export class MaterialPurpose {
  constructor(public id: number, public name: string) { }
}

export class Delegate {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-tr-excuted-dialog',
  templateUrl: './tr-excuted-dialog.component.html',
  styleUrls: ['./tr-excuted-dialog.component.css']
})
export class TrExcutedDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  groupDetailsForm!: FormGroup;
  groupMasterForm!: FormGroup;
  actionBtnMaster: string = 'Save';
  actionBtnDetails: string = 'Save';
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;

  dataSourceInstructor!: MatTableDataSource<any>;
  dataSourcePosition!: MatTableDataSource<any>;
  dataSourceTrainee!: MatTableDataSource<any>;
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
  displayedInstructorsColumns: string[] = ['instructorId', 'action'];
  displayedPositionsColumns: string[] = ['positionName', 'action'];
  displayedTraineesColumns: string[] = ['headerDelegateName', 'action'];

  sessionId = Math.random();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  trainingCentersList: TrainingCenter[] = [];
  trainingCenterCtrl: FormControl;
  filteredTrainingCenter: Observable<TrainingCenter[]>;
  selectedTrainingCenter: TrainingCenter | undefined;

  classRoomsList: ClassRoom[] = [];
  classRoomCtrl: FormControl;
  filteredClassRoom: Observable<ClassRoom[]>;
  selectedClassRoom: ClassRoom | undefined;

  coursesList: Course[] = [];
  courseCtrl: FormControl;
  filteredCourse: Observable<Course[]>;
  selectedCourse: Course | undefined;

  purposesList: Purpose[] = [];
  purposeCtrl: FormControl;
  filteredPurpose: Observable<Purpose[]>;
  selectedPurpose: Purpose | undefined;

  materialPurposesList: MaterialPurpose[] = [];
  materialPurposeCtrl: FormControl;
  filteredMaterialPurpose: Observable<MaterialPurpose[]>;
  selectedMaterialPurpose: MaterialPurpose | undefined;
  // materialPurposesList: any;


  delegatesList: Delegate[] = [];
  delegateCtrl: FormControl;
  filteredDelegate: Observable<Delegate[]>;
  selectedDelegate: Delegate | undefined;
  // delegatesList: any;

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
    private dialogRef: MatDialogRef<TrExcutedDialogComponent>,
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

    this.materialPurposeCtrl = new FormControl();
    this.filteredMaterialPurpose = this.materialPurposeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterMaterialPurposes(value))
    );


    this.delegateCtrl = new FormControl();
    this.filteredDelegate = this.delegateCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterDelegates(value))
    );

  }

  ngOnInit(): void {
    this.getTrainingCenter();
    this.getClassRoom();
    this.getFiscalYears();
    this.getCourse();
    this.getPurpose();
    this.getHrEmployee();

    this.getMasterRowId = this.editData;

    this.groupMasterForm = this.formBuilder.group({
      days: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      noTrainee: ['', Validators.required],
      noTraineeCorporate: ['', Validators.required],
      noTraineeTotal: ['', Validators.required],
      status: ['', Validators.required],
      costplaned: ['', Validators.required],
      cost: ['', Validators.required],
      delegateId: ['', Validators.required],
      trainingCenterId: ['', Validators.required],
      classRoomId: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      courseId: ['', Validators.required],
      purposeId: ['', Validators.required],
      materialPurposeId: ['', Validators.required],
      transactionUserId: ['', Validators.required]
    });

    if (this.editData) {
      console.log('master edit form: ', this.editData);
      this.actionBtnMaster = 'Update';

      this.groupMasterForm.controls['days'].setValue(this.editData.days);
      this.groupMasterForm.controls['startDate'].setValue(this.editData.startDate);
      this.groupMasterForm.controls['endDate'].setValue(this.editData.endDate);
      this.groupMasterForm.controls['noTrainee'].setValue(this.editData.noTrainee);
      this.groupMasterForm.controls['noTraineeCorporate'].setValue(this.editData.noTraineeCorporate);
      this.groupMasterForm.controls['noTraineeTotal'].setValue(this.editData.noTraineeTotal);
      this.groupMasterForm.controls['status'].setValue(this.editData.status);
      this.groupMasterForm.controls['costplaned'].setValue(this.editData.costplaned);
      this.groupMasterForm.controls['cost'].setValue(this.editData.cost);
      this.groupMasterForm.controls['delegateId'].setValue(this.editData.delegateId);
      this.groupMasterForm.controls['trainingCenterId'].setValue(this.editData.trainingCenterId);
      this.groupMasterForm.controls['classRoomId'].setValue(this.editData.classRoomId);
      this.groupMasterForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      this.groupMasterForm.controls['purposeId'].setValue(this.editData.purposeId);
      this.groupMasterForm.controls['courseId'].setValue(this.editData.courseId);
      this.groupMasterForm.controls['materialPurposeId'].setValue(this.editData.materialPurposeId);
      this.groupMasterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

      this.groupMasterForm.addControl('id', new FormControl('', Validators.required));
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.getAllDetailsFinancierForms();
    this.getAllDetailsInstructorForms();
    this.getAllDetailsPositionForms();
    this.getAllDetailsTraineeForms();
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


  private _filterMaterialPurposes(value: string): MaterialPurpose[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.materialPurposesList.filter(
      (materialPurpose) =>
        materialPurpose.name.toLowerCase().includes(filterValue)
    );
  }
  displayMaterialPurposeName(materialPurpose: any): string {
    return materialPurpose && materialPurpose.name ? materialPurpose.name : '';
  }
  MaterialPurposeSelected(event: MatAutocompleteSelectedEvent): void {
    const materialPurpose = event.option.value as MaterialPurpose;
    console.log("materialPurpose selected: ", materialPurpose);
    this.selectedMaterialPurpose = materialPurpose;
    this.groupMasterForm.patchValue({ materialPurposeId: materialPurpose.id });
  }
  openAutoMaterialPurpose() {
    this.materialPurposeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.materialPurposeCtrl.updateValueAndValidity();
  }



  private _filterDelegates(value: string): Delegate[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.delegatesList.filter(
      (delegate) =>
        delegate.name.toLowerCase().includes(filterValue)
    );
  }
  displayDelegateName(delegate: any): string {
    return delegate && delegate.name ? delegate.name : '';
  }
  DelegateSelected(event: MatAutocompleteSelectedEvent): void {
    const delegate = event.option.value as Delegate;
    console.log("delegate selected: ", delegate);
    this.selectedDelegate = delegate;
    this.groupMasterForm.patchValue({ delegateId: delegate.id });
  }
  openAutoDelegate() {
    this.delegateCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.delegateCtrl.updateValueAndValidity();
  }


  getAllDetailsFinancierForms() {

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      if (this.getMasterRowId) {
        this.api.getTrExcutedFinancier().subscribe({
          next: (res) => {
            console.log("TrFinancr: ", res);

            this.matchedIds = res.filter((a: any) => {
              return a.excutedId == this.getMasterRowId.id
            });

            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee TrFinancr: ", res);

            if (this.matchedIds) {
              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee TrFinancr matched: ", this.matchedIds);

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

  getAllDetailsInstructorForms() {

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getTrExcutedInstructor().subscribe({
        next: (res) => {
          console.log("TrInstructor: ", res);

          this.matchedIds = res.filter((a: any) => {
            return a.excutedId == this.getMasterRowId.id
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

    console.log("mastered row get Excuted position details data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getTrExcutedPositionByHeaderId(this.getMasterRowId.id).subscribe({
        next: (res) => {

          // this.matchedIds = res;
          console.log("trExcutedPosition DETAILS res: ", res);

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

  getAllDetailsTraineeForms() {

    console.log("mastered row get excuted Trainee details data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getTrExcutedTraineeByHeaderId(this.getMasterRowId.id).subscribe({
        next: (res) => {

          // this.matchedIds = res;
          console.log("trexcutedTrainee DETAILS res: ", res);

          if (res) {

            this.dataSourceTrainee = new MatTableDataSource(res);
            this.dataSourceTrainee.paginator = this.paginator;
            this.dataSourceTrainee.sort = this.sort;

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

    console.log('trExcuted master form: ', this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      console.log('Master add form : ', this.groupMasterForm.value);
      this.api.postTrExcuted(this.groupMasterForm.value).subscribe({
        next: (res) => {
          console.log('ID trExcuted after post: ', res);
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
      .open(TrExcutedFinancierDetailsDialogComponent, {
        width: '40%',
        height: '78%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsFinancierForms();
          // this.getAllDetailsInstructorForms();
          // this.getAllDetailsPositionForms();
        }
      });
  }

  deleteFormDetailsFinancier(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteTrExcutedFinancier(id).subscribe({
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
      this.api.deleteTrExcutedPosition(id).subscribe({
        next: (res) => {
          this.toastrDeleteSuccess();
          // this.getAllDetailsFinancierForms();
          this.getAllDetailsPositionForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }

  deleteFormDetailsTrainee(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteTrExcutedTrainee(id).subscribe({
        next: (res) => {
          this.toastrDeleteSuccess();
          // this.getAllDetailsFinancierForms();
          this.getAllDetailsTraineeForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }

  editDetailsInstrutcorForm(row: any) {
    this.dialog
      .open(TrExcutedInstructorDetailsDialogComponent, {
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
      .open(TrExcutedPositionDetailsDialogComponent, {
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

  editDetailsTraineeForm(row: any) {
    console.log("trainee details row: ", row);
    this.dialog
      .open(TrExcutedTraineeDetailsDialogComponent, {
        width: '40%',
        height: '78%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsTraineeForms();
        }
      });
  }

  deleteFormDetailsInstructor(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteTrExcutedInstructor(id).subscribe({
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


  // getAllMasterForms() {
  //   this.dialogRef.close('save');

  //   this.api.getTrPlan().subscribe({
  //     next: (res) => {
  //       this.dataSource = new MatTableDataSource(res);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     },
  //     error: () => {
  //       // alert("خطأ أثناء جلب سجلات المجموعة !!");
  //     },
  //   });
  // }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);

    console.log('ooo:', !this.getDetailedRowData);

    this.api.putTrExcuted(this.groupMasterForm.value).subscribe({
      next: (res) => {
        this.toastrUpdateSuccess();
        this.getDetailedRowData = '';
      },
    });
  }

  OpenDetailsFinancierDialog() {
    this.router.navigate(['/TrExcuted', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(TrExcutedFinancierDetailsDialogComponent, {
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
    this.router.navigate(['/TrExcuted', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(TrExcutedInstructorDetailsDialogComponent, {
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
    this.router.navigate(['/TrExcuted', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(TrExcutedPositionDetailsDialogComponent, {
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

  OpenDetailsTraineeDialog() {
    this.router.navigate(['/TrExcuted', { masterId: this.getMasterRowId.id }]);
    this.dialog
      .open(TrExcutedTraineeDetailsDialogComponent, {
        width: '40%',
        height: '78%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllDetailsTraineeForms();
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
        this.materialPurposesList = res;
      },
      error: () => {
        // alert("خطأ أثناء جلب سجلات المجموعة !!");
      },
    });
  }

  getHrEmployee() {
    this.api.getHrEmployees().subscribe({
      next: (res) => {
        console.log("delegate hrEmployee res: ", res);
        this.delegatesList = res;
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
