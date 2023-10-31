



import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { Params, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';


// export class Exchange {
//   constructor(public id: number, public name: string) { }
// }

// export class item {
//   constructor(public id: number, public name: string, public fullCode: string) { }
// }
// export class Employee {
//   constructor(public id: number, public name: string, public code: string) { }
// }
export class Course {
  constructor(public id: number, public name: string) { }
}

export class Track {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-tr-track-details-dialog',
  templateUrl: './tr-track-details-dialog.component.html',
  styleUrls: ['./tr-track-details-dialog.component.css']
})
export class TrTrackDetailsDialogComponent implements OnInit {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  sumOfnameTotals = 0;
  sumOfvalueTotals = 0;
  resultOfBalance = 0;
  courseName: any;
  trackName: any;
  getMasterRowId: any;
  getDetailsRowId: any;
  journalsList: any;
  sourcesList: any;
  CourseId:any;
  TrackId:any
  // employeesList: any;
  distEmployeesList: any;
  costCentersList: any;
  // itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;


  CoursesList: Course[] = [];
  CourseCtrl: FormControl;
  filteredCourse: Observable<Course[]>;
  selectedCourse: Course | undefined;


  TracksList: Track[] = [];
  TrackCtrl: FormControl;
  filteredTrack: Observable<Track[]>;
  selectedTrack: Track | undefined;

  // employeesList: Employee[] = [];
  // employeeCtrl: FormControl<any>;
  // filteredEmployee: Observable<Employee[]>;
  // selectedEmployee: Employee | undefined;

  fullCodeValue: any;
  itemByFullCodeValue: any;

  // itemsList: item[] = [];
  // itemCtrl: FormControl;
  // filtereditem: Observable<item[]>;
  // selecteditem: item | undefined;

  // exchangesList: Exchange[] = [];
  // exchangeCtrl: FormControl;
  // filteredexchange: Observable<Exchange[]>;
  // selectedexchange: Exchange | undefined;

  // displayedColumns: string[] = ['name', 'value', 'accountName', 'fiAccountItemId', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TrTrackDetailsDialogComponent>,

