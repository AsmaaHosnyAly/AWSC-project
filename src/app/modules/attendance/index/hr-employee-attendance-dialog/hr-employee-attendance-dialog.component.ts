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
export class attendanceMachine {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-employee-attendance-dialog',
  templateUrl: './hr-employee-attendance-dialog.component.html',
  styleUrls: ['./hr-employee-attendance-dialog.component.css']
})
export class HrEmployeeAttendanceDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');  
  EmployeeAttendance!:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getEmployeeAttendanceData: any;

  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;

  attendanceMachineCtrl: FormControl;
  filteredAttendanceMachine: Observable<attendanceMachine[]>;
  attendanceMachines: attendanceMachine[] = [];
  selectedAttendanceMachine: attendanceMachine | undefined;
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
    private dialogRef : MatDialogRef<HrEmployeeAttendanceDialogComponent>){
      this.employeeCtrl = new FormControl();
      this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterEmployee(value))
      );

      this.attendanceMachineCtrl = new FormControl();
      this.filteredAttendanceMachine= this.attendanceMachineCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAttendanceMachine(value))
      );
    }
    ngOnInit(): void {
      this.EmployeeAttendance = this.formBuilder.group({
        //define the components of the form
      transactionUserId : [ '',Validators.required],
      // code : ['',Validators.required],
      // name : ['',Validators.required],
      date : ['',Validators.required],
      attendance : ['',Validators.required],
      departure : ['',Validators.required],
      employeeId : ['',Validators.required],
      attendanceMachineId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getEmployees().subscribe((employee)=>{
        this.employees = employee;
      });
      this.api.getHrAttendanceMachine().subscribe((attendanceMachine)=>{
        this.attendanceMachines = attendanceMachine;
      });
      
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addEmployeeAttendance();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
        this.getEmployeeAttendanceData = this.editData;
      this.EmployeeAttendance.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.cityStateForm.controls['code'].setValue(this.editData.code);
      // this.EmployeeAttendance.controls['name'].setValue(this.editData.name);
      this.EmployeeAttendance.controls['employeeId'].setValue(this.editData.employeeId);
      this.EmployeeAttendance.controls['date'].setValue(this.editData.date);
      this.EmployeeAttendance.controls['attendance'].setValue(this.editData.attendance);
      this.EmployeeAttendance.controls['departure'].setValue(this.editData.departure);
      this.EmployeeAttendance.controls['attendanceMachineId'].setValue(this.editData.attendanceMachineId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.EmployeeAttendance.addControl('id', new FormControl('', Validators.required));
      this.EmployeeAttendance.controls['id'].setValue(this.editData.id);
      }
    }

    displayEmployeeName(employee: any): string {
      return employee && employee.name ? employee.name : '';
    }

    employeeSelected(event: MatAutocompleteSelectedEvent): void {
      const employee = event.option.value as Employee;
      this.selectedEmployee = employee;
      this.EmployeeAttendance.patchValue({ employeeId: employee.id });
      this.EmployeeAttendance.patchValue({ employeeName: employee.name });
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
    displayAttendanceMachineName(attendanceMachine: any): string {
      return attendanceMachine && attendanceMachine.name ? attendanceMachine.name : '';
    }

    attendanceMachineSelected(event: MatAutocompleteSelectedEvent): void {
      const attendanceMachine = event.option.value as attendanceMachine;
      this.selectedAttendanceMachine = attendanceMachine;
      this.EmployeeAttendance.patchValue({ attendanceMachineId: attendanceMachine.id });
      this.EmployeeAttendance.patchValue({ attendanceMachineName: attendanceMachine.name });
    }

    private _filterAttendanceMachine(value: string): attendanceMachine[] {
      const filterValue = value.toLowerCase();
      return this.attendanceMachines.filter(attendanceMachine =>
        attendanceMachine.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoAttendanceMachine() {
      this.attendanceMachineCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.attendanceMachineCtrl.updateValueAndValidity();
    }
    

  addEmployeeAttendance(){
    if(!this.editData){
      
      this.EmployeeAttendance.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.EmployeeAttendance.value);
      this.EmployeeAttendance.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.EmployeeAttendance.valid){
        this.api.postHrEmployeeAttendance(this.EmployeeAttendance.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.EmployeeAttendance.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateEmployeeAttendance()
    }
  }


  updateEmployeeAttendance(){
        this.api.putHrEmployeeAttendance(this.EmployeeAttendance.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.EmployeeAttendance.reset();
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
