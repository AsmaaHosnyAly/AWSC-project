import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hr-qualitative-group-dialog',
  templateUrl: './hr-qualitative-group-dialog.component.html',
  styleUrls: ['./hr-qualitative-group-dialog.component.css']
})
export class HrQualitativeGroupDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  formcontrol = new FormControl('');  
  QualitativeGroupForm !:FormGroup;
  actionBtn : string = "حفظ"
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,private toastr: ToastrService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrQualitativeGroupDialogComponent>){ }
    ngOnInit(): void {
      this.QualitativeGroupForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      name : ['',Validators.required],
      id : ['',Validators.required],
      });
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.QualitativeGroupForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.QualitativeGroupForm.controls['name'].setValue(this.editData.name);;
      this.QualitativeGroupForm.addControl('id', new FormControl('', Validators.required));
      this.QualitativeGroupForm.controls['id'].setValue(this.editData.id);
      }
    }

    addQualitativeGroup(){
      this.QualitativeGroupForm.controls['transactionUserId'].setValue(this.transactionUserId);
    if(!this.editData){
      
      this.QualitativeGroupForm.removeControl('id')
      console.log("add: ", this.QualitativeGroupForm.value);
      
      if(this.QualitativeGroupForm.valid){
        this.api.postHrQualitativeGroup(this.QualitativeGroupForm.value)
        .subscribe({
          next:(res)=>{
            // alert("تمت الاضافة بنجاح");
            this.toastrSuccess();
            this.QualitativeGroupForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateQualitativeGroup()
    }
  }
      updateQualitativeGroup(){
        this.api.putHrQualitativeGroup(this.QualitativeGroupForm.value)
        .subscribe({
          next:(res)=>{
            // alert("تم التحديث بنجاح");
            this.toastrEditSuccess();

            this.QualitativeGroupForm.reset();
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