    private toastr: ToastrService,
    private router: Router, private route: ActivatedRoute) {


    this.CourseCtrl = new FormControl();
    this.filteredCourse = this.CourseCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCourses(value))
    );

    this.TrackCtrl = new FormControl();
    this.filteredTrack = this.TrackCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTracks(value))
    );

  }

  ngOnInit(): void {
    this.getTrTarck();
    this.getCourse();    // this.getItems();
    // this.getTrTrack();
    this.getMasterRowId = this.editData;
    // this.getFiAccountItems();
    console.log("edit data in details", this.editData)

    this.groupDetailsForm = this.formBuilder.group({
      // exchangeId: ['', Validators.required],
      courseId: ['', Validators.required],
      // courseName: [''],
      // trackName: [''],

      // value: ['', Validators.required],
      // employeeId: ['', Validators.required],
      trackId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      updateUserCourseId: [1],
    });
    console.log("details edit form before: ", this.editData);
    console.log("route params: ", this.route);
    this.getMasterRowId = this.route.snapshot.queryParamMap.get('masterId');

    // this.getMasterRowId = this.route.url.split('=').pop();
    console.log("check : ", this.route.url);


    console.log("masterrowid", this.getMasterRowId)
    if (this.editData) {
      console.log("details edit form: ", this.editData);
      // this.actionBtnMaster = "Update";

      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      // this.groupDetailsForm.controls['exchangeId'].setValue(this.editData.exchangeId);
      // this.groupDetailsForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.groupDetailsForm.controls['trackId'].setValue(this.editData.trackId);

      this.groupDetailsForm.controls['courseId'].setValue(this.editData.courseId);
      // this.groupDetailsForm.controls['value'].setValue(this.editData.value)

      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);
    }

  }

  displayCourseName(Course: any): string {
    return Course && Course.name ? Course.name : '';
  }
  CourseSelected(event: MatAutocompleteSelectedEvent): void {
    const Course = event.option.value as Course;
    console.log('Course selected: ', Course);
    this.selectedCourse = Course;
    this.groupDetailsForm.patchValue({ courseId: Course.id });
    console.log('CourseId', this.groupDetailsForm.getRawValue().courseId)

  }
  private _filterCourses(value: string): Course[] {
    const filterValue = value;
    return this.CoursesList.filter((Course: any) =>
      Course.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoCourse() {
    this.CourseCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.CourseCtrl.updateValueAndValidity();
  }


  displayTrackName(Track: any): string {
    return Track && Track.name ? Track.name : '';
  }
  TrackSelected(event: MatAutocompleteSelectedEvent): void {
    const Track = event.option.value as Track;
    console.log('Track selected: ', Track);
    this.selectedTrack = Track;
    this.groupDetailsForm.patchValue({ trackId: Track.id });
    console.log('TrackId', this.groupDetailsForm.getRawValue().trackId)

  }
  private _filterTracks(value: string): Track[] {
    const filterValue = value;
    return this.TracksList.filter((Track: any) =>
      Track.name.toLowerCase().includes(filterValue)
    );
  }

  openAutoTrack() {
    this.TrackCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.TrackCtrl.updateValueAndValidity();
  }
  // getCodeByItem(item: any) {
  //   console.log("item by code: ", item, "code: ", this.itemsList);

  //   // if (item.keyCode == 13) {
  //   this.itemsList.filter((a: any) => {
  //     if (a.id === item) {
  //       // this.groupDetailsForm.controls['TrackId'].setValue(a.id);
  //       console.log("item by code selected: ", a)
  //       // console.log("item by code selected: ", a.fullCode)
  //       if (a.fullCode) {
  //         this.fullCodeValue = a.fullCode;
  //       }
  //       else {
  //         this.fullCodeValue = '-';
  //       }

  //       // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId)
  //     }
  //   })
  //   // }


  // }
  itemOnChange(itemEvent: any) {
    // this.isReadOnly = true;
    console.log("itemId: ", itemEvent)

    // if (this.groupDetailsForm.getRawValue().avgPrice == 0) {
    //   this.isReadOnly = false;
    //   console.log("change readOnly to enable");
    // }
    // else {
    //   this.isReadOnly = true;
    //   console.log("change readOnly to disable");
    // }

    // if (this.groupDetailsForm.getRawValue().price == 0 || this.editData?.price == 0) {
    //   this.isReadOnly = false;
    //   console.log("change readOnly to enable here");
    // }
    // else {
    //   this.isReadOnly = true;
    //   console.log("change readOnly to disable here");
    // }


  }

  // getTrTrack() {
  //   this.api.getTrTarck().subscribe({
  //     next: (res) => {
  //       this.exchangesList = res;
  //       // console.log("exchanges res: ", this.exchangesList);
  //     },
  //     error: (err) => {
  //       // console.log("fetch items data err: ", err);
  //       // alert("خطا اثناء جلب العناصر !");
  //     },
  //   });
  // }


  // getItems() {
  //   this.api.getItems().subscribe({
  //     next: (res) => {
  //       this.itemsList = res;
  //       // console.log("items res: ", this.itemsList);
  //     },
  //     error: (err) => {
  //       // console.log("fetch items data err: ", err);
  //       // alert("خطا اثناء جلب العناصر !");
  //     },
  //   });
  // }
  getcourseByID(id: any) {
    // console.log("row item id: ", id);
    return fetch(this.api.getcourseById(id))
      .then((response) => response.json())
      .then((json) => {
        console.log('fetch item name by id res: ', json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }
  getTrackByID(id: any) {
    // console.log("row item id: ", id);
    return fetch(this.api.getTrackById(id))
      .then((response) => response.json())
      .then((json) => {
        console.log('fetch item name by id res: ', json.name);
        return json.name;
      })
      .catch((err) => {
        // console.log("error in fetch item name by id: ", err);
        // alert("خطا اثناء جلب رقم العنصر !");
      });
  }

  // getItemByCode(code: any) {
  //   if (code.keyCode == 13) {
  //     this.itemsList.filter((a: any) => {
  //       if (a.fullCode === code.target.value) {
  //         this.groupDetailsForm.controls['itemId'].setValue(a.id);
  //         this.groupDetailsForm.controls['fullCode'].setValue(a.fullCode);
  //         console.log("item by code: ", a.name);
  //         this.itemCtrl.setValue(a.name);
  //         if (a.name) {
  //           this.itemByFullCodeValue = a.name;




  //         }
  //         else {
  //           this.itemByFullCodeValue = '-';
  //         }
  //         this.itemByFullCodeValue = a.name;
  //         // this.itemOnChange(this.groupDetailsForm.getRawValue().itemId);

  //       }
  //     })
  //   }


  // }

  getAllDetailsForms() {
    // console.log("edddit get all data: ", this.editData)
    console.log("mastered row get all data: ", this.getMasterRowId)
    this.dialogRef.close('Save');

    if (this.getMasterRowId.id) {
      this.api.getTrTrackDetailsByMasterId(this.getMasterRowId.id).subscribe({
        next: (res) => {
          // this.itemsList = res;
          this.matchedIds = res;
          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);

          if (this.matchedIds) {
            // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);
            this.dataSource = new MatTableDataSource(this.matchedIds);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

          }
        },
        error: (err) => {

        }
      })
    }
  }


  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);

    console.log(
      'update both: ',
      this.groupDetailsForm.valid,
      'ooo:',
      !this.getDetailedRowData
    );
    // console.log("edit : ", this.groupDetailsForm.value)
    this.api.putTrTarck(this.groupMasterForm.value).subscribe({
      next: (res) => {
        this.groupDetailsForm.reset();
        this.getDetailedRowData = '';
      },
    });
  }
  async addDetailsInfo() {
    // console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "main id: ", this.getMasterRowId.id);
    console.log('masterrow', this.getMasterRowId);
    if (!this.editData) {
      if (this.getMasterRowId) {
        // console.log("form  headerId: ", this.getMasterRowId.id)

        // if (this.groupDetailsForm.getRawValue().courseId || this.groupDetailsForm.getRawValue().trackId) {
        //   this.courseName = await this.getcourseByID(
        //     this.groupDetailsForm.getRawValue().courseId
        //   );
        //   this.groupDetailsForm.controls['courseName'].setValue(this.courseName);
        //   this.trackName = await this.getTrackByID(
        //     this.groupDetailsForm.getRawValue().trackId
        //   );
        //   this.groupDetailsForm.controls['trackName'].setValue(this.trackName);

          this.groupDetailsForm.controls['transactionUserId'].setValue(1);
        //   // alert("itemId")
        // }
        // this.groupDetailsForm.controls['Tr_TrackId'].setValue(
        //   parseInt(this.getMasterRowId)
        // );




        this.groupDetailsForm.removeControl('id')

        console.log("form details after item: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.valid) {
          console.log(
            'form details after post: ',
            this.groupDetailsForm.value
          );

          this.api
            .postTrTrackDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.toastrSuccess();
                this.groupDetailsForm.reset();
                this.updateDetailsForm();
                this.getAllDetailsForms();

              },
              error: (err) => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
                console.log("post err: ", err)

              },
            });
        }
        //  else {
        //   this.updateBothForms();
        // }
      }
    } else {
      this.updateDetailsForm();
    }
  }

  async updateDetailsForm() {
    if (this.editData) {
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);
      console.log('data item Name in edit: ', this.groupDetailsForm.value);
      // }
      this.groupDetailsForm.controls['price'].setValue(this.editData.price);
    }


    // this.groupDetailsForm.controls['id'].setValue(this.getMasterRowId.id);
    // console.log(
    //   'enteeeeeeeeeer to update master form: ',
    //   this.groupDetailsForm.getRawValue().creditTotal
    // );
    if (this.groupDetailsForm.valid) {
      this.api
        .putTrTrackDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            this.groupDetailsForm.reset();
            this.getAllDetailsForms();
        
            this.getDetailedRowData = '';
            // alert('تم التعديل بنجاح');
            this.toastrEditSuccess();

            this.dialogRef.close('Update');
          },
          error: (err) => {
            console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          },
        });
    }
  }


  // async addDetailsInfo() {
  //   this.getMasterRowId = this.route.url.split('=').pop();
  //   // this.groupDetailsForm.controls['exchangeId'].setValue(this.groupDetailsForm.getRawValue().exchangeId);
  //   this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
  //   console.log("check : ", this.route.url.split('=').pop());
  //   console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData);

  //   if (!this.editData) {
  //     // console.log("Enteeeeerrr post condition: ", this.groupDetailsForm.value)

  //     if (this.getMasterRowId) {
  //       console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

  //       if (this.groupDetailsForm.getRawValue().name || this.groupDetailsForm.getRawValue().value) {
  //         if (this.editData) {
  //           console.log("found details: ", this.editData)
  //           this.sumOfnameTotals = this.editData.nameTotal;
  //           this.sumOfvalueTotals = this.editData.valueTotal;

  //           this.sumOfnameTotals = this.sumOfnameTotals + this.groupDetailsForm.getRawValue().name;
  //           this.sumOfvalueTotals = this.sumOfvalueTotals + this.groupDetailsForm.getRawValue().value;


  //           if (this.sumOfnameTotals > this.sumOfvalueTotals) {
  //             this.resultOfBalance = this.sumOfnameTotals - this.sumOfvalueTotals;
  //           }
  //           else {
  //             this.resultOfBalance = this.sumOfvalueTotals - this.sumOfnameTotals;
  //           }

  //         }
  //         else {
  //           console.log("found details withoutEdit: ", this.groupDetailsForm.value)
  //           this.sumOfnameTotals = this.sumOfnameTotals + this.groupDetailsForm.getRawValue().name;
  //           this.sumOfvalueTotals = this.sumOfvalueTotals + this.groupDetailsForm.getRawValue().value;

  //         }

  //       }

  //       // console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

  //       // console.log("add details second time, details form: ", this.groupDetailsForm.value)
  //       // console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

  //       if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

  //         this.api.postTrTrackDetails(this.groupDetailsForm.value)
  //           .subscribe({
  //             next: (res) => {
  //               this.getDetailsRowId = {
  //                 "id": res
  //               };
  //               // console.log("Details res: ", this.getDetailsRowId.id)

  //               // alert("تمت إضافة التفاصيل بنجاح");
  //               this.toastrSuccess();

  //               this.groupDetailsForm.reset();

  //               this.dialogRef.close('save');

  //             },
  //             error: () => {
  //               // alert("حدث خطأ أثناء إضافة مجموعة")
  //             }
  //           })
  //       }
  //       // else {
  //       //   this.updateBothForms();
  //       // }

  //     }

  //   }
  //   else {
  //     console.log("Enteeeeerrr edit condition: ", this.groupDetailsForm.value)

  //     this.api.putTrTrackDetails(this.groupDetailsForm.value)
  //       .subscribe({
  //         next: (res) => {
  //           this.toastrSuccess();
  //           this.getAllDetailsForms();
  //           this.groupDetailsForm.reset();
  //           this.dialogRef.close('save');
  //         },
  //         error: (err) => {
  //           // console.log("update err: ", err)
  //           // alert("خطأ أثناء تحديث سجل المجموعة !!")
  //         }
  //       })
  //     this.groupDetailsForm.removeControl('id')
  //   }
  // }
  // getEmployees() {
  //   console.log("hey from employeeeeee")
  //   this.api.getEmployee().subscribe({
  //     next: (res) => {
  //       this.employeesList = res;
  //       console.log('employee list: ', this.employeesList);
  //       // this.employeeName =  this.getemployeeByID(this.groupMasterForm.getRawValue().employeeId);
  //       // console.log("employeeId",this.groupMasterForm.getRawValue().employeeId)
  //       // console.log('employeeName',this.employeeName.value)
  //       // this.employeeName=this.editData(this.employeesList)
  //     },
  //     error: (err) => {
  //       // console.log("fetch store data err: ", err);
  //       // alert("خطا اثناء جلب المخازن !");
  //     },
  //   });
  // }

  getTrTarck() {
    this.api.getTrTarck().subscribe({
      next: (res) => {
        this.TracksList = res;
        // console.log("sourcesList res: ", this.sourcesList);
      },
      error: (err) => {
        console.log('fetch sourcesList data err: ', err);
        // alert("خطا اثناء جلب الانواع !");
      },
    });
  }
  getCourse() {
    this.api.getTrCourse().subscribe({
      next: (res) => {
        this.CoursesList = res;
        console.log("coursesList res: ", this.CoursesList);
      },
      error: (err) => {
        console.log('fetch sourcesList data err: ', err);
        // alert("خطا اثناء جلب الانواع !");
      },
    });
  }



  closeDialog() {
    let result = window.confirm('هل تريد اغلاق الطلب');
    if (result) {

      this.dialogRef.close('Save');
      this.getAllDetailsForms();
    }
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrEditSuccess(): void {
    this.toastr.success("تم التعديل بنجاح");
  }
}

