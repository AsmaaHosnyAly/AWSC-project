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
export class Employee {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-employee-appraisal-dialog',
  templateUrl: './hr-employee-appraisal-dialog.component.html',
  styleUrls: ['./hr-employee-appraisal-dialog.component.css']
})
export class HrEmployeeAppraisalDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;
  formcontrol = new FormControl('');  
  AppraisalForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getEmployeeData: any;
  Id:string  | undefined | null;
   commidityDt:any={
  id:0,
}
commname:any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
// citylist:any;
// storeList: any;
// cityName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrEmployeeAppraisalDialogComponent>){
      this.employeeCtrl = new FormControl();
      this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterEmployee(value))
      );
    }
    ngOnInit(): void {
      this.AppraisalForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      // code : ['',Validators.required],
      appraisal : ['',Validators.required],
      date : ['',Validators.required],
      employeeId : ['',Validators.required],
      attachment: [''],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllEmployee().subscribe((employee)=>{
        this.employees = employee;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getEmployeeData = this.editData;
      this.AppraisalForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.cityStateForm.controls['code'].setValue(this.editData.code);
      this.AppraisalForm.controls['appraisal'].setValue(this.editData.appraisal);
      
      this.AppraisalForm.controls['date'].setValue(this.editData.date);
      this.AppraisalForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.AppraisalForm.controls['attachment'].setValue(this.editData.attachment);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.AppraisalForm.addControl('id', new FormControl('', Validators.required));
      this.AppraisalForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayEmployeeName(employee: any): string {
      return employee && employee.name ? employee.name : '';
    }

    employeeSelected(event: MatAutocompleteSelectedEvent): void {
      const employee = event.option.value as Employee;
      this.selectedEmployee = employee;
      this.AppraisalForm.patchValue({ employeeId: employee.id });
      this.AppraisalForm.patchValue({ employeeName: employee.name });
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

    

  addEmployeeAppraisal(){
    if(!this.editData){
      
      this.AppraisalForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.AppraisalForm.value);
      this.AppraisalForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.AppraisalForm.valid){
        this.api.postHrEmployeeAppraisal(this.AppraisalForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.AppraisalForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateEmployeeAppraisal()
    }
  }


  updateEmployeeAppraisal(){
        this.api.putHrEmployeeAppraisal(this.AppraisalForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.AppraisalForm.reset();
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
