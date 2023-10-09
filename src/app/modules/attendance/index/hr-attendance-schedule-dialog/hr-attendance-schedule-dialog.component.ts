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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-hr-attendance-schedule-dialog',
  templateUrl: './hr-attendance-schedule-dialog.component.html',
  styleUrls: ['./hr-attendance-schedule-dialog.component.css']
})
export class HrAttendanceScheduleDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')

  formcontrol = new FormControl('');  
  EmployeeAttendancePermission !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
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
    private dialogRef : MatDialogRef<HrAttendanceScheduleDialogComponent>){
    }
    ngOnInit(): void {
      this.EmployeeAttendancePermission = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      startDate : ['',Validators.required],
      endDate : ['',Validators.required],
      wrkHours : ['',Validators.required],
      attendanceTime : ['',Validators.required],
      attendanceAllowance : ['',Validators.required],
      departureAllowance : ['',Validators.required],
      id : ['',Validators.required],
      });
      
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addEmployeeAttendancePermission();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
      this.EmployeeAttendancePermission.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.EmployeeAttendancePermission.controls['name'].setValue(this.editData.name);
      this.EmployeeAttendancePermission.controls['startDate'].setValue(this.editData.startDate);
      this.EmployeeAttendancePermission.controls['endDate'].setValue(this.editData.endDate);
      this.EmployeeAttendancePermission.controls['wrkHours'].setValue(this.editData.wrkHours);
      this.EmployeeAttendancePermission.controls['attendanceTime'].setValue(this.editData.attendanceTime);
      this.EmployeeAttendancePermission.controls['attendanceAllowance'].setValue(this.editData.attendanceAllowance);
      this.EmployeeAttendancePermission.controls['departureAllowance'].setValue(this.editData.departureAllowance);
      this.EmployeeAttendancePermission.addControl('id', new FormControl('', Validators.required));
      this.EmployeeAttendancePermission.controls['id'].setValue(this.editData.id);
      }
    }

  addEmployeeAttendancePermission(){
    if(!this.editData){
      
      this.EmployeeAttendancePermission.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.EmployeeAttendancePermission.value);
      this.EmployeeAttendancePermission.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.EmployeeAttendancePermission.valid){
        this.api.postHrAttendanceSchedule(this.EmployeeAttendancePermission.value)
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
        this.api.putHrAttendanceSchedule(this.EmployeeAttendancePermission.value)
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

