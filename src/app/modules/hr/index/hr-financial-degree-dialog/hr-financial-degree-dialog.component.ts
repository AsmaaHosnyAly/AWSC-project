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

@Component({
  selector: 'app-hr-financial-degree-dialog',
  templateUrl: './hr-financial-degree-dialog.component.html',
  styleUrls: ['./hr-financial-degree-dialog.component.css']
})
export class HrFinancialDegreeDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId') 
  formcontrol = new FormControl('');  
  financialDegreeForm !:FormGroup;
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
    private dialogRef : MatDialogRef<HrFinancialDegreeDialogComponent>){
   
    }
    ngOnInit(): void {
      this.financialDegreeForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      // code : ['',Validators.required],
      name : ['',Validators.required],
      noYear : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
   
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addFinancialDegree();
        return false; // Prevent the default browser behavior
      }));
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.financialDegreeForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.cityStateForm.controls['code'].setValue(this.editData.code);
      this.financialDegreeForm.controls['name'].setValue(this.editData.name);
      
      this.financialDegreeForm.controls['noYear'].setValue(this.editData.noYear);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.financialDegreeForm.addControl('id', new FormControl('', Validators.required));
      this.financialDegreeForm.controls['id'].setValue(this.editData.id);
      }
    }

 

    

  addFinancialDegree(){
    if(!this.editData){
      
      this.financialDegreeForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.financialDegreeForm.value);
      this.financialDegreeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.financialDegreeForm.valid){
        this.api.postHrFinancialDegree(this.financialDegreeForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.financialDegreeForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateFinancialDegree()
    }
  }


  updateFinancialDegree(){
        this.api.putHrFinancialDegree(this.financialDegreeForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.financialDegreeForm.reset();
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
