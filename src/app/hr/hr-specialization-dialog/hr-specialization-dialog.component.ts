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

export class Qualification {
  constructor(public id: number, public name: string, public code: string) {}
}

@Component({
  selector: 'app-hr-specialization-dialog',
  templateUrl: './hr-specialization-dialog.component.html',
  styleUrls: ['./hr-specialization-dialog.component.css']
})
export class HrSpecializationDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  QualificationCtrl: FormControl;
  filteredQualification: Observable<Qualification[]>;
  qualification: Qualification[] = [];
  selectedQualification: Qualification | undefined;
  formcontrol = new FormControl('');  
  specializationForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getspecializationData: any;
  Id:string  | undefined | null;
//    commidityDt:any={
//   id:0,
// }
commname:any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
commoditylist:any;
storeList: any;
commodityName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrSpecializationDialogComponent>){
      this.QualificationCtrl = new FormControl();
      this.filteredQualification = this.QualificationCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterQualification(value))
      );
    }
    ngOnInit(): void {
      this.specializationForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      qualificationId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllqualification().subscribe((hrqualification) => {
        this.qualification = hrqualification;
      });
      
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getspecializationData = this.editData;
      this.specializationForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.accountItemForm.controls['code'].setValue(this.editData.code);
      this.specializationForm.controls['name'].setValue(this.editData.name);
      
      this.specializationForm.controls['qualificationId'].setValue(this.editData.qualificationId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.specializationForm.addControl('id', new FormControl('', Validators.required));
      this.specializationForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayqualificationName(qualification: any): string {
      return qualification && qualification.name ? qualification.name : '';
    }
    qualificationSelected(event: MatAutocompleteSelectedEvent): void {
      const qualification = event.option.value as Qualification;
      this.selectedQualification = qualification;
      this.specializationForm.patchValue({ qualificationId: qualification.id });
      this.specializationForm.patchValue({ qualificationName: qualification.name });
    }
    private _filterQualification(value: string): Qualification[] {
      const filterValue = value.toLowerCase();
    return this.qualification.filter(qualifications =>
      qualifications.name.toLowerCase().includes(filterValue) || qualifications.code.toLowerCase().includes(filterValue)
    );
    }

    openAutoQualification() {
      this.QualificationCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.QualificationCtrl.updateValueAndValidity();
    }

    

  addHrspecialization(){
    if(!this.editData){
      
      this.specializationForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.specializationForm.value);
      this.specializationForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.specializationForm.valid){
        this.api.postHrspecialization(this.specializationForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.specializationForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateHrspecialization()
    }
  }

 
      updateHrspecialization(){
        this.api.putHrspecialization(this.specializationForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.specializationForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }

}
