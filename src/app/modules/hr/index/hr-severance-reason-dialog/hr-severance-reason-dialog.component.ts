import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-hr-severance-reason-dialog',
  templateUrl: './hr-severance-reason-dialog.component.html',
  styleUrls: ['./hr-severance-reason-dialog.component.css']
})
export class HrSeveranceReasonDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  formcontrol = new FormControl('');  
  SeveranceReasonForm !:FormGroup;
  actionBtn : string = "حفظ"
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrSeveranceReasonDialogComponent>){ }
    ngOnInit(): void {
      this.SeveranceReasonForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
      });
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.SeveranceReasonForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.SeveranceReasonForm.controls['name'].setValue(this.editData.name);;
      this.SeveranceReasonForm.addControl('id', new FormControl('', Validators.required));
      this.SeveranceReasonForm.controls['id'].setValue(this.editData.id);
      }
    }

    addSeveranceReason(){
      this.SeveranceReasonForm.controls['transactionUserId'].setValue(this.transactionUserId);
    if(!this.editData){
      
      this.SeveranceReasonForm.removeControl('id')
      console.log("add: ", this.SeveranceReasonForm.value);
      
      if(this.SeveranceReasonForm.valid){
        this.api.postSeveranceReason(this.SeveranceReasonForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.SeveranceReasonForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateAccount()
    }
  }
      updateAccount(){
        this.api.putSeveranceReason(this.SeveranceReasonForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.SeveranceReasonForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
  
  }
  

