

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { publishFacade } from '@angular/compiler';


@Component({
    selector: 'app-str-commodity-dialog',
    templateUrl: './STR_Commodity_dialog.component.html',
    styleUrls: ['./STR_Commodity_dialog.component.css']
  })

export class StrCommodityDialogComponent implements OnInit {

  productForm !: FormGroup;
  actionBtn: string = "حفظ"
  autoCode:any;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrCommodityDialogComponent>) { }

  ngOnInit(): void {
    this.getCommodityAutoCode();

    this.productForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId:[1, Validators.required],
 


      
    });

    if (this.editData) {
      this.actionBtn = "تحديث";
      this.productForm.controls['code'].setValue(this.editData.code);
      this.productForm.controls['name'].setValue(this.editData.name);
      
      this.productForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.productForm.addControl('id', new FormControl('', Validators.required));
      this.productForm.controls['id'].setValue(this.editData.id);

    }
  }

  addCommodity() {
  
    if (!this.editData) {
      this.productForm.removeControl('id')
      console.log("add form before go to post: ", this.productForm.value)
      if (this.productForm.getRawValue().code) {
        console.log("no changed: ", this.productForm.getRawValue().code)
        this.productForm.controls['code'].setValue(this.autoCode);
      }
      else{
        this.productForm.controls['code'].setValue(this.autoCode);
        console.log("no took auto number: ", this.productForm.getRawValue().code)
      }
      if (this.productForm.valid) {
      
        console.log('productform:',this.productForm.value)
        this.api.postCommodity(this.productForm.value)
          .subscribe({
            next: (res) => {
              alert(" تم اضافة السلعة بنجاح" );
              this.productForm.reset();
              this.dialogRef.close('حفظ');
            },
            error: (err) => {
              console.log('error:',err)
              alert("!خطأ في العملية")
              
            }
          })
      }
      
    }else{
      this.updateCommodity()
    }
  }

  updateCommodity(){
    console.log("edit form : ", this.productForm.value)
    this.api.putCommodity(this.productForm.value)
    .subscribe({
      next:(res)=>{
        alert("تم التحديث بنجاح");
        this.productForm.reset();
        this.dialogRef.close('تحديث');
      },
      error:(err)=>{
        console.log('error:',err)
      }
    })
  }

  getCommodityAutoCode() {
    this.api.getCommodityAutoCode()
      .subscribe({
        next: (res) => {
          this.autoCode = res;
          console.log("autocode:",this.autoCode)
          return res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

}


  