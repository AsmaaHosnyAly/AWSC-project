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
  selector: 'app-fa-category-first-dialog',
  templateUrl: './fa-category-first-dialog.component.html',
  styleUrls: ['./fa-category-first-dialog.component.css']
})
export class FaCategoryFirstDialogComponent implements OnInit{
  transactionUserId = localStorage.getItem('transactionUserId')
  autoCode: any;
  faCategoryFirstForm !: FormGroup;
  actionBtn: string = "حفظ";

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<FaCategoryFirstDialogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.faCategoryFirstForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addFaCategoryFirst();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      console.log("edit data", this.editData);

      this.actionBtn = "تعديل";
      this.faCategoryFirstForm.controls['code'].setValue(this.editData.code);
      this.faCategoryFirstForm.controls['name'].setValue(this.editData.name);
      this.faCategoryFirstForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.faCategoryFirstForm.addControl('id', new FormControl('', Validators.required));
      this.faCategoryFirstForm.controls['id'].setValue(this.editData.id);

    }
    else {
      this.getFaCategoryFirstAutoCode();
    }

  }



  async addFaCategoryFirst() {
    if (!this.editData) {
      this.faCategoryFirstForm.removeControl('id')

      this.faCategoryFirstForm.controls['transactionUserId'].setValue(this.transactionUserId);

      console.log("form post value: ", this.faCategoryFirstForm.value)

      if (this.faCategoryFirstForm.valid) {

        this.api.postFaCategoryFirst(this.faCategoryFirstForm.value)
          .subscribe({
            next: (res) => {
              this.toastrPostSuccess();
              this.faCategoryFirstForm.reset();

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
      this.updateFaCategoryFirst()
    }
  }

  updateFaCategoryFirst() {
    console.log("update form values: ", this.faCategoryFirstForm.value)
    this.api.putFaCategoryFirst(this.faCategoryFirstForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()

          this.faCategoryFirstForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          this.toastrEditWarning();
        }
      })
  }

  getFaCategoryFirstAutoCode() {
    this.api.getFaCategoryFirstAutoCode()
      .subscribe({
        next: (res) => {
          console.log("autoCode res: ", res);
          this.autoCode = res;
          this.faCategoryFirstForm.controls['code'].setValue(this.autoCode);
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
