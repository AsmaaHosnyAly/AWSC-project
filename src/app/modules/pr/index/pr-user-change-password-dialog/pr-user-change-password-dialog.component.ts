import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { Params, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-pr-user-change-password-dialog',
  templateUrl: './pr-user-change-password-dialog.component.html',
  styleUrls: ['./pr-user-change-password-dialog.component.css']
})
export class PrUserChangePasswordDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  changePasswordForm !: FormGroup;
  actionBtnMaster: string = "Save";
  actionBtnDetails: string = "Save";
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  matchedIds: any;
  getDetailedRowData: any;
  sumOfTotals = 0;
  sumOfCreditTotals = 0;
  sumOfDebitTotals = 0;
  resultOfBalance = 0;

  getMasterRowId: any;
  getDetailsRowId: any;
  journalsList: any;
  sourcesList: any;

  employeesList: any;
  distEmployeesList: any;
  costCentersList: any;
  itemsList: any;
  fiscalYearsList: any;
  storeName: any;
  itemName: any;
  userIdFromStorage: any;
  deleteConfirmBtn: any;
  dialogRefDelete: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userName: any;

  constructor(private formBuilder: FormBuilder, private api: ApiService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getUserInfo();

    this.changePasswordForm = this.formBuilder.group({
      name: ['', Validators.required],
      currentPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      transactionUserId: [this.transactionUserId, Validators.required],
      isActive: [true, Validators.required],
      isAdmin: [true, Validators.required],
      id: [this.transactionUserId, Validators.required],
    });

    // console.log("details edit form before: ", this.editData);

    // if (this.editData) {
    //   console.log("details edit form: ", this.editData);
    //   // this.actionBtnMaster = "Update";

    //   this.changePasswordForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    //   this.changePasswordForm.controls['itemGroupId'].setValue(this.editData.itemGroupId);
    //   this.changePasswordForm.controls['pyItemId'].setValue(this.editData.pyItemId);

    //   this.changePasswordForm.addControl('id', new FormControl('', Validators.required));
    //   this.changePasswordForm.controls['id'].setValue(this.editData.id);

    //   console.log("details edit form after: ", this.editData);

    // }

  }


  async updateUserInfo() {
    this.changePasswordForm.controls['name'].setValue(this.userName);
    // alert("userName in form: " + this.changePasswordForm.getRawValue().name);
    // this.getMasterRowId = this.route.url.split('=').pop();
    // this.groupDetailsForm.controls['itemGroupId'].setValue(this.getMasterRowId);
    // this.groupDetailsForm.controls['transactionUserId'].setValue(this.transactionUserId);

    // console.log("check : ", this.route.url.split('=').pop());
    // console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.groupDetailsForm.getRawValue().itemGroupId);


    // if (!this.editData) {
    //   console.log("Enteeeeerrr post condition: ", this.groupDetailsForm.value)

    //   if (this.getMasterRowId) {
    //     console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

    console.log("changePasswordForm values: ", this.changePasswordForm.value);

    if (this.changePasswordForm.valid) {

      if (this.changePasswordForm.getRawValue().confirmPassword == this.changePasswordForm.getRawValue().password) {

        this.api.putPrUser(this.changePasswordForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              // this.changePasswordForm.reset();
            },
            error: () => {
              // alert("حدث خطأ أثناء إضافة مجموعة")
            }
          })

      }
      else {
        this.toastrPasswordCheckWarning();
      }

    }
    else {
      this.toastrFormValidationWarning();
    }
    // else {
    //   this.updateBothForms();
    // }

    //   }

    // }
    // else {
    //   console.log("Enteeeeerrr edit condition: ", this.groupDetailsForm.value)

    //   this.api.putPyItemGroupDetails(this.groupDetailsForm.value)
    //     .subscribe({
    //       next: (res) => {
    //         this.toastrSuccess();
    //         this.groupDetailsForm.reset();
    //         this.dialogRef.close('save');
    //       },
    //       error: (err) => {
    //         // console.log("update err: ", err)
    //         // alert("خطأ أثناء تحديث سجل المجموعة !!")
    //       }
    //     })
    //   this.groupDetailsForm.removeControl('id')
    // }
  }


  getUserInfo() {
    this.api.getPrGroupByUserId(this.transactionUserId)
      .subscribe({
        next: (res) => {
          this.userName = res.name;
          console.log("userName current: ", this.userName);
          this.changePasswordForm.controls['name'].setValue(this.userName);

        },
        error: (err) => {
          console.log("fetch userName current res err: ", err);
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  closeDialog() {
    // let result = window.confirm('هل تريد اغلاق الطلب');
    // if (result) {

    // this.dialogRef.close('Save');
    // }
  }

  toastrSuccess(): void {
    this.toastr.success("تم التعديل بنجاح");
  }

  toastrFormValidationWarning(): void {
    this.toastr.warning("برجاء ادخال جميع البيانات !");
  }

  toastrPasswordCheckWarning(): void {
    this.toastr.warning("برجاء ادخال رقم سرى متطابق !");
  }
}
