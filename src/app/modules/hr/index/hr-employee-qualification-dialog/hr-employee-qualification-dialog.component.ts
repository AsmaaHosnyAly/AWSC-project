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
export class Qualification {
  constructor(public id: number, public name: string) {}
}
export class QualificationLevel {
  constructor(public id: number, public name: string) {}
}
export class Specialization {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-employee-qualification-dialog',
  templateUrl: './hr-employee-qualification-dialog.component.html',
  styleUrls: ['./hr-employee-qualification-dialog.component.css']
})
export class HrEmployeeQualificationDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  employeeCtrl: FormControl;
  filteredEmployee: Observable<Employee[]>;
  employees: Employee[] = [];
  selectedEmployee: Employee | undefined;
  getEmployeeData: any;

  qualificationCtrl: FormControl;
  filteredQualification: Observable<Qualification[]>;
  qualifications: Qualification[] = [];
  selectedQualification: Qualification | undefined;
  getQualificationData: any;

  qualificationLevelCtrl: FormControl;
  filteredQualificationLevel: Observable<QualificationLevel[]>;
  qualificationLevels: QualificationLevel[] = [];
  selectedqualificationLevel: QualificationLevel | undefined;
  getQualificationLevelData: any;

  specializationCtrl: FormControl;
  filteredSpecialization: Observable<Specialization[]>;
  specializations: Specialization[] = [];
  selectedSpecialization: Specialization | undefined;
  getSpecializationData: any;

  formcontrol = new FormControl('');  
  EmployeeQualificationForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
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
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrEmployeeQualificationDialogComponent>){
      this.employeeCtrl = new FormControl();
      this.filteredEmployee = this.employeeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterEmployee(value))
      );

      this.qualificationCtrl = new FormControl();
      this.filteredQualification = this.qualificationCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterQualification(value))
      );

      this.qualificationLevelCtrl = new FormControl();
      this.filteredQualificationLevel = this.qualificationLevelCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterQualificationLevel(value))
      );

      this.specializationCtrl = new FormControl();
      this.filteredSpecialization = this.specializationCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterSpecialization(value))
      );
    }
    ngOnInit(): void {
      this.EmployeeQualificationForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],    
      date : ['',Validators.required],
      employeeId : ['',Validators.required],
      qualificationId : ['',Validators.required],
      qualificationLevelId : ['',Validators.required],
      specializationId : ['',Validators.required],
      attachment: [''],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllEmployee().subscribe((employee)=>{
        this.employees = employee;
      });

      this.api.getAllQualification().subscribe((qualification)=>{
        this.qualifications = qualification;
      });

      this.api.getAllQualificationLevel().subscribe((qualificationLevel)=>{
        this.qualificationLevels = qualificationLevel;
      });

      this.api.getAllSpecialization().subscribe((specialization)=>{
        this.specializations = specialization;
      });
      
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addEmployeeQualification();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getEmployeeData = this.editData;
      this.getQualificationData = this.editData;
      this.getQualificationLevelData = this.editData;
      this.getSpecializationData = this.editData;
      this.EmployeeQualificationForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.cityStateForm.controls['code'].setValue(this.editData.code);      
      this.EmployeeQualificationForm.controls['date'].setValue(this.editData.date);
      this.EmployeeQualificationForm.controls['employeeId'].setValue(this.editData.employeeId);
      this.EmployeeQualificationForm.controls['qualificationId'].setValue(this.editData.qualificationId);
      this.EmployeeQualificationForm.controls['qualificationLevelId'].setValue(this.editData.qualificationLevelId);
      this.EmployeeQualificationForm.controls['specializationId'].setValue(this.editData.specializationId);
      this.EmployeeQualificationForm.controls['attachment'].setValue(this.editData.attachment);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.EmployeeQualificationForm.addControl('id', new FormControl('', Validators.required));
      this.EmployeeQualificationForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayEmployeeName(employee: any): string {
      return employee && employee.name ? employee.name : '';
    }

    employeeSelected(event: MatAutocompleteSelectedEvent): void {
      const employee = event.option.value as Employee;
      this.selectedEmployee = employee;
      this.EmployeeQualificationForm.patchValue({ employeeId: employee.id });
      this.EmployeeQualificationForm.patchValue({ employeeName: employee.name });
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

    displayQualificationName(qualification: any): string {
      return qualification && qualification.name ? qualification.name : '';
    }

    qualificationSelected(event: MatAutocompleteSelectedEvent): void {
      const qualification = event.option.value as Qualification;
      this.selectedQualification = qualification;
      this.EmployeeQualificationForm.patchValue({ qualificationId: qualification.id });
      this.EmployeeQualificationForm.patchValue({ qualificationName: qualification.name });
    }

    private _filterQualification(value: string): Qualification[] {
      const filterValue = value.toLowerCase();
      return this.qualifications.filter(qualification =>
        qualification.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoQualification() {
      this.qualificationCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.qualificationCtrl.updateValueAndValidity();
    }
    
    displayQualificationLevelName(qualificationLevel: any): string {
      return qualificationLevel && qualificationLevel.name ? qualificationLevel.name : '';
    }

    qualificationLevelSelected(event: MatAutocompleteSelectedEvent): void {
      const qualificationLevel = event.option.value as QualificationLevel;
      this.selectedqualificationLevel = qualificationLevel;
      this.EmployeeQualificationForm.patchValue({ qualificationLevelId: qualificationLevel.id });
      this.EmployeeQualificationForm.patchValue({ qualificationLeveName: qualificationLevel.name });
    }

    private _filterQualificationLevel(value: string): QualificationLevel[] {
      const filterValue = value.toLowerCase();
      return this.qualificationLevels.filter(qualificationLevel =>
        qualificationLevel.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoQualificationLevel() {
      this.qualificationLevelCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.qualificationLevelCtrl.updateValueAndValidity();
    }

    displaySpecializationName(specialization: any): string {
      return specialization && specialization.name ? specialization.name : '';
    }

    specializationSelected(event: MatAutocompleteSelectedEvent): void {
      const specialization = event.option.value as Specialization;
      this.selectedSpecialization = specialization;
      this.EmployeeQualificationForm.patchValue({ employeeId: specialization.id });
      this.EmployeeQualificationForm.patchValue({ employeeName: specialization.name });
    }

    private _filterSpecialization(value: string): Specialization[] {
      const filterValue = value.toLowerCase();
      return this.specializations.filter(specialization =>
        specialization.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoSpecialization() {
      this.specializationCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.specializationCtrl.updateValueAndValidity();
    }

  addEmployeeQualification(){
    if(!this.editData){
      
      this.EmployeeQualificationForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.EmployeeQualificationForm.value);
      this.EmployeeQualificationForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.EmployeeQualificationForm.valid){
        this.api.postEmployeeQualification(this.EmployeeQualificationForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.EmployeeQualificationForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateEmployeeQualification()
    }
  }


  updateEmployeeQualification(){
        this.api.putEmployeeQualification(this.EmployeeQualificationForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.EmployeeQualificationForm.reset();
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
