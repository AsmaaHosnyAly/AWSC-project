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

export class Commodity {
  constructor(public id: number, public name: string, public code: string) {}
}

export class Grade {
  constructor(public id: number, public name: string, public code: string,public commodityId: number) {}
}



@Component({
  selector: 'app-str-platoon-dialog',
  templateUrl: './str-platoon-dialog.component.html',
  styleUrls: ['./str-platoon-dialog.component.css']
})
export class STRPlatoonDialogComponent implements OnInit{
  transactionUserId=localStorage.getItem('transactionUserId')
  commodityCtrl: FormControl;
  filteredCommodities: Observable<Commodity[]>;
  commodities: Commodity[] = [];
  gradeCtrl: FormControl;
  filteredGrades: Observable<Grade[]>;
  grades: Grade[] = [];
  selectedCommodity: Commodity | undefined;
  selectedGrade: Grade | undefined;
  formcontrol = new FormControl('');  
  platoonForm !:FormGroup;
  selectedOption: any;
  getPlatoonData: any;
  actionBtn : string = "حفظ"
  Code:any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
gradeName: any;
  constructor(private formBuilder : FormBuilder,
     private api : ApiService,
     private readonly route:ActivatedRoute,
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<STRPlatoonDialogComponent>){
      this.commodityCtrl = new FormControl();
    this.filteredCommodities = this.commodityCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCommodities(value))
    );

    this.gradeCtrl = new FormControl();
    this.filteredGrades = this.gradeCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGrades(value))
    );
     }

     
  ngOnInit(): void {
    this.platoonForm = this.formBuilder.group({
      transactionUserId : ['',Validators.required],
      code : [''],
      name : ['',Validators.required],
      commodityId : ['',Validators.required],
      gradeId : ['',Validators.required],
      gradeName : [''],
       id : [''],
    });
    

    this.api.getAllCommodities().subscribe((commodities)=>{
      this.commodities = commodities;
    });

    this.api.getAllGrades().subscribe((grades)=>{
      this.grades = grades;
    });
    
    

    if(this.editData){
      this.actionBtn = "تعديل";
      this.getPlatoonData = this.editData;
      this.platoonForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.platoonForm.controls['code'].setValue(this.editData.code);
      this.platoonForm.controls['name'].setValue(this.editData.name);
      this.platoonForm.controls['commodityId'].setValue(this.editData.commodityId);
      this.platoonForm.controls['gradeId'].setValue(this.editData.gradeId);
      this.platoonForm.controls['gradeName'].setValue(this.editData.gradeName);
      this.platoonForm.addControl('id', new FormControl('', Validators.required));
     this.platoonForm.controls['id'].setValue(this.editData.id);
    }
  }


displayCommodityName(commodity: any): string {
  return commodity && commodity.name ? commodity.name : '';
}

displayGradeName(grade: any): string {
  return grade && grade.name ? grade.name : '';
}

commoditySelected(event: MatAutocompleteSelectedEvent): void {
  const commodity = event.option.value as Commodity;
  this.selectedCommodity = commodity;
  this.platoonForm.patchValue({ commodityId: commodity.id });
  this.platoonForm.patchValue({ commodityName: commodity.name });
  this.gradeCtrl.setValue('');
}

gradeSelected(event: MatAutocompleteSelectedEvent): void {
  const grade = event.option.value as Grade;
  this.selectedGrade = grade;
  this.platoonForm.patchValue({ gradeId: grade.id });
  this.platoonForm.patchValue({ gradeName: grade.name });
  this.getCodeByGradeId();
}

private _filterCommodities(value: string): Commodity[] {
  const filterValue = value.toLowerCase();
  return this.commodities.filter(commodity =>
    commodity.name.toLowerCase().includes(filterValue) || commodity.code.toLowerCase().includes(filterValue)
  );
}

private _filterGrades(value: string): Grade[] {
  const filterValue = value.toLowerCase();
  return this.grades.filter(
    grade =>
      (grade.name.toLowerCase().includes(filterValue) || grade.code.toLowerCase().includes(filterValue)) &&
      grade.commodityId === this.selectedCommodity?.id
  );
}

openAutoCommodity() {
  this.commodityCtrl.setValue(''); // Clear the input field value

  // Open the autocomplete dropdown by triggering the value change event
  this.commodityCtrl.updateValueAndValidity();
}
openAutoGrade() {
  this.gradeCtrl.setValue(''); // Clear the input field value

  // Open the autocomplete dropdown by triggering the value change event
  this.gradeCtrl.updateValueAndValidity();
}

getCodeByGradeId() {
  console.log("gradeid:",this.selectedGrade?.id);
  this.api.getPlatoonCode(this.selectedGrade?.id).subscribe({
    
    
    next: (res) => {

      this.Code = res;
      console.log('platoonCode: ', this.Code);
    },
    error: (err) => {
      console.log('get code. err: ', err);
      // this.Code = err.error.text;
    },
  });
}

  addPlatoon(){
    this.platoonForm.controls['code'].setValue(this.Code);
    if(!this.editData){      
      this.platoonForm.removeControl('id')
      // this.platoonForm.controls['commodityId'].setValue(this.selectedOption.id);
      // this.platoonForm.controls['gradeId'].setValue(this.selectedOption.id);
      console.log("add: ", this.platoonForm.value);
      this.platoonForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.platoonForm.valid){
        this.api.postPlatoon(this.platoonForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.platoonForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند تحديث البيانات") 
          }
        })
      }
    }else{
      this.updatePlatoon()
    }
  }
  
    updatePlatoon(){
    console.log("update platoonForm last values, id: ", this.platoonForm.value)

      this.api.putPlatoon(this.platoonForm.value)
      .subscribe({
        next:(res)=>{
          alert("تم التحديث بنجاح");
          this.platoonForm.reset();
          this.dialogRef.close('update');
        },
        error:()=>{
          alert("خطأ عند تحديث البيانات");
        }
      })
    } 

}
