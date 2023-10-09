import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
// import { publishFacade } from '@angular/compiler';
// import { STRGradeComponent } from '../str-grade/str-grade.component';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class Employee {
  constructor(public id: number, public name: string) {}
}
export class attendancePermission {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-employee-attendance-permission-dialog',
  templateUrl: './hr-employee-attendance-permission-dialog.component.html',
  styleUrls: ['./hr-employee-attendance-permission-dialog.component.css']
})
export class HrEmployeeAttendancePermissionDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');  
  EmployeeAttendancePermission !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getEmployeeAttendancePermissionData: any;

  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;

  attendancePermissionCtrl: FormControl;
  filteredAttendancePermission: Observable<attendancePermission[]>;
  attendancePermissions: attendancePermission[] = [];
  selectedAttendancePermission: attendancePermission | undefined;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;

  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrEmployeeAttendancePermissionDialogComponent>){
      this.employeeCtrl = new FormControl();
      this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterEmployee(value))
      );

      this.attendancePermissionCtrl = new FormControl();
      this.filteredAttendancePermission = this.attendancePermissionCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAttendancePermission(value))
      );
    }
    ngOnInit(): void {
      this.EmployeeAttendancePermission = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      // code : ['',Validators.required],
      name : ['',Validators.required],
      date : ['',Validators.required],
      employeeId : ['',Validators.required],
      attendancePermissionId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getEmployees().subscribe((employee)=>{
        this.employees = employee;
      });
      this.api.getHrAttendancePermission().subscribe((attendancePermission)=>{
        this.attendancePermissions = attendancePermission;
      });
      
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addEmployeeAttendancePermission();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
        this.getEmployeeAttendancePermissionData = this.editData;
      this.EmployeeAttendancePermission.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.cityStateForm.controls['code'].setValue(this.editData.code);
      this.EmployeeAttendancePermission.controls['name'].setValue(this.editData.name);
      this.EmployeeAttendancePermission.controls['employeeId'].setValue(this.editData.employeeId);
      this.EmployeeAttendancePermission.controls['date'].setValue(this.editData.date);
      
      this.EmployeeAttendancePermission.controls['attendancePermissionId'].setValue(this.editData.attendancePermissionId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.EmployeeAttendancePermission.addControl('id', new FormControl('', Validators.required));
      this.EmployeeAttendancePermission.controls['id'].setValue(this.editData.id);
      }
    }

    displayEmployeeName(employee: any): string {
      return employee && employee.name ? employee.name : '';
    }

    employeeSelected(event: MatAutocompleteSelectedEvent): void {
      const employee = event.option.value as Employee;
      this.selectedEmployee = employee;
      this.EmployeeAttendancePermission.patchValue({ employeeId: employee.id });
      this.EmployeeAttendancePermission.patchValue({ employeeName: employee.name });
    }

    private _filterEmployee(value: string): Employee[] {
      const filterValue = value.toLowerCase();
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoemployee() {
      this.employeeCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.employeeCtrl.updateValueAndValidity();
    }
    displayAttendancePermissionName(attendancePermission: any): string {
      return attendancePermission && attendancePermission.name ? attendancePermission.name : '';
    }

    attendancePermissionSelected(event: MatAutocompleteSelectedEvent): void {
      const attendancePermission = event.option.value as Employee;
      this.selectedAttendancePermission = attendancePermission;
      this.EmployeeAttendancePermission.patchValue({ attendancePermissionId: attendancePermission.id });
      this.EmployeeAttendancePermission.patchValue({ attendancePermissionName: attendancePermission.name });
    }

    private _filterAttendancePermission(value: string): Employee[] {
      const filterValue = value.toLowerCase();
      return this.attendancePermissions.filter(attendancePermission =>
        attendancePermission.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoAttendancePermission() {
      this.attendancePermissionCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.attendancePermissionCtrl.updateValueAndValidity();
    }
    

  addEmployeeAttendancePermission(){
    if(!this.editData){
      
      this.EmployeeAttendancePermission.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.EmployeeAttendancePermission.value);
      this.EmployeeAttendancePermission.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.EmployeeAttendancePermission.valid){
        this.api.postHrEmployeeAttendancePermission(this.EmployeeAttendancePermission.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.EmployeeAttendancePermission.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateEmployeeAttendancePermission()
    }
  }


  updateEmployeeAttendancePermission(){
        this.api.putHrEmployeeAttendancePermission(this.EmployeeAttendancePermission.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.EmployeeAttendancePermission.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
      toastrSuccess(): void {
        this.toastr.success('تم الحفظ بنجاح');
      }
      
      toastrEditSuccess(): void {
        this.toastr.success('تم التعديل بنجاح');
      }
}
