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

export class Account {
  constructor(public id: number, public name: string,public code: any) { }
}

export class AccountItem { 
  constructor(public id: number, public name: string) { }
}

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

  accountsList: Account[] = [];
  accountCtrl: FormControl;
  filteredAccount: Observable<Account[]>;
  selectedAccount: Account | undefined;

  accountItemsList: AccountItem[] = [];
  accountItemCtrl: FormControl;
  filteredAccountItem: Observable<AccountItem[]>;
  selectedAccountItem: AccountItem | undefined;

  // displayedColumns: string[] = ['credit', 'debit', 'accountName', 'fiAccountItemId', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FiEntryDetailsDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.accountCtrl = new FormControl();
    this.filteredAccount = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccounts(value))
    );

    this.accountItemCtrl = new FormControl();
    this.filteredAccountItem = this.accountItemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccountItems(value))
    );

  }

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

  private _filterAccounts(value: string): Account[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.accountsList.filter(
      (account) =>
        // account.name.toLowerCase().includes(filterValue)
        account.name || account.code ? account.name.toLowerCase().includes(filterValue) || account.code.toString().toLowerCase().includes(filterValue) : '-'
    );
  }

  displayAccountName(account: any): string {
    return account ? account.name && account.name != null ? account.name : '-' : '';
  }
  AccountSelected(event: MatAutocompleteSelectedEvent): void {
    const account = event.option.value as Account;
    console.log("account selected: ", account);
    this.selectedAccount = account;
    this.groupDetailsForm.patchValue({ accountId: account.id });
  }
  openAutoAccount() {
    this.accountCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.accountCtrl.updateValueAndValidity();
  }



  private _filterAccountItems(value: string): AccountItem[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.accountItemsList.filter(
      (accountItem) =>
        accountItem.name.toLowerCase().includes(filterValue)
      // ||
      // accountItem.code.toString().toLowerCase().includes(filterValue)
    );
  }

  displayAccountItemName(accountItem: any): string {
    return accountItem && accountItem.name ? accountItem.name : '';
  }
  AccountItemSelected(event: MatAutocompleteSelectedEvent): void {
    const accountItem = event.option.value as AccountItem;
    console.log("accountItem selected: ", accountItem);
    this.selectedAccountItem = accountItem;
    this.groupDetailsForm.patchValue({ fiAccountItemId: accountItem.id });
 
  }
  openAutoAccountItem() {
    this.accountItemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.accountItemCtrl.updateValueAndValidity();
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
           

            if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
              this.resultOfBalance = this.sumOfCreditTotals - this.sumOfDebitTotals;
            }
            else {
              this.resultOfBalance = this.sumOfDebitTotals - this.sumOfCreditTotals;
            }

          }
          else {
            console.log("found details withoutEdit: ", this.groupDetailsForm.value)
            this.sumOfCreditTotals = this.sumOfCreditTotals + this.groupDetailsForm.getRawValue().credit;
            this.sumOfDebitTotals = this.sumOfDebitTotals + this.groupDetailsForm.getRawValue().debit;
           
          }

        }

        // console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        // console.log("add details second time, details form: ", this.groupDetailsForm.value)
        // console.log("add details second time, get detailed row data: ", !this.getDetailedRowData)

        if (this.groupDetailsForm.valid && !this.getDetailedRowData) {

          this.api.postFiEntryDetails(this.groupDetailsForm.value)
            .subscribe({
              next: (res) => {
                this.getDetailsRowId = {
                  "id": res
                };
                console.log("Details res: ", this.getDetailsRowId.id)
                
                // alert("تمت إضافة التفاصيل بنجاح");
                this.toastrSuccess();
                this.groupDetailsForm.reset();

                this.dialogRef.close('save');

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
            this.toastrSuccess();
            this.groupDetailsForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            // console.log("update err: ", err)
            // alert("خطأ أثناء تحديث سجل المجموعة !!")
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
          // alert("خطا اثناء جلب الدفاتر !");
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
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

 
  closeDialog() {
    let result = window.confirm('هل تريد اغلاق الطلب');
    if (result) {

      this.dialogRef.close('Save');
    }
  }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }
}
