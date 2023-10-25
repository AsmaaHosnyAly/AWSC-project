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

export class Instructor {
  constructor(public id: number, public instructorName: string) { }
}

@Component({
  selector: 'app-tr-plan-instructor-details-dialog',
  templateUrl: './tr-plan-instructor-details-dialog.component.html',
  styleUrls: ['./tr-plan-instructor-details-dialog.component.css']
})
export class TrPlanInstructorDetailsDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  planInstructorsForm !: FormGroup;
  groupMasterForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
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

  instructorsList: Instructor[] = [];
  instructorCtrl: FormControl;
  filteredInstructor: Observable<Instructor[]>;
  selectedInstructor: Instructor | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // instructorsList: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TrPlanInstructorDetailsDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.instructorCtrl = new FormControl();
    this.filteredInstructor = this.instructorCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterInstructors(value))
    );

  }

  ngOnInit(): void {
    this.getTrInstructor();

    this.planInstructorsForm = this.formBuilder.group({
      planId: ['', Validators.required],
      instructorId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);

      this.planInstructorsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.planInstructorsForm.controls['planId'].setValue(this.editData.planId);
      this.planInstructorsForm.controls['instructorId'].setValue(this.editData.instructorId);

      this.planInstructorsForm.addControl('id', new FormControl('', Validators.required));
      this.planInstructorsForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);

    }

  }

  private _filterInstructors(value: string): Instructor[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.instructorsList.filter(
      (instructor) =>
        instructor.instructorName.toLowerCase().includes(filterValue)
    );
  }

  displayInstructorName(instructor: any): string {
    return instructor && instructor.instructorName ? instructor.instructorName : '';
  }
  InstructorSelected(event: MatAutocompleteSelectedEvent): void {
    const instructor = event.option.value as Instructor;
    console.log("instructor selected: ", instructor);
    this.selectedInstructor = instructor;
    this.planInstructorsForm.patchValue({ instructorId: instructor.id });
  }
  openAutoInstructor() {
    this.instructorCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.instructorCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.getMasterRowId = this.route.url.split('=').pop();
    this.planInstructorsForm.controls['planId'].setValue(this.getMasterRowId);
    this.planInstructorsForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.planInstructorsForm.getRawValue().planId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.planInstructorsForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.planInstructorsForm.value)

        if (this.planInstructorsForm.valid) {

          this.api.postTrPlanInstructor(this.planInstructorsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)

                this.toastrSuccess();
                this.planInstructorsForm.reset();

                this.dialogRef.close('save');

              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }

      }

    }
    else {
      console.log("edit data instructor conflict: ", this.editData);
      this.planInstructorsForm.controls['planId'].setValue(this.editData.planId);

      console.log("Enteeeeerrr edit condition: ", this.planInstructorsForm.value)

      this.api.putTrPlanInstructor(this.planInstructorsForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.planInstructorsForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.planInstructorsForm.removeControl('id')
    }
  }


  getTrInstructor() {
    this.api.getTrInstructor()
      .subscribe({
        next: (res) => {
          this.instructorsList = res;
          console.log("instructorsList res: ", this.instructorsList);
        },
        error: (err) => {
          console.log("fetch instructorsList data err: ", err);
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  closeDialog() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {

    this.dialogRef.close('Save');
    // }
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}
