



import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject ,ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-cc-function-dialog',
  templateUrl: './cc-function-dialog.component.html',
  styleUrls: ['./cc-function-dialog.component.css']
})
export class CcFunctionDialogComponent implements OnInit{
  transactionUserId=localStorage.getItem('transactionUserId')  
  CcFunctionList:any;
  groupForm !: FormGroup;
  actionBtn: string = "حفظ";
  groupSelectedSearch: any;
  
  productIdToEdit: any;
  userIdFromStorage: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,private http:HttpClient,
    private dialogRef: MatDialogRef<CcFunctionDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {
   
    this.getCcFunction();

    this.groupForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
   
      transactionUserId: ['', Validators.required],
    

    });
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addCcFunction();
      return false; // Prevent the default browser behavior
    }));
    console.log("edit data", this.editData);
    if (this.editData) {
      this.actionBtn = "تعديل";
      this.groupForm.controls['code'].setValue(this.editData.code);
      this.groupForm.controls['name'].setValue(this.editData.name);
   
      this.groupForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);

      // this.groupForm.controls['id'].setValue(this.editData.id);
      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }

  }



  async addCcFunction() {

    console.log("form entered values", this.groupForm.value);
    if (!this.editData) {
      this.groupForm.removeControl('id')

    
      this.groupForm.controls['transactionUserId'].setValue(this.transactionUserId);

     
        console.log("form add product value: ", this.groupForm.value)

        if (this.groupForm.valid) {

          this.api.postCcFunction(this.groupForm.value)
            .subscribe({
              next: (res) => {
                console.log("add product res: ", res);
                this.productIdToEdit = res.id;

                this.toastrSuccess();
                this.groupForm.reset();

                this.dialogRef.close('حفظ');
              },
              error: (err) => {
                alert("حدث خطأ أثناء إضافة منتج");
                console.log("post product with api err: ", err)
              }
            })
        }
      // }

    }
    else {
      this.updateCcFunction()
    }
  }

  updateCcFunction() {
    console.log("update product last values, id: ", this.groupForm.value)
    this.api.putCcFunction(this.groupForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()
          // this.toastrSuccess();
          this.groupForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل المنتج !!")
        }
      })
  }

  getCcFunction() {
    this.api.getCcFunction()
      .subscribe({
        next: (res) => {
          this.CcFunctionList = res;
          console.log("CcFunctionList res: ", this.CcFunctionList);
        },
        error: (err) => {
          console.log("fetch items data err: ", err);
          alert("خطا اثناء جلب الوظائف !");
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

