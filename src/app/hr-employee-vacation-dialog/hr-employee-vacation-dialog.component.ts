import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

export class Employee {
  constructor(public id: number, public name: string, public code: string) { }
}

export class Vacation {
  constructor(public id: number, public name: string) { }
}


@Component({
  selector: 'app-hr-employee-vacation-dialog',
  templateUrl: './hr-employee-vacation-dialog.component.html',
  styleUrls: ['./hr-employee-vacation-dialog.component.css']
})
export class HrEmployeeVacationDialogComponent implements OnInit {
  groupForm !: FormGroup;
  actionBtn: string = "Save";
  userIdFromStorage: any;

  employeesList: Employee[] = [];
  emploeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  selectedEmployee: Employee | undefined;
  formcontrol = new FormControl('');

  vacationsList: Vacation[] = [];
  vacationCtrl: FormControl;
  filteredVacation: Observable<Vacation[]>;
  selectedVacation: Vacation | undefined;
  // formcontrol = new FormControl('');

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrEmployeeVacationDialogComponent>,
    private toastr: ToastrService) {

    this.emploeeCtrl = new FormControl();
    this.filteredEmployee = this.emploeeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEmployees(value))
    );

    this.vacationCtrl = new FormControl();
    this.filteredVacation = this.vacationCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterVacations(value))
    );
  }

  ngOnInit(): void {
    this.getHrEmployees();
    this.getVacation();

    this.groupForm = this.formBuilder.group({
      name: ['', Validators.required],
      nodDays: ['', Validators.required],
      emplpoyeeId: ['', Validators.required],
      vacationId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.groupForm.controls['name'].setValue(this.editData.name);
      this.groupForm.controls['nodDays'].setValue(this.editData.nodDays);
      this.groupForm.controls['emplpoyeeId'].setValue(this.editData.emplpoyeeId);
      this.groupForm.controls['vacationId'].setValue(this.editData.vacationId);
      this.groupForm.controls['startDate'].setValue(this.editData.startDate);
      this.groupForm.controls['endDate'].setValue(this.editData.endDate);

      this.userIdFromStorage = localStorage.getItem('transactionUserId');

      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }
  }

  displayEmployeeName(employee: any): string {
    return employee && employee.name ? employee.name : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log("employee selected: ", employee);
    this.selectedEmployee = employee;
    this.groupForm.patchValue({ emplpoyeeId: employee.id });
    console.log("employee in form: ", this.groupForm.getRawValue().emplpoyeeId);
    // this.groupForm.patchValue({ emplpoyeeId: employee.name });
  }
  private _filterEmployees(value: string): Employee[] {
    const filterValue = value;
    return this.employeesList.filter(employee =>
      employee.name.toLowerCase().includes(filterValue) || employee.code.toLowerCase().includes(filterValue)
    );
  }
  openAutoEmployee() {
    console.log("display employee list: ", this.vacationCtrl)

    this.emploeeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.emploeeCtrl.updateValueAndValidity();
  }


  private _filterVacations(value: string): Vacation[] {
    const filterValue = value;
    return this.vacationsList.filter(vacation =>
      vacation.name.toLowerCase().includes(filterValue)
    );
  }
  displayVacationName(vacation: any): string {
    return vacation && vacation.name ? vacation.name : '';
  }
  vacationSelected(event: MatAutocompleteSelectedEvent): void {
    const vacation = event.option.value as Vacation;
    console.log("vacation selected: ", vacation);
    this.selectedVacation = vacation;
    this.groupForm.patchValue({ vacationId: vacation.id });
    console.log("vacation in form: ", this.groupForm.getRawValue().vacationId);
  }
  openAutoVacation() {
    console.log("display vacation list: ", this.vacationCtrl)

    this.vacationCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.vacationCtrl.updateValueAndValidity();
  }


  addEmployeeVacation() {
    if (!this.editData) {
      this.groupForm.removeControl('id')

      this.userIdFromStorage = localStorage.getItem('transactionUserId');
      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

      console.log("add form with autoComplete: ", this.groupForm.value)

      if (this.groupForm.valid) {
        this.api.postHrEmployeeVacation(this.groupForm.value)
          .subscribe({
            next: (res) => {
              console.log("add EmployeeVacation res: ", res);

              this.toastrSuccess();
              this.groupForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("حدث خطأ أثناء إضافة اجازة الموظف");
              console.log("post EmployeeVacation with api err: ", err)
            }
          })
      }

    }
    else {
      this.updateEmployeeVacation()
    }
  }

  updateEmployeeVacation() {
    console.log("update EmployeeVacation last values, id: ", this.groupForm.value)
    this.api.putHrEmployeeVacation(this.groupForm.value)
      .subscribe({
        next: (res) => {
          alert("تم تحديث اجازة الموظف بنجاح");
          this.toastrSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل اجازة الموظف !!")
        }
      })
  }

  getHrEmployees() {
    this.api.getHrEmployees()
      .subscribe({
        next: (res) => {
          this.employeesList = res;
          // this.commodities = res;
          console.log("employeesList res: ", this.employeesList);
        },
        error: (err) => {
          // console.log("fetch employeesList data err: ", err);
          alert("خطا اثناء جلب الموظفين !");
        }
      })
  }

  getVacation() {
    this.api.getVacation()
      .subscribe({
        next: (res) => {
          this.vacationsList = res;
          // this.commodities = res;
          console.log("vacationsList res: ", this.vacationsList);
        },
        error: (err) => {
          // console.log("fetch vacationsList data err: ", err);
          alert("خطا اثناء جلب الاجازات !");
        }
      })
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}
