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

export class Employee {
  constructor(public id: number, public name: string) { }
}

export class Trainee {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-tr-excuted-trainee-details-dialog',
  templateUrl: './tr-excuted-trainee-details-dialog.component.html',
  styleUrls: ['./tr-excuted-trainee-details-dialog.component.css']
})
export class TrExcutedTraineeDetailsDialogComponent {
  transactionUserId = localStorage.getItem('transactionUserId');
  excutedTraineesForm !: FormGroup;
  // groupMasterForm !: FormGroup;
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

  // employeesList: any;
  distEmployeesList: any;
  costCentersList: any;
  itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;

  employeesList: Employee[] = [];
  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;

  traineesList: Trainee[] = [];
  traineeCtrl: FormControl;
  filteredTrainee: Observable<Trainee[]>;
  selectedTrainee: Trainee | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // traineesList: any;
  // financiersList: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TrExcutedTraineeDetailsDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEmployees(value))
    );

    this.traineeCtrl = new FormControl();
    this.filteredTrainee = this.traineeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTrainees(value))
    );

  }

  ngOnInit(): void {
    this.getTrTrainee();
    this.getHrEmployees();

    this.excutedTraineesForm = this.formBuilder.group({
      excutedId: ['', Validators.required],
      employeeId: ['', Validators.required],
      traineeId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);

      this.excutedTraineesForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.excutedTraineesForm.controls['excutedId'].setValue(this.editData.excutedId);
      this.excutedTraineesForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.excutedTraineesForm.controls['traineeId'].setValue(this.editData.traineeId);

      this.excutedTraineesForm.addControl('id', new FormControl('', Validators.required));
      this.excutedTraineesForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);

    }

  }

  private _filterEmployees(value: string): Employee[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.employeesList.filter(
      (employee) =>
        employee.name.toLowerCase().includes(filterValue)
    );
  }
  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  EmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log("employee selected: ", employee);
    this.selectedEmployee = employee;
    this.excutedTraineesForm.patchValue({ employeeId: employee.id });
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }


  private _filterTrainees(value: string): Trainee[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.traineesList.filter(
      (trainee) =>
        trainee.name.toLowerCase().includes(filterValue)
    );
  }

  displayTraineeName(trainee: any): string {
    return trainee && trainee.name ? trainee.name : '';
  }
  TraineeSelected(event: MatAutocompleteSelectedEvent): void {
    const trainee = event.option.value as Trainee;
    console.log("trainee selected: ", trainee);
    this.selectedTrainee = trainee;
    this.excutedTraineesForm.patchValue({ traineeId: trainee.id });
  }
  openAutoTrainee() {
    this.traineeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.traineeCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.getMasterRowId = this.route.url.split('=').pop();
    this.excutedTraineesForm.controls['excutedId'].setValue(this.getMasterRowId);
    this.excutedTraineesForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.excutedTraineesForm.getRawValue().excutedId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.excutedTraineesForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.excutedTraineesForm.value)

        if (this.excutedTraineesForm.valid) {

          this.api.postTrExcutedTrainee(this.excutedTraineesForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)

                this.toastrSuccess();
                this.excutedTraineesForm.reset();

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
      this.excutedTraineesForm.controls['excutedId'].setValue(this.editData.excutedId);
      console.log("Enteeeeerrr edit condition: ", this.excutedTraineesForm.value)

      this.api.putTrExcutedTrainee(this.excutedTraineesForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.excutedTraineesForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.excutedTraineesForm.removeControl('id')
    }
  }


  getTrTrainee() {
    this.api.getTrTrainee()
      .subscribe({
        next: (res) => {
          this.traineesList = res;
          console.log("traineesList res: ", this.traineesList);
        },
        error: (err) => {
          console.log("fetch traineesList data err: ", err);
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  getHrEmployees() {
    this.api.getHrEmployees()
      .subscribe({
        next: (res) => {
          this.employeesList = res;
          console.log("employeesList res: ", this.employeesList);
        },
        error: (err) => {
          console.log("fetch employeesList data err: ", err);
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
