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
  selector: 'app-pro-tender-type-dailog',
  templateUrl: './pro-tender-type-dailog.component.html',
  styleUrls: ['./pro-tender-type-dailog.component.css']
})
export class ProTenderTypeDailogComponent {

  transactionUserId = localStorage.getItem('transactionUserId')
  autoCode: any;
  PlanTypeForm !: FormGroup;
  actionBtn: string = "حفظ";

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<ProTenderTypeDailogComponent>,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.PlanTypeForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addPlanType();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      console.log("edit data", this.editData);

      this.actionBtn = "تعديل";
      this.PlanTypeForm.controls['code'].setValue(this.editData.code);
      this.PlanTypeForm.controls['name'].setValue(this.editData.name);
      this.PlanTypeForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.PlanTypeForm.addControl('id', new FormControl('', Validators.required));
      this.PlanTypeForm.controls['id'].setValue(this.editData.id);

    }
    else {
      this.getPlanTypesCode();
    }

  }



  async addPlanType() {
    if (!this.editData) {
      this.PlanTypeForm.removeControl('id')

      this.PlanTypeForm.controls['transactionUserId'].setValue(this.transactionUserId);

      console.log("form post value: ", this.PlanTypeForm.value)

      if (this.PlanTypeForm.valid) {

        this.api.postTenderType(this.PlanTypeForm.value)
          .subscribe({
            next: (res) => {
              this.toastrPostSuccess();
              this.PlanTypeForm.reset();

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
      this.updatePlanType()
    }
  }

  updatePlanType() {
    console.log("update form values: ", this.PlanTypeForm.value)
    this.api.putTenderType(this.PlanTypeForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()

          this.PlanTypeForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          this.toastrEditWarning();
        }
      })
  }

  getPlanTypesCode() {
    this.api.getTenderTypeCode()
      .subscribe({
        next: (res) => {
          console.log("autoCode res: ", res);
          this.autoCode = res;
          this.PlanTypeForm.controls['code'].setValue(this.autoCode);
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

