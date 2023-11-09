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
  constructor(public id: number, public name: string) { }
}

export class Activity {
  constructor(public id: number, public name: string) { }
}

export class CostCenter {
  constructor(public id: number, public name: string) { }
}

export class Equipment {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-cc-entry-details-dialog',
  templateUrl: './cc-entry-details-dialog.component.html',
  styleUrls: ['./cc-entry-details-dialog.component.css']
})
export class CcEntryDetailsDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
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
  // costCentersList: any;
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

  activitiesList: Activity[] = [];
  activityCtrl: FormControl;
  filteredActivity: Observable<Activity[]>;
  selectedActivity: Activity | undefined;

  costCentersList: CostCenter[] = [];
  costCenterCtrl: FormControl;
  filteredCostCenter: Observable<CostCenter[]>;
  selectedCostCenter: CostCenter | undefined;

  equipmentsList: Equipment[] = [];
  equipmentCtrl: FormControl;
  filteredEquipment: Observable<Equipment[]>;
  selectedEquipment: Equipment | undefined;

  // displayedColumns: string[] = ['credit', 'debit', 'accountName', 'fiAccountItemId', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // activitiesList: any;
  // equipmentsList: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(MAT_DIALOG_DATA) public editDataDetails: any,
    private http: HttpClient,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CcEntryDetailsDialogComponent>,

    private toastr: ToastrService,
    private route: Router) {

    this.accountCtrl = new FormControl();
    this.filteredAccount = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccounts(value))
    );

    this.activityCtrl = new FormControl();
    this.filteredActivity = this.activityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterActivities(value))
    );

    this.costCenterCtrl = new FormControl();
    this.filteredCostCenter = this.costCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCostCenters(value))
    );

    this.equipmentCtrl = new FormControl();
    this.filteredEquipment = this.equipmentCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEquipments(value))
    );

  }

  ngOnInit(): void {
    this.getFiAccounts();
    this.getCcActivity();
    this.getCostCenter();
    this.getEquipment();

    this.groupDetailsForm = this.formBuilder.group({
      entryId: ['', Validators.required],
      accountId: ['', Validators.required],
      activityId: ['', Validators.required],
      costCenterId: ['', Validators.required],
      equipmentId: ['', Validators.required],
      credit: ['', Validators.required],
      debit: ['', Validators.required],
      qty: ['', Validators.required],
      description: [''],
      transactionUserId: ['', Validators.required],
    });
    console.log("details edit form before: ", this.editData);

    if (this.editData) {
      console.log("details edit form: ", this.editData);

      this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
      this.groupDetailsForm.controls['entryId'].setValue(this.editData.entryId);
      this.groupDetailsForm.controls['accountId'].setValue(this.editData.accountId);
      this.groupDetailsForm.controls['activityId'].setValue(this.editData.activityId);
      this.groupDetailsForm.controls['costCenterId'].setValue(this.editData.costCenterId);
      this.groupDetailsForm.controls['equipmentId'].setValue(this.editData.equipmentId);

      this.groupDetailsForm.controls['credit'].setValue(this.editData.credit);
      this.groupDetailsForm.controls['debit'].setValue(this.editData.debit);
      this.groupDetailsForm.controls['qty'].setValue(this.editData.qty);
      this.groupDetailsForm.controls['description'].setValue(this.editData.description);

      this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
      this.groupDetailsForm.controls['id'].setValue(this.editData.id);

    }

  }

  private _filterAccounts(value: string): Account[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.accountsList.filter(
      (account) =>
        account.name ? account.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayAccountName(account: any): string {
    return account ? account.name && account.name && account.name != null ? account.name : '-' : '';
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


  private _filterActivities(value: string): Activity[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.activitiesList.filter(
      (activity) =>
        activity.name ? activity.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayActivityName(activity: any): string {
    return activity ? activity.name && activity.name && activity.name != null ? activity.name : '-' : '';
  }
  ActivitySelected(event: MatAutocompleteSelectedEvent): void {
    const activity = event.option.value as Activity;
    console.log("activity selected: ", activity);
    this.selectedActivity = activity;
    this.groupDetailsForm.patchValue({ activityId: activity.id });

  }
  openAutoActivity() {
    this.activityCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.activityCtrl.updateValueAndValidity();
  }

  private _filterCostCenters(value: string): CostCenter[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.costCentersList.filter(
      (costCenter) =>
        costCenter.name ? costCenter.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayCostCenterName(costCenter: any): string {
    return costCenter ? costCenter.name && costCenter.name && costCenter.name != null ? costCenter.name : '-' : '';
  }
  CostCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costCenter = event.option.value as CostCenter;
    console.log("costCenter selected: ", costCenter);
    this.selectedCostCenter = costCenter;
    this.groupDetailsForm.patchValue({ costCenterId: costCenter.id });

  }
  openAutoCostCenter() {
    this.costCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costCenterCtrl.updateValueAndValidity();
  }

  private _filterEquipments(value: string): Equipment[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.equipmentsList.filter(
      (equipment) =>
        equipment.name ? equipment.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayEquipmentName(equipment: any): string {
    return equipment ? equipment.name && equipment.name && equipment.name != null ? equipment.name : '-' : '';
  }
  EquipmentSelected(event: MatAutocompleteSelectedEvent): void {
    const equipment = event.option.value as Equipment;
    console.log("equipment selected: ", equipment);
    this.selectedEquipment = equipment;
    this.groupDetailsForm.patchValue({ equipmentId: equipment.id });

  }
  openAutoEquipment() {
    this.equipmentCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.equipmentCtrl.updateValueAndValidity();
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

          this.api.postCcEntryDetails(this.groupDetailsForm.value)
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

      this.api.putCcEntryDetails(this.groupDetailsForm.value)
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

  getCcActivity() {
    this.api.getCcActivity()
      .subscribe({
        next: (res) => {
          this.activitiesList = res;
          console.log("activitiesList res: ", this.activitiesList);
        },
        error: (err) => {
          console.log("fetch activitiesList data err: ", err);
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  getCostCenter() {
    this.api.getCostCenter()
      .subscribe({
        next: (res) => {
          this.costCentersList = res;
          console.log("costCentersList res: ", this.costCentersList);
        },
        error: (err) => {
          console.log("fetch costCentersList data err: ", err);
          // alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  getEquipment() {
    this.api.getEquipment()
      .subscribe({
        next: (res) => {
          this.equipmentsList = res;
          console.log("equipmentsList res: ", this.equipmentsList);
        },
        error: (err) => {
          console.log("fetch equipmentsList data err: ", err);
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

