import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { publishFacade } from '@angular/compiler';


@Component({
    selector: 'app-str-commodity-dialog',
    templateUrl: './STR_Commodity_dialog.component.html',
    styleUrls: ['./STR_Commodity_dialog.component.css']
  })

export class StrCommodityDialogComponent implements OnInit {

  commodityForm !: FormGroup;
  existingNames: string[] = [];
  actionBtn: string = "حفظ"
  autoCode:any;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrCommodityDialogComponent>) { }

  ngOnInit(): void {
    this.getCommodityAutoCode();
    this.getExistingNames(); // Fetch existing names
    this.commodityForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId:[1, Validators.required],
  
    });

    if (this.editData) {
      this.actionBtn = "تحديث";
      this.commodityForm.controls['code'].setValue(this.editData.code);
      this.commodityForm.controls['name'].setValue(this.editData.name);      
      this.commodityForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.commodityForm.addControl('id', new FormControl('', Validators.required));
      this.commodityForm.controls['id'].setValue(this.editData.id);

    }
  }

  getExistingNames() {
    this.api.getcommodity().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      }
    });
  }

  addCommodity() {
    
    const enteredName = this.commodityForm.get('name')?.value;

    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
  
    if (!this.editData) {
      this.commodityForm.removeControl('id')
      console.log("add form before go to post: ", this.commodityForm.value)
      if (this.commodityForm.getRawValue().code) {
        console.log("no changed: ", this.commodityForm.getRawValue().code)
        this.commodityForm.controls['code'].setValue(this.autoCode);
      }
      else{
        this.commodityForm.controls['code'].setValue(this.autoCode);
        console.log("no took auto number: ", this.commodityForm.getRawValue().code)
      }
      if (this.commodityForm.valid) {
        console.log('commodityForm:',this.commodityForm.value)
        this.api.postCommodity(this.commodityForm.value)
          .subscribe({
            next: (res) => {
              alert(" تم اضافة السلعة بنجاح" );
              this.commodityForm.reset();
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
    console.log("edit form : ", this.commodityForm.value)
    this.api.putCommodity(this.commodityForm.value)
    .subscribe({
      next:(res)=>{
        alert("تم التحديث بنجاح");
        this.commodityForm.reset();
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


  