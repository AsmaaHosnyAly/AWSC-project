import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-pro-seller-type-dialog',
  templateUrl: './pro-seller-type-dialog.component.html',
  styleUrls: ['./pro-seller-type-dialog.component.css']
})
export class ProSellerTypeDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  autoCode: any;
  proSellerTypeForm !: FormGroup;
  actionBtn: string = "حفظ";

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<ProSellerTypeDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.proSellerTypeForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addProSellerType();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      console.log("edit data", this.editData);

      this.actionBtn = "تعديل";
      this.proSellerTypeForm.controls['code'].setValue(this.editData.code);
      this.proSellerTypeForm.controls['name'].setValue(this.editData.name);
      this.proSellerTypeForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.proSellerTypeForm.addControl('id', new FormControl('', Validators.required));
      this.proSellerTypeForm.controls['id'].setValue(this.editData.id);

    }
    else {
      this.getProSellerTypeAutoCode();
    }

  }



  async addProSellerType() {
    if (!this.editData) {
      this.proSellerTypeForm.removeControl('id')

      this.proSellerTypeForm.controls['transactionUserId'].setValue(this.transactionUserId);

      console.log("form post value: ", this.proSellerTypeForm.value)

      if (this.proSellerTypeForm.valid) {

        this.api.postProSellerType(this.proSellerTypeForm.value)
          .subscribe({
            next: (res) => {
              this.toastrPostSuccess();
              this.proSellerTypeForm.reset();

              this.dialogRef.close('حفظ');
            },
            error: (err) => {
              this.toastrPostError();
            }
          })
      }
      else {
        this.toastrPostWarning();
      }

    }
    else {
      this.updateProOperationType()
    }
  }

  updateProOperationType() {
    console.log("update form values: ", this.proSellerTypeForm.value)
    this.api.putProSellerType(this.proSellerTypeForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()

          this.proSellerTypeForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          this.toastrEditWarning();
        }
      })
  }

  getProSellerTypeAutoCode() {
    this.api.getProSellerTypeAutoCode()
      .subscribe({
        next: (res) => {
          console.log("autoCode res: ", res);
          this.autoCode = res;
          this.proSellerTypeForm.controls['code'].setValue(this.autoCode);
        },
        error: (err) => {
          console.log("fetch autoCode data err: ", err);
          this.toastrAutoCodeGenerateError();
        }
      })
  }


  toastrPostSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrPostError(): void {
    this.toastr.error('  حدث خطا اثناء الاضافة ! ');
  }
  toastrPostWarning(): void {
    this.toastr.error(' برجاء التاكد من ادخال البيانات كاملة ! ');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
  toastrEditWarning(): void {
    this.toastr.warning(' حدث خطا اثناء التحديث ! ');
  }
  toastrAutoCodeGenerateError(): void {
    this.toastr.error('  حدث خطا اثناء توليد الكود ! ');
  }
}
