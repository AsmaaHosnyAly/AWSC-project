import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { PrintDialogComponent } from '../../../str/index/print-dialog/print-dialog.component';
import { CcEntryDialogComponent } from '../cc-entry-dialog/cc-entry-dialog.component';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatTabGroup } from '@angular/material/tabs';

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

interface ccEntry {
  no: string;
  balance: string;
  creditTotal: string;
  debitTotal: string;
  journalName: string;
  entrySourceTypeName: string;
  state: string;
  date: string;
  Action: string;
}

interface ccEntryDetails {
  credit: string;
  debit: string;
  qty: string;
  debitTotal: string;
  accountName: string;
  activityName: string;
  costCenterName: string;
  equipmentName: string;
  action: string;
}

@Component({
  selector: 'app-cc-entry-table',
  templateUrl: './cc-entry-table.component.html',
  styleUrls: ['./cc-entry-table.component.css']
})
export class CcEntryTableComponent implements OnInit {
  ELEMENT_DATA: ccEntry[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = [
    'no',
    'balance',
    'creditTotal',
    'debitTotal',
    'date',
    'Action',
  ];
  pdfurl = '';
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  employeesList: any;
  // costCentersList: any;
  journalsList: any;

  sourcesList: any;

  dataSource2: MatTableDataSource<ccEntry> = new MatTableDataSource();

  editData: any;
  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;
  MasterGroupInfoEntered = false;
  currentDate: any;
  sumOfCreditTotals = 0;
  sumOfDebitTotals = 0;
  resultOfBalance = 0;
  getMasterRowId: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageIndex: any;
  length: any;

  // equipmentsList: any;
  // costCentersList: any;
  // activitiesList: any;
  // accountsList: any;

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


  editDataDetails: any;
  userIdFromStorage = localStorage.getItem('transactionUserId');

  // dataSource!: MatTableDataSource<any>;
  displayedDetailsColumns: string[] = [
    'credit',
    'debit',
    'qty',
    'accountName',
    'activityName',
    'costCenterName',
    'equipmentName',
    'action',
  ];

  dataSource: MatTableDataSource<ccEntryDetails> = new MatTableDataSource();
  pageIndexDetails: any;
  lengthDetails: any;
  // pageSizeDetails: any;
  pageSizeDetails = 5;
  ELEMENT_DATA_DETAILS: ccEntryDetails[] = [];
  currentPageDetails: any;

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
  }

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient, private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    global.getPermissionUserRoles('CC', 'ccHome', 'التكاليف', 'credit_card')
    this.currentDate = new Date();

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
    this.getAllMasterForms();
    this.getFiAccounts();
    this.getCcActivity();
    this.getCostCenter();
    this.getEquipment();

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      creditTotal: ['', Validators.required],
      debitTotal: ['', Validators.required],
      balance: ['', Validators.required],
      transactionUserId: ['', Validators.required],
      date: [this.currentDate, Validators.required],
      description: [''],
    });

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
  }

  tabSelected(tab: any) {

    console.log("tab selected: ", tab);
    if (tab.index == 0) {
      // if (this.groupMasterForm.getRawValue().balance != 0) {
      //   var result = confirm('القيد غير متزن هل تريد الخروج ؟');
      //   if (result) {
      //     console.log("close");

      this.editData = '';
      this.MasterGroupInfoEntered = false;
      // this.journalNo = '';
      // this.groupMasterForm.controls['no'].setValue('');
      // this.journalCtrl.setValue('');
      // this.groupMasterForm.controls['date'].setValue(this.currentDate);
      // this.groupMasterForm.controls['creditTotal'].setValue(0);
      // this.groupMasterForm.controls['debitTotal'].setValue(0);
      // this.groupMasterForm.controls['balance'].setValue(0);
      // this.groupMasterForm.controls['description'].setValue('');
      // this.groupMasterForm.controls['state'].setValue(this.defaultState);
      // this.groupMasterForm.controls['fiEntrySourceTypeId'].setValue('');

      this.getAllMasterForms();
      // }
      // else {
      //   console.log("continue");

      //   let tabGroup = this.matgroup;
      //   tabGroup.selectedIndex = 1;
      // }
      // } 

    }
  }

  openCcEntryDialog() {
    this.editData = '';
    this.groupMasterForm.controls['no'].setValue('');
    this.groupMasterForm.controls['date'].setValue(this.currentDate);

    this.groupMasterForm.controls['creditTotal'].setValue(0);
    this.groupMasterForm.controls['debitTotal'].setValue(0);
    this.groupMasterForm.controls['balance'].setValue(0);
    // this.groupMasterForm.controls['state'].setValue(this.defaultState);
    this.groupMasterForm.controls['description'].setValue('');

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    console.log("matGroup: ", tabGroup, "selectIndex: ", tabGroup.selectedIndex);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  getAllMasterForms() {
    if (!this.currentPage) {
      this.currentPage = 0;

      this.isLoading = true;

      fetch(this.api.getCcEntryPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
          this.dataSource2.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          this.isLoading = false;
        }, error => {
          console.log(error);
          this.isLoading = false;
        });
    }
    else {
      this.isLoading = true;

      fetch(this.api.getCcEntryPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate: ", data);
          this.dataSource2.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          this.isLoading = false;
        }, error => {
          console.log(error);
          this.isLoading = false;
        });
    }
  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllMasterForms();
  }

  editMasterForm(row: any) {
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    this.editData = row;

    console.log('master edit form: ', this.editData);
    // this.actionBtnMaster = 'Update';
    this.groupMasterForm.controls['no'].setValue(this.editData.no);
    this.groupMasterForm.controls['date'].setValue(this.editData.date);

    this.groupMasterForm.controls['balance'].setValue(this.editData.balance);
    this.groupMasterForm.controls['creditTotal'].setValue(
      this.editData.creditTotal
    );
    this.groupMasterForm.controls['debitTotal'].setValue(
      this.editData.debitTotal
    );

    // this.groupMasterForm.controls['state'].setValue(this.editData.state);
    // // this.setState(this.editData.state);
    // if (this.groupMasterForm.getRawValue().state != "مغلق") {
    //   this.entryRowReadOnlyState = true;
    // }
    // else {
    //   this.entryRowReadOnlyState = false;
    // }


    this.groupMasterForm.controls['description'].setValue(
      this.editData.description
    );

    this.groupMasterForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    this.groupMasterForm.controls['id'].setValue(this.editData.id);

    this.groupMasterForm.controls['transactionUserId'].setValue(
      localStorage.getItem('transactionUserId')
    );

    this.getAllDetailsForms();

  }

  deleteBothForms(id: number) {
    var result = confirm('تاكيد الحذف ؟ ');
    console.log(' id in delete:', id);
    if (result) {
      this.api.deleteCcEntry(id).subscribe({
        next: (res) => {
          this.api.getCcEntryDetailsByMasterId(id).subscribe({
            next: (res) => {
              this.matchedIds = res;

              for (let i = 0; i < this.matchedIds.length; i++) {
                this.deleteFormDetails(this.matchedIds[i].id);
              }
            },
            error: (err) => {
              // alert('خطا اثناء تحديد المجموعة !!');
            },
          });

          this.toastrDeleteSuccess();
          this.getAllMasterForms();
        },
        error: () => {
          // alert('خطأ أثناء حذف المجموعة !!');
        },
      });
    }
  }

  deleteFormDetails(id: number) {
    this.api.deleteCcEntryDetails(id).subscribe({
      next: (res) => {
        this.getAllMasterForms();
        this.getAllDetailsForms();
      },
      error: (err) => {
        console.log('delete details err: ', err);
      },
    });
  }


  ///////////////////////////////////////////////////////////////////////////////////////

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');

    this.groupMasterForm.controls['creditTotal'].setValue(0);
    this.groupMasterForm.controls['debitTotal'].setValue(0);
    this.groupMasterForm.controls['balance'].setValue(0);
    // this.groupMasterForm.controls['state'].setValue('مغلق');

    console.log('fiEntry master form: ', this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      console.log('Master add form : ', this.groupMasterForm.value);
      this.api.postCcEntry(this.groupMasterForm.value).subscribe({
        next: (res) => {
          console.log('ID fiEntry after post: ', res);
          this.getMasterRowId = {
            id: res,
          };
          console.log('mastered res: ', this.getMasterRowId.id);
          this.MasterGroupInfoEntered = true;

          this.toastrSuccess();
          this.getAllDetailsForms();
          this.addDetailsInfo();
        },
        error: (err) => {
          console.log('header post err: ', err);
          // alert("حدث خطأ أثناء إضافة مجموعة")
        },
      });
    }
  }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);

    console.log('update both: ', this.groupDetailsForm.valid);

    this.api.putCcEntry(this.groupMasterForm.value).subscribe({
      next: (res) => {
        this.groupDetailsForm.reset();
      },
    });
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

  ///////////////////////////////////////////////////////////////////////////////////////////

  editDetailsForm(row: any) {
    console.log("details editData: ", row);
    this.editDataDetails = row;

    this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    this.groupDetailsForm.controls['entryId'].setValue(this.editDataDetails.entryId);
    this.groupDetailsForm.controls['accountId'].setValue(this.editDataDetails.accountId);
    this.groupDetailsForm.controls['activityId'].setValue(this.editDataDetails.activityId);
    this.groupDetailsForm.controls['costCenterId'].setValue(this.editDataDetails.costCenterId);
    this.groupDetailsForm.controls['equipmentId'].setValue(this.editDataDetails.equipmentId);

    this.groupDetailsForm.controls['credit'].setValue(this.editDataDetails.credit);
    this.groupDetailsForm.controls['debit'].setValue(this.editDataDetails.debit)
    this.groupDetailsForm.controls['qty'].setValue(this.editDataDetails.qty);

    this.groupDetailsForm.controls['description'].setValue(this.editDataDetails.description);

    this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    this.groupDetailsForm.controls['id'].setValue(this.editDataDetails.id);

    // if (this.groupMasterForm.getRawValue().state != "مغلق") {
    //   this.entryRowReadOnlyState = true;
    // }
    // else {
    //   this.entryRowReadOnlyState = false;
    // }
    this.getMasterRowId = {
      "id": this.editDataDetails.id
    }
  }

  creditChange(credit: any) {
    console.log("credit change: ", credit);
    var creditValue: number = credit.data;

    if (creditValue) {
      this.groupDetailsForm.controls['debit'].setValue(0);
    }
    else {
      this.groupDetailsForm.controls['debit'].setValue('');
    }
  }

  debitChange(debit: any) {
    console.log("debit change: ", debit);
    var debitValue: number = debit.data;

    if (debitValue) {
      this.groupDetailsForm.controls['credit'].setValue(0);
    }
    else {
      this.groupDetailsForm.controls['credit'].setValue('');

    }
  }

  async addDetailsInfo() {
    if (!this.getMasterRowId) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }
    this.groupDetailsForm.controls['entryId'].setValue(this.getMasterRowId.id);
    this.groupDetailsForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    console.log("haeder id: ", this.editData.id);

    if (!this.editDataDetails) {
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

        if (this.groupDetailsForm.valid) {

          if (this.groupDetailsForm.getRawValue().credit != this.groupDetailsForm.getRawValue().debit && (this.groupDetailsForm.getRawValue().credit == 0 || this.groupDetailsForm.getRawValue().debit == 0)) {
            console.log("DETAILS post: ", this.groupDetailsForm.value);
            this.api.postCcEntryDetails(this.groupDetailsForm.value)
              .subscribe({
                next: (res) => {
                  // this.getDetailsRowId = {
                  //   "id": res
                  // };
                  // console.log("Details res: ", this.getDetailsRowId.id)

                  // alert("تمت إضافة التفاصيل بنجاح");
                  this.toastrSuccess();
                  this.groupDetailsForm.reset();
                  this.accountCtrl.reset();
                  this.activityCtrl.reset();
                  this.costCenterCtrl.reset();
                  this.equipmentCtrl.reset();
                  this.editDataDetails = '';

                  this.groupDetailsForm.controls['credit'].setValue(0);
                  this.groupDetailsForm.controls['debit'].setValue(0);

                  this.getAllDetailsForms();

                  // this.dialogRef.close('save');

                },
                error: () => {
                  // alert("حدث خطأ أثناء إضافة مجموعة")
                }
              })
          }
          else {
            this.toastrWarningPostDetails();
            this.groupDetailsForm.controls['credit'].setValue(0);
            this.groupDetailsForm.controls['debit'].setValue(0);
          }

        }
        // else {
        //   this.updateBothForms();
        // }

      }

    }
    else {
      this.groupDetailsForm.controls['entryId'].setValue(this.editData.id);

      console.log("Enteeeeerrr edit condition: ", this.groupDetailsForm.value)
      if (this.groupDetailsForm.getRawValue().credit != this.groupDetailsForm.getRawValue().debit && (this.groupDetailsForm.getRawValue().credit == 0 || this.groupDetailsForm.getRawValue().debit == 0)) {
        this.api.putCcEntryDetails(this.groupDetailsForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.groupDetailsForm.reset();

              this.accountCtrl.reset();
              this.activityCtrl.reset();
              this.costCenterCtrl.reset();
              this.equipmentCtrl.reset();
              this.editDataDetails = '';
              this.getAllDetailsForms();

              this.groupDetailsForm.controls['credit'].setValue(0);
              this.groupDetailsForm.controls['debit'].setValue(0);

              // this.dialogRef.close('save');
            },
            error: (err) => {
              // console.log("update err: ", err)
              // alert("خطأ أثناء تحديث سجل المجموعة !!")
            }
          })
        this.groupDetailsForm.removeControl('id')
      }
      else {
        this.toastrWarningPostDetails();
        this.groupDetailsForm.controls['credit'].setValue(0);
        this.groupDetailsForm.controls['debit'].setValue(0);
      }
    }
  }

  async updateDetailsForm() {
    if (this.editData) {
      this.groupMasterForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
      this.groupMasterForm.controls['id'].setValue(this.editData.id);
    }

    this.groupMasterForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    this.groupMasterForm.controls['id'].setValue(this.getMasterRowId.id);
    console.log(
      'enteeeeeeeeeer to update master form: ',
      this.groupMasterForm.getRawValue().creditTotal
    );
    console.log(
      'update master form: ',
      this.groupMasterForm.value,
      'update details form: ',
      this.groupDetailsForm.value
    );
    this.api.putCcEntry(this.groupMasterForm.value).subscribe({
      next: (res) => {
        // alert("تم التعديل بنجاح");
        console.log(
          'update res: ',
          res,
          'details form values: ',
          this.groupDetailsForm.value
        );
        if (this.groupDetailsForm.value) {
          this.groupDetailsForm.addControl(
            'id',
            new FormControl('', Validators.required)
          );
          this.groupDetailsForm.controls['id'].setValue(
            this.editDataDetails.id
          );

          // if (!this.groupDetailsForm.getRawValue().credit) {
          //   console.log('enter credit only');
          //   this.groupDetailsForm.controls['credit'].setValue(
          //     this.editDataDetails.credit
          //   );
          // } else if (!this.groupDetailsForm.getRawValue().debit) {
          //   console.log('enter debit only');
          //   this.groupDetailsForm.controls['debit'].setValue(
          //     this.editDataDetails.debit
          //   );
          // }

          console.log(
            'details form submit to edit: ',
            this.groupDetailsForm.value
          );

          this.api.putCcEntryDetails(this.groupDetailsForm.value).subscribe({
            next: (res) => {
              // alert("تم تحديث التفاصيل بنجاح");
              this.toastrSuccess();
              // console.log("update res: ", res);
              this.groupDetailsForm.reset();
              this.getAllDetailsForms();
            },
            error: (err) => {
              // console.log("update err: ", err)
              // alert("خطأ أثناء تحديث سجل المجموعة !!")
            },
          });
          this.groupDetailsForm.removeControl('id');
        }
      },
      error: () => {
        // alert("خطأ أثناء تحديث سجل الصنف !!")
      },
    });
  }

  updateBothForms() {
    if (
      this.groupMasterForm.getRawValue().no != '' &&
      this.groupMasterForm.getRawValue().storeId != '' &&
      this.groupMasterForm.getRawValue().fiscalYearId != '' &&
      this.groupMasterForm.getRawValue().date != ''
    ) {
      this.groupDetailsForm.controls['entryId'].setValue(
        this.getMasterRowId.id
      );
      this.updateDetailsForm();
    }
  }

  getAllDetailsForms() {
    if (this.editData) {
      this.getMasterRowId = {
        "id": this.editData.id
      }
    }

    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getCcEntryDetailsByMasterId(this.getMasterRowId.id).subscribe({
        next: (res) => {
          this.matchedIds = res;
          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res, "paginate: ", this.paginator);

          if (this.matchedIds) {

            this.resultOfBalance = 0;
            this.sumOfCreditTotals = 0;
            this.sumOfDebitTotals = 0;
            for (let i = 0; i < this.matchedIds.length; i++) {
              this.sumOfCreditTotals = this.sumOfCreditTotals + parseFloat(this.matchedIds[i].credit);
              this.sumOfCreditTotals = Number(this.sumOfCreditTotals.toFixed(2));
              this.groupMasterForm.controls['creditTotal'].setValue(this.sumOfCreditTotals);

              this.sumOfDebitTotals = this.sumOfDebitTotals + parseFloat(this.matchedIds[i].debit);
              this.sumOfDebitTotals = Number(this.sumOfDebitTotals.toFixed(2));
              this.groupMasterForm.controls['debitTotal'].setValue(this.sumOfDebitTotals);

              if (this.sumOfCreditTotals > this.sumOfDebitTotals) {
                this.resultOfBalance = this.sumOfCreditTotals - this.sumOfDebitTotals;
                this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);

              }
              else {
                this.resultOfBalance = this.sumOfDebitTotals - this.sumOfCreditTotals;
                this.groupMasterForm.controls['balance'].setValue(this.resultOfBalance);

              }
              this.updateMaster();
            }
          }
        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })

      if (!this.currentPageDetails) {
        this.currentPageDetails = 0;

        this.isLoading = true;
        fetch(this.api.getCcEntryDetailsPaginateByMasterId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
          .then(response => response.json())
          .then(data => {

            console.log("details data paginate first Time: ", data);
            this.dataSource.data = data.items;
            this.pageIndexDetails = data.page;
            this.pageSizeDetails = data.pageSize;
            this.lengthDetails = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageDetails;
              this.paginator.length = this.lengthDetails;
            });

            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });
      }
      else {

        this.isLoading = true;
        fetch(this.api.getCcEntryDetailsPaginateByMasterId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
          .then(response => response.json())
          .then(data => {

            console.log("details data paginate: ", data);
            this.dataSource.data = data.items;
            this.pageIndexDetails = data.page;
            this.pageSizeDetails = data.pageSize;
            this.lengthDetails = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPageDetails;
              this.paginator.length = this.lengthDetails;
            });
            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });


      }


    }
  }

  pageChangedDetails(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSizeDetails = event.pageSize;
    this.currentPageDetails = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getAllDetailsForms();
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

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
  toastrWarningPostDetails(): void {
    this.toastr.warning("غير مسموح بادخال الدائن و المدين معا !");
  }
}
