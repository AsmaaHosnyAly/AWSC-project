import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class FiscalYear {
  constructor(public id: number, public fiscalyear: string) { }
}

@Component({
  selector: 'app-hr-incentive-allowance-dialog',
  templateUrl: './hr-incentive-allowance-dialog.component.html',
  styleUrls: ['./hr-incentive-allowance-dialog.component.css']
})
export class HrIncentiveAllowanceDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')
  groupForm !: FormGroup;
  actionBtn : string = "حفظ";
  // groupSelectedSearch: any;
  // basketballPlayers: any;
  // employeesList: any;
  // fiscalYearsList: any;
  // platoonName: any;
  IncentiveAllowanceIdToEdit: any;
  userIdFromStorage: any;

  employeeCtrl: FormControl;
  filteredEmployees: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;
  formcontrol = new FormControl('');

  fiscalYearsList: FiscalYear[] = [];
  fiscalYearCtrl: FormControl;
  filteredFiscalYear: Observable<FiscalYear[]>;
  selectedFiscalYear: FiscalYear | undefined;


  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrIncentiveAllowanceDialogComponent>,
    private toastr: ToastrService) {

      this.employeeCtrl = new FormControl();
      this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filteremployees(value))
      );

    this.fiscalYearCtrl = new FormControl();
    this.filteredFiscalYear = this.fiscalYearCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFiscalYears(value))
    );
  }

  ngOnInit(): void {
    this.getHrEmployees();
    this.getFiscalYears();

    this.groupForm = this.formBuilder.group({
      no: ['', Validators.required],
      date: ['', Validators.required],
      employeeId: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      id: [''],

    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addIncentiveAllowance();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      this.actionBtn = "تعديل";
      this.groupForm.controls['no'].setValue(this.editData.no);
      this.groupForm.controls['date'].setValue(this.editData.date);
      this.groupForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.groupForm.controls['fiscalYearId'].setValue(this.editData.fiscalYearId);
      this.groupForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);


      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }
  }


  displayEmployeeName(employee: any): string {
    return employee ? employee.name && employee.name != null ? employee.name : '-' : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log('employee selected: ', employee);
    this.selectedEmployee = employee;

    this.groupForm.patchValue({ employeeId: employee.id });
    this.groupForm.patchValue({ employeeName: employee.name });
  

  }

  private _filteremployees(value: string): Employee[] {
    const filterValue = value;
    return this.employees.filter((employee) =>
      employee.name ? employee.name.includes(filterValue) : '-'
    );
  }

  openAutoEmployee() {
    this.employeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.employeeCtrl.updateValueAndValidity();
  }
    displayAttendancePermissionName(attendancePermission: any): string {
      return attendancePermission && attendancePermission.name ? attendancePermission.name : '';
    }


  private _filterFiscalYears(value: string): FiscalYear[] {
    const filterValue = value;
    return this.fiscalYearsList.filter(fiscalyearObj =>
      fiscalyearObj.fiscalyear.toLowerCase().includes(filterValue)
    );
  }
  displayFiscalYearName(vacation: any): string {
    return vacation && vacation.fiscalyear ? vacation.fiscalyear : '';
  }
  fiscalYearSelected(event: MatAutocompleteSelectedEvent): void {
    const fiscalyear = event.option.value as FiscalYear;
    console.log("vacation selected: ", fiscalyear);
    this.selectedFiscalYear = fiscalyear;
    this.groupForm.patchValue({ fiscalYearId: fiscalyear.id });
    console.log("vacation in form: ", this.groupForm.getRawValue().fiscalYearId);
  }
  openAutoFiscalYear() {
    this.fiscalYearCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.fiscalYearCtrl.updateValueAndValidity();
  }


  addIncentiveAllowance() {
    // console.log("form entered values", this.productForm.value);
    if (!this.editData) {
      this.groupForm.removeControl('id')

      // if (this.groupForm.getRawValue().platoonId) {
      // this.platoonName = await this.getPlatoonByID(this.groupForm.getRawValue().platoonId);
      // this.groupForm.controls['platoonName'].setValue(this.platoonName);
      this.groupForm.controls['transactionUserId'].setValue(this.transactionUserId);

      // this.groupForm.controls['createUserName'].setValue("211 static name");

      // alert(this.groupForm.getRawValue().platoonName)
      // console.log("form add group value: ", this.groupForm.value)

      if (this.groupForm.valid) {

        this.api.postHrIncentiveAllowance(this.groupForm.value)
          .subscribe({
            next: (res) => {
              console.log("add IncentiveAllowance res: ", res);
              this.IncentiveAllowanceIdToEdit = res.id;

              this.toastrSuccess();
              this.groupForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("حدث خطأ أثناء إضافة الحافز");
              console.log("post IncentiveAllowance with api err: ", err)
            }
          })
      }

    }
    else {
      this.updateIncentiveAllowance()
    }
  }

  updateIncentiveAllowance() {
    console.log("update IncentiveAllowance last values, id: ", this.groupForm.value)
    this.api.putHrIncentiveAllowance(this.groupForm.value)
      .subscribe({
        next: (res) => {
         
          this.toastrEditSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل الحوافز !!")
        }
      })
  }

  getHrEmployees() {
    this.api.getHrEmployees()
      .subscribe({
        next: (res) => {
          this.employees = res;
          console.log("employeesList res: ", this.employees);
        },
        error: (err) => {
          console.log("fetch employeesList data err: ", err);
          alert("خطا اثناء جلب الموظفين !");
        }
      })
  }

  getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: (res) => {
          this.fiscalYearsList = res;
          console.log("fiscalYearsList res: ", this.fiscalYearsList);
        },
        error: (err) => {
          console.log("fetch fiscalYearsList data err: ", err);
          alert("خطا اثناء جلب السنة المالية !");
        }
      })
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
