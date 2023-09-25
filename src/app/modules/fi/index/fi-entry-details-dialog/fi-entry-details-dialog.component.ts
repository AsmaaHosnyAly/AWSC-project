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

@Component({
  selector: 'app-fi-entry-details-dialog',
  templateUrl: './fi-entry-details-dialog.component.html',
  styleUrls: ['./fi-entry-details-dialog.component.css']
})
export class FiEntryDetailsDialogComponent implements OnInit {
  groupDetailsForm !: FormGroup;
  groupMasterForm !: FormGroup;
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
  accountsList: any;
  accountItemsList: any;
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

  // displayedColumns: string[] = ['credit', 'debit', 'accountName', 'fiAccountItemId', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    // private toastr: ToastrService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FiEntryDetailsDialogComponent>,

    private toastr: ToastrService,
    private route: Router) { }

  ngOnInit(): void {
    this.getFiAccounts();
    this.getFiAccountItems();

    this.groupDetailsForm = this.formBuilder.group({
      entryId: ['', Validators.required],
      credit: ['', Validators.required],
      debit: ['', Validators.required],
      accountId: ['', Validators.required],
      fiAccountItemId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);
      // this.actionBtnMaster = "Update";

      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.groupDetailsForm.controls['entryId'].setValue(this.editData.entryId);
      this.groupDetailsForm.controls['accountId'].setValue(this.editData.accountId);
      this.groupDetailsForm.controls['fiAccountItemId'].setValue(this.editData.fiAccountItemId);

      this.groupDetailsForm.controls['credit'].setValue(this.editData.credit);
      this.groupDetailsForm.controls['debit'].setValue(this.editData.debit)

      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);

      console.log("details edit form after: ", this.editData);

    }

  }

  async addDetailsInfo() {
    this.getMasterRowId = this.route.url.split('=').pop();
    this.groupDetailsForm.controls['entryId'].setValue(this.getMasterRowId);
    this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    console.log("check : ", this.route.url.split('=').pop());
    console.log("check id for insert: ", this.getDetailedRowData, "edit data form: ", this.editData, "haeder id: ", this.groupDetailsForm.getRawValue().entryId);

    if (!this.editData) {
      console.log("Enteeeeerrr post condition: ", this.groupDetailsForm.value)

      if (this.getMasterRowId) {
        console.log("form  headerId: ", this.getMasterRowId, "details form: ", this.groupDetailsForm.value)

        if (this.groupDetailsForm.getRawValue().credit || this.groupDetailsForm.getRawValue().debit) {
          if (this.editData) {
            console.log("found details: ", this.editData)
            this.sumOfCreditTotals = this.editData.creditTotal;
            this.sumOfDebitTotals = this.editData.debitTotal;

            this.sumOfCreditTotals = this.sumOfCreditTotals + this.groupDetailsForm.getRawValue().credit;
            this.sumOfDebitTotals = this.sumOfDebitTotals + this.groupDetailsForm.getRawValue().debit;
            // this.groupMasterForm.controls['creditTotal'].setValue(this.sumOfCreditTotals);
            // this.groupMasterForm.controls['debitTotal'].setValue(this.sumOfDebitTotals);

            if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
              this.resultOfBalance = this.sumOfCreditTotals - this.sumOfDebitTotals;
              // this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
            }
            else {
              this.resultOfBalance = this.sumOfDebitTotals - this.sumOfCreditTotals;
              // this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
            }

            // if (this.resultOfBalance == 0) {
            //   this.groupMasterForm.controls['state'].setValue('مغلق');
            // }
            // else {
            //   this.groupMasterForm.controls['state'].setValue('مفتوح');
            // }
          }
          else {
            console.log("found details withoutEdit: ", this.groupDetailsForm.value)
            this.sumOfCreditTotals = this.sumOfCreditTotals + this.groupDetailsForm.getRawValue().credit;
            this.sumOfDebitTotals = this.sumOfDebitTotals + this.groupDetailsForm.getRawValue().debit;
            // this.groupMasterForm.controls['creditTotal'].setValue(this.sumOfCreditTotals)
            // this.groupMasterForm.controls['debitTotal'].setValue(this.sumOfDebitTotals)

            // if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
            //   this.resultOfBalance = this.sumOfCreditTotals - this.sumOfDebitTotals;
            //   this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
            // }
            // else {
            //   this.resultOfBalance = this.sumOfDebitTotals - this.sumOfCreditTotals;
            //   this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
            // }

            // if (this.resultOfBalance == 0) {
            //   this.groupMasterForm.controls['state'].setValue('مغلق');
            // }
            // else {
            //   this.groupMasterForm.controls['state'].setValue('مفتوح');
            // }
          }

        }

        // this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
        // this.groupDetailsForm.controls['entryId'].setValue(this.getMasterRowId.id);

        console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        alert("item name controller: " + this.groupDetailsForm.getRawValue().itemName + " transactionUserId controller: " + this.groupDetailsForm.getRawValue().transactionUserId)

        console.log("add details second time, details form: ", this.groupDetailsForm.value)
        console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postFiEntryDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)
                alert("postDetails res credit: " + this.sumOfCreditTotals + " credit res: " + res.credit)

                alert("تمت إضافة التفاصيل بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();

                this.dialogRef.close('save');

                // this.getAllDetailsForms();
                // this.updateDetailsForm()
              },
              error: () => {
                // alert("حدث خطأ أثناء إضافة مجموعة")
              }
            })
        }
        // else {
        //   this.updateBothForms();
        // }

      }

    }
    else {
      console.log("Enteeeeerrr edit condition: ", this.groupDetailsForm.value)

      this.api.putFiEntryDetails(this.groupDetailsForm.value)
        .subscribe({
          next: (res) => {
            alert("تم تحديث التفاصيل بنجاح");
            this.toastrSuccess();
            // console.log("update res: ", res);
            this.groupDetailsForm.reset();
            // this.getAllDetailsForms();
            // this.getDetailedRowData = '';
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            alert("خطأ أثناء تحديث سجل المجموعة !!")
          }
        })
      this.groupDetailsForm.removeControl('id')
    }
  }

  getFiAccounts() {
    this.api.getFiAccounts()
      .subscribe({
        next: (res) => {
          this.accountsList = res;
          console.log("accounts res: ", this.accountsList);
        },
        error: (err) => {
          console.log("fetch accounts data err: ", err);
          alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  getFiAccountItems() {
    this.api.getFiAccountItems()
      .subscribe({
        next: (res) => {
          this.accountItemsList = res;
          console.log("accountItems res: ", this.accountItemsList);
        },
        error: (err) => {
          console.log("fetch accountItems data err: ", err);
          alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  // getAllDetailsForms() {

  //   console.log("edddit get all data: ", this.editData)
  //   console.log("mastered row get all data: ", this.getMasterRowId)
  //   if (this.getMasterRowId) {
  //     this.http.get<any>("http://ims.aswan.gov.eg/api/FIEntryDetails/get/all")
  //       .subscribe(res => {
  //         console.log("res to get all details form: ", res, "masterRowId: ", this.getMasterRowId.id);

  //         this.matchedIds = res.filter((a: any) => {
  //           // console.log("matchedIds: ", a.entryId == this.getMasterRowId.id, "res: ", this.matchedIds)
  //           return a.entryId == this.getMasterRowId.id
  //         })

  //         if (this.matchedIds) {

  //           this.dataSource = new MatTableDataSource(this.matchedIds);
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;

  //           // this.sumOfCreditTotals = 0;
  //           // this.sumOfDebitTotals = 0;
  //           // this.resultOfBalance = 0;
  //           // for (let i = 0; i < this.matchedIds.length; i++) {
  //           //   this.sumOfCreditTotals = this.sumOfCreditTotals + parseFloat(this.matchedIds[i].credit);
  //           //   this.groupMasterForm.controls['creditTotal'].setValue(this.sumOfCreditTotals);
  //           //   this.sumOfDebitTotals = this.sumOfDebitTotals + parseFloat(this.matchedIds[i].debit);
  //           //   this.groupMasterForm.controls['debitTotal'].setValue(this.sumOfDebitTotals);

  //           //   // if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
  //           //   //   this.resultOfBalance = this.sumOfCreditTotals - this.sumOfDebitTotals;
  //           //   //   this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
  //           //   // }
  //           //   // else {
  //           //   //   this.resultOfBalance = this.sumOfDebitTotals - this.sumOfCreditTotals;
  //           //   //   this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);
  //           //   // }

  //           //   // if (this.resultOfBalance == 0) {
  //           //   //   this.groupMasterForm.controls['state'].setValue('مغلق');
  //           //   // }
  //           //   // else {
  //           //   //   this.groupMasterForm.controls['state'].setValue('مفتوح');
  //           //   // }
  //           //   // this.updateBothForms()

  //           // }

  //         }
  //       }
  //         , err => {
  //           alert("حدث خطا ما !!")
  //         }
  //       )
  //   }


  // }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}
