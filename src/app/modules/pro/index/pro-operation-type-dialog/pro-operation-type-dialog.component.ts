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
  selector: 'app-pro-operation-type-dialog',
  templateUrl: './pro-operation-type-dialog.component.html',
  styleUrls: ['./pro-operation-type-dialog.component.css']
})
export class ProOperationTypeDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  autoCode: any;
  proOperationTypeForm !: FormGroup;
  actionBtn: string = "حفظ";

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<ProOperationTypeDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.proOperationTypeForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addProOperationType();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      console.log("edit data", this.editData);

      this.actionBtn = "تعديل";
      this.proOperationTypeForm.controls['code'].setValue(this.editData.code);
      this.proOperationTypeForm.controls['name'].setValue(this.editData.name);
      this.proOperationTypeForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.proOperationTypeForm.addControl('id', new FormControl('', Validators.required));
      this.proOperationTypeForm.controls['id'].setValue(this.editData.id);

    }
    else {
      this.getProOperationTypeAutoCode();
    }

  }



  async addProOperationType() {
    if (!this.editData) {
      this.proOperationTypeForm.removeControl('id')

      this.proOperationTypeForm.controls['transactionUserId'].setValue(this.transactionUserId);

      console.log("form post value: ", this.proOperationTypeForm.value)

      if (this.proOperationTypeForm.valid) {

        this.api.postProOperationType(this.proOperationTypeForm.value)
          .subscribe({
            next: (res) => {
              this.toastrPostSuccess();
              this.proOperationTypeForm.reset();

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
    console.log("update form values: ", this.proOperationTypeForm.value)
    this.api.putProOperationType(this.proOperationTypeForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()

          this.proOperationTypeForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          this.toastrEditWarning();
        }
      })
  }

  getProOperationTypeAutoCode() {
    this.api.getProOperationTypeAutoCode()
      .subscribe({
        next: (res) => {
          console.log("autoCode res: ", res);
          this.autoCode = res;
          this.proOperationTypeForm.controls['code'].setValue(this.autoCode);
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
