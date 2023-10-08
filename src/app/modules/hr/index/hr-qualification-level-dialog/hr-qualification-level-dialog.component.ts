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
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-hr-qualification-level-dialog',
  templateUrl: './hr-qualification-level-dialog.component.html',
  styleUrls: ['./hr-qualification-level-dialog.component.css']
})
export class HrQualificationLevelDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  formcontrol = new FormControl('');  
  qualificationForm!: FormGroup;
  actionBtn : string = "حفظ";  
 dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,private toastr: ToastrService,
    private readonly route:ActivatedRoute,private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrQualificationLevelDialogComponent>){
 
    }
    ngOnInit(): void {
      this.qualificationForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],    
      id : ['',Validators.required],
      });  
      
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addQualificationLevel();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
      this.qualificationForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.qualificationForm.controls['name'].setValue(this.editData.name);
      this.qualificationForm.addControl('id', new FormControl('', Validators.required));
      this.qualificationForm.controls['id'].setValue(this.editData.id);
      }
    }


    

    addQualificationLevel(){
    if(!this.editData){
      
      this.qualificationForm.removeControl('id')
      // this.qualificationForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.qualificationForm.value);
      this.qualificationForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.qualificationForm.valid){
        this.api.postQualificationLevel(this.qualificationForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess()
            // alert("تمت الاضافة بنجاح");
            this.qualificationForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateQualificationLevel()
    }
  }
      updateQualificationLevel(){
        this.api.putQualificationLevel(this.qualificationForm.value)
        .subscribe({
          next:(res)=>{
            // alert("تم التحديث بنجاح");
            this.toastrEditSuccess()
            this.qualificationForm.reset();
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
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }

}
