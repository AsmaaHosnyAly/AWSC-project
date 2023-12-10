import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';
import { ParseSourceSpan } from '@angular/compiler';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { UploadService } from 'src/app/upload.service';
export class Employee {
  constructor(public id: number, public name: string) {}
}

export class AttendanceSchedule {
  constructor(public id: number, public name: string) {}
}

export class AttendancePermission {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-employee-attendance-schedule-dialoge',
  templateUrl: './hr-employee-attendance-schedule-dialoge.component.html',
  styleUrls: ['./hr-employee-attendance-schedule-dialoge.component.css']
})
export class HrEmployeeAttendanceScheduleDialogeComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')
  employeeCtrl: FormControl;
  filteredEmployees: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;

  attendanceScheduleCtrl: FormControl;
  filteredAttendanceSchedules: Observable<AttendanceSchedule[]>;
  attendanceSchedules: AttendanceSchedule[] = [];
  selectedAttendanceSchedule: AttendanceSchedule | undefined;

  attendancePermissionCtrl: FormControl;
  filteredAttendancePermissions: Observable<AttendancePermission[]>;
  attendancePermissions: AttendancePermission[] = [];
  selectedAttendancePermission: AttendancePermission | undefined;

  getEmployeeAttendanceScheduleData: any;
  EmployeeAttendanceScheduleForm!: FormGroup;
  actionBtn: string = 'حفظ';
  productIdToEdit: any;
  existingNames: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<HrEmployeeAttendanceScheduleDialogeComponent>,
    private toastr: ToastrService
  ) {
    this.employeeCtrl = new FormControl();
    this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filteremployees(value))
    );

    this.attendanceScheduleCtrl = new FormControl();
    this.filteredAttendanceSchedules= this.attendanceScheduleCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAttendanceSchedules(value))
    );

    this.attendancePermissionCtrl = new FormControl();
    this.filteredAttendancePermissions = this.attendancePermissionCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAttendancePermissions(value))
    );
  }

  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.EmployeeAttendanceScheduleForm = this.formBuilder.group({
      name: ['', Validators.required],
      employeeId: ['', Validators.required],
      attendanceScheduleId: ['', Validators.required],
      attendancePermissionId: ['', Validators.required],
      transactionUserId: ['',Validators.required],
    });
    this.getEmployees();
    
      // this.employees = employees;
      // this.api.getEmployee().subscribe((lists) => {
      //   this.employees = lists;
       
      // });
   

    this.api.getAllAttendanceSchedules().subscribe((attendanceSchedules) => {
      this.attendanceSchedules = attendanceSchedules;
    });

    this.api.getHrAttendancePermission().subscribe((attendancePermissions) => {
      this.attendancePermissions = attendancePermissions;
    });

    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addEmployeeAttendanceSchedule();
        return false; // Prevent the default browser behavior
      })
    );

    if (this.editData) {
      this.actionBtn = 'تحديث';
      this.getEmployeeAttendanceScheduleData = this.editData;
      // alert( this.EmployeeAttendanceScheduleForm.controls['name'].setValue(this.editData.name))
      this.EmployeeAttendanceScheduleForm.controls['name'].setValue(this.editData.name);
      this.EmployeeAttendanceScheduleForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.EmployeeAttendanceScheduleForm.controls['attendanceScheduleId'].setValue(this.editData.attendanceScheduleId);
      this.EmployeeAttendanceScheduleForm.controls['attendancePermissionId'].setValue(this.editData.attendancePermissionId);
      this.EmployeeAttendanceScheduleForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.EmployeeAttendanceScheduleForm.addControl('id', new FormControl('', Validators.required));
      this.EmployeeAttendanceScheduleForm.controls['id'].setValue(this.editData.id);
    }
  }
  getEmployees() {
    this.api.getEmployee().subscribe((lists) => {
      this.employees = lists;
     
    });
  }
  displayEmployeeName(employee: any): string {
    return employee ? employee.name && employee.name != null ? employee.name : '-' : '';
  }
  employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    console.log('employee selected: ', employee);
    this.selectedEmployee = employee;

    this.EmployeeAttendanceScheduleForm.patchValue({ employeeId: employee.id });
    this.EmployeeAttendanceScheduleForm.patchValue({ employeeName: employee.name });
  

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

  displayAttendanceScheduleName(attendanceSchedule: any): string {
    return attendanceSchedule && attendanceSchedule.name ? attendanceSchedule.name : '';
  }

  attendanceScheduleSelected(event: MatAutocompleteSelectedEvent): void {
    const attendanceSchedule = event.option.value as AttendanceSchedule;
    this.selectedAttendanceSchedule = attendanceSchedule;
    this.EmployeeAttendanceScheduleForm.patchValue({ attendanceScheduleId: attendanceSchedule.id });
    this.EmployeeAttendanceScheduleForm.patchValue({ attendanceScheduleName: attendanceSchedule.name });
  }

  private _filterAttendanceSchedules(value: string): AttendanceSchedule[] {
    const filterValue = value.toLowerCase();
    return this.attendanceSchedules.filter(
      (attendanceSchedule) => attendanceSchedule.name.toLowerCase().includes(filterValue)
      );
  }

  openAutoAttendanceSchedule() {
    this.attendanceScheduleCtrl.setValue('');
    this.attendanceScheduleCtrl.updateValueAndValidity();
  }

  displayAttendancePermissionName(attendancePermission: any): string {
    return attendancePermission && attendancePermission.name ? attendancePermission.name : '';
  }

  attendancePermissionSelected(event: MatAutocompleteSelectedEvent): void {
    const attendancePermission = event.option.value as AttendancePermission;
    this.selectedAttendancePermission = attendancePermission;
    this.EmployeeAttendanceScheduleForm.patchValue({ attendancePermissionId: attendancePermission.id });
    this.EmployeeAttendanceScheduleForm.patchValue({ attendancePermissionName: attendancePermission.name });
  }

  private _filterAttendancePermissions(value: string): AttendancePermission[] {
    const filterValue = value.toLowerCase();
    return this.attendancePermissions.filter(
      (attendancePermission) => attendancePermission.name.toLowerCase().includes(filterValue)
      );
  }

  openAutoAttendancePermission() {
    this.attendancePermissionCtrl.setValue('');
    this.attendancePermissionCtrl.updateValueAndValidity();
  }

  getExistingNames() {
    this.api.getHrEmployeeAttendanceSchedule().subscribe({
      next: (res) => {
        this.existingNames = res.map((product: any) => product.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      },
    });
  }
  

  addEmployeeAttendanceSchedule() {
    if (!this.editData) {
      const enteredName = this.EmployeeAttendanceScheduleForm.get('name')?.value;
      this.EmployeeAttendanceScheduleForm.controls['transactionUserId'].setValue(this.transactionUserId);

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }
      this.EmployeeAttendanceScheduleForm.removeControl('id');
      if (this.EmployeeAttendanceScheduleForm.valid) {
        
        this.api.postHrEmployeeAttendanceSchedule(this.EmployeeAttendanceScheduleForm.value).subscribe({
          next: (res) => {
            console.log('add product res: ', res);
            this.productIdToEdit = res.id;

            this.toastrSuccess();
            this.EmployeeAttendanceScheduleForm.reset();

            this.dialogRef.close('save');
          },
          error: (err) => {
            console.log('error:',err)
              this.toastrErrorSave(); 
          },
        });
      }
      // }
    } else {
      this.updateEmployeeAttendanceSchedule();
    }
  }

  updateEmployeeAttendanceSchedule() {
    console.log('update product last values, id: ', this.EmployeeAttendanceScheduleForm.value);
    this.api.putHrEmployeeAttendanceSchedule(this.EmployeeAttendanceScheduleForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.EmployeeAttendanceScheduleForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        this.toastrErrorEdit();
      },
    });
  }


  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEdit(): void {
    this.toastr.success('تم التحديث بنجاح');
  }

  toastrErrorSave(): void {
    this.toastr.error('!خطأ عند حفظ البيانات');
  }

  toastrErrorEdit(): void {
    this.toastr.error('!خطأ عند تحديث البيانات');
  }
  
}

