
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
  selector: 'app-fa-category-third-dialog',
  templateUrl: './fa-category-third-dialog.component.html',
  styleUrls: ['./fa-category-third-dialog.component.css']
})
export class FaCategoryThirdDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  autoCode: any;
  faCategoryThirdForm !: FormGroup;
  actionBtn: string = "حفظ";
  groupSelectedSearch: any;

  productIdToEdit: any;
  userIdFromStorage: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<FaCategoryThirdDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.faCategoryThirdForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addFaCategoryThird();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      console.log("edit data", this.editData);

      this.actionBtn = "تعديل";
      this.faCategoryThirdForm.controls['code'].setValue(this.editData.code);
      this.faCategoryThirdForm.controls['name'].setValue(this.editData.name);
      this.faCategoryThirdForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.faCategoryThirdForm.addControl('id', new FormControl('', Validators.required));
      this.faCategoryThirdForm.controls['id'].setValue(this.editData.id);

    }
    else {
      this.getFaCategoryThirdAutoCode();
    }

  }



  async addFaCategoryThird() {
    if (!this.editData) {
      this.faCategoryThirdForm.removeControl('id')

      this.faCategoryThirdForm.controls['transactionUserId'].setValue(this.transactionUserId);

      console.log("form post value: ", this.faCategoryThirdForm.value)

      if (this.faCategoryThirdForm.valid) {

        this.api.postFaCategoryThird(this.faCategoryThirdForm.value)
          .subscribe({
            next: (res) => {
              this.toastrPostSuccess();
              this.faCategoryThirdForm.reset();

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
      this.updateFaCategoryThird()
    }
  }

  updateFaCategoryThird() {
    console.log("update form values: ", this.faCategoryThirdForm.value)
    this.api.putFaCategoryThird(this.faCategoryThirdForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()

          this.faCategoryThirdForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          this.toastrEditWarning();
        }
      })
  }

  getFaCategoryThirdAutoCode() {
    this.api.getFaCategoryThirdAutoCode()
      .subscribe({
        next: (res) => {
          console.log("autoCode res: ", res);
          this.autoCode = res;
          this.faCategoryThirdForm.controls['code'].setValue(this.autoCode);
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
