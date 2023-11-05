
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
  selector: 'app-fa-category-second-dialog',
  templateUrl: './fa-category-second-dialog.component.html',
  styleUrls: ['./fa-category-second-dialog.component.css']
})
export class FaCategorySecondDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  autoCode: any;
  faCategorySecondForm !: FormGroup;
  actionBtn: string = "حفظ";

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<FaCategorySecondDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.faCategorySecondForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addFaCategorySecond();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      console.log("edit data", this.editData);

      this.actionBtn = "تعديل";
      this.faCategorySecondForm.controls['code'].setValue(this.editData.code);
      this.faCategorySecondForm.controls['name'].setValue(this.editData.name);
      this.faCategorySecondForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.faCategorySecondForm.addControl('id', new FormControl('', Validators.required));
      this.faCategorySecondForm.controls['id'].setValue(this.editData.id);

    }
    else {
      this.getFaCategorySecondAutoCode();
    }

  }



  async addFaCategorySecond() {
    if (!this.editData) {
      this.faCategorySecondForm.removeControl('id')

      this.faCategorySecondForm.controls['transactionUserId'].setValue(this.transactionUserId);

      console.log("form post value: ", this.faCategorySecondForm.value)

      if (this.faCategorySecondForm.valid) {

        this.api.postFaCategorySecond(this.faCategorySecondForm.value)
          .subscribe({
            next: (res) => {
              this.toastrPostSuccess();
              this.faCategorySecondForm.reset();

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
      this.updateFaCategorySecond()
    }
  }

  updateFaCategorySecond() {
    console.log("update form values: ", this.faCategorySecondForm.value)
    this.api.putFaCategorySecond(this.faCategorySecondForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()

          this.faCategorySecondForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          this.toastrEditWarning();
        }
      })
  }

  getFaCategorySecondAutoCode() {
    this.api.getFaCategorySecondAutoCode()
      .subscribe({
        next: (res) => {
          console.log("autoCode res: ", res);
          this.autoCode = res;
          this.faCategorySecondForm.controls['code'].setValue(this.autoCode);
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
