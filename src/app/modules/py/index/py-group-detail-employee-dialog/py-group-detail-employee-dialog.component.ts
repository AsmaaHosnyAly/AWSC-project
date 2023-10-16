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


@Component({
  selector: 'app-py-group-detail-employee-dialog',
  templateUrl: './py-group-detail-employee-dialog.component.html',
  styleUrls: ['./py-group-detail-employee-dialog.component.css']
})
export class PyGroupDetailEmployeeDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  groupDetailsForm !: FormGroup;
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PyGroupDetailEmployeeDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.employeeCtrl = new FormControl();
    this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEmployee(value))
    );

  }

  ngOnInit(): void {
    this.getEmployees();
    // this.getFiAccountItems();

    this.groupDetailsForm = this.formBuilder.group({
      itemGroupId: ['', Validators.required],
      employeeId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);
      // this.actionBtnMaster = "Update";

      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.groupDetailsForm.controls['itemGroupId'].setValue(this.editData.itemGroupId);
      this.groupDetailsForm.controls['employeeId'].setValue(this.editData.employeeId);

      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);

    }

  }

  private _filterEmployee(value: string): Employee[] {
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
    this.groupDetailsForm.patchValue({ employeeId: employee.id });
  }
  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }


  async addDetailsInfo() {
    this.getMasterRowId = this.route.url.split('=').pop();
    this.groupDetailsForm.controls['itemGroupId'].setValue(this.getMasterRowId);
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.transactionUserId);

    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.groupDetailsForm.getRawValue().itemGroupId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.groupDetailsForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.valid) {

          this.api.postPyItemGroupEmployee(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)

                // alert("تمت إضافة التفاصيل بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();

                this.dialogRef.close('save');

              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }
        // else {
        //   this.updateBothForms();
        // }

      }

    }
    else {
      console.log("Enteeeeerrr edit condition: ", this.groupDetailsForm.value)

      this.api.putPyItemGroupEmployee(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.groupDetailsForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.groupDetailsForm.removeControl('id')
    }
  }


  getEmployees() {
    this.api.getEmployee()
      .subscribe({
        next: (res) => {
          this.employeesList = res;
          console.log("employees res: ", this.employeesList);
        },
        error: (err) => {
          console.log("fetch employees data err: ", err);
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
