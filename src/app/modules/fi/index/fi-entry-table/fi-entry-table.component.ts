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
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, map, startWith, debounceTime } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatTabGroup } from '@angular/material/tabs';
import { Validators } from '@angular/forms';

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
  accountName: string;
  fiAccountItemId: string;
  action: string;
}

export class Account {
  constructor(public id: number, public name: string, public code: any) { }
}

export class Journal {
  constructor(public id: number, public description: string, public no: any, public startDate: any, public endDate: any) { }
}


export class AccountItem {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-fi-entry-table',
  templateUrl: './fi-entry-table.component.html',
  styleUrls: ['./fi-entry-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiEntryTableComponent implements OnInit {
  paginateFiscalYearId=localStorage.getItem('fiscalYearId');

  ELEMENT_DATA: ccEntry[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  serachFlag: boolean = false;

  displayedColumnsMaster: string[] = [
    'no',
    'balance',
    'creditTotal',
    'debitTotal',
    'journalName',
    'entrySourceTypeName',
    'state',
    'date',
    'Action',
  ];

  displayedColumns: string[] = [
    'credit',
    'debit',
    'accountName',
    'fiAccountItemId',
    'action',
  ];
  pdfurl = '';
  groupMasterFormSearch!: FormGroup;
  groupMasterForm!: FormGroup;
  groupDetailsForm!: FormGroup;
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  employeesList: any;
  costCentersList: any;
  // journalsList: any;
  // accountsList: any;
  sourcesList: any;
  loading: boolean = false;
  // dataSource2!: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<ccEntry> = new MatTableDataSource();

  accountsList: Account[] = [];
  accountCtrl: FormControl;
  filteredAccount: Observable<Account[]>;
  selectedAccount: Account | undefined;

  journalsList: Journal[] = [];
  journalCtrl: FormControl;
  filteredJournal: Observable<Journal[]>;
  selectedJournal: Journal | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginatorDetails!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageIndex: any;
  length: any;

  dataSource: MatTableDataSource<ccEntryDetails> = new MatTableDataSource();
  pageIndexDetails: any;
  lengthDetails: any;
  // pageSizeDetails: any;
  pageSizeDetails = 5;
  ELEMENT_DATA_DETAILS: ccEntryDetails[] = [];
  currentPageDetails: any;

  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;


  currentDate: any;

  journalStartDate: any;
  journalEndDate: any;
  getMasterRowId: any;
  MasterGroupInfoEntered = false;
  // dataSource!: MatTableDataSource<any>;
  sumOfTotals = 0;
  sumOfCreditTotals = 0;
  sumOfDebitTotals = 0;
  resultOfBalance = 0;
  editData: any;
  // accountItemsList: any;
  defaultFiscalYearSelectValue: any;
  journalNo: any;
  journalByNoValue: any;
  editDataDetails: any;
  defaultState: any;
  entryRowReadOnlyState: boolean = true;

  accountItemsList: AccountItem[] = [];
  accountItemCtrl: FormControl;
  filteredAccountItem: Observable<AccountItem[]>;
  selectedAccountItem: AccountItem | undefined;

  userIdFromStorage = localStorage.getItem('transactionUserId');
  journalStartDateFormat: any;
  journalEndDateFormat: any;
  dateFormat: any;
  autoCode: any;

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
  }

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient, private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService,
    private global: GlobalService,
    private cdr: ChangeDetectorRef
  ) {

    global.getPermissionUserRoles('Accounts', 'fi-home', 'إدارة الحسابات ', 'iso')

    this.accountCtrl = new FormControl();
    this.filteredAccount = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filterAccounts(value))
    );

    this.journalCtrl = new FormControl();
    this.filteredJournal = this.journalCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterJournals(value))
    );

    this.currentDate = new Date();
    this.defaultState = "تحرير";

    this.accountItemCtrl = new FormControl();
    this.filteredAccountItem = this.accountItemCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Adjust the debounce time (in milliseconds) to your preference
      map((value) => this._filterAccountItems(value))
    );


  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getFiEntryAutoCode();
    this.getFiAccounts();
    this.getFiEntrySource();
    this.getFiscalYears();
    this.getFiAccountItems();

    this.groupMasterFormSearch = this.formBuilder.group({
      StartDate: [''],
      EndDate: [''],
      No: [''],
      JournalId: [''],
      FiEntrySourceTypeId: [''],
      AccountId: [''],
      FiscalYearId: [''],
      Description: ['']
    });

    this.groupMasterForm = this.formBuilder.group({
      no: ['', Validators.required],
      fiscalYearId: ['', Validators.required],
      journalId: ['', Validators.required],
      fiEntrySourceTypeId: ['', Validators.required],
      creditTotal: ['', Validators.required],
      debitTotal: ['', Validators.required],
      balance: ['', Validators.required],
      state: [this.defaultState, Validators.required], //will rename to state
      transactionUserId: ['', Validators.required],
      date: [this.currentDate, Validators.required],
      description: [''],
    });

    this.groupDetailsForm = this.formBuilder.group({
      entryId: ['', Validators.required],
      credit: [0, Validators.required],
      debit: [0, Validators.required],
      accountId: ['', Validators.required],
      fiAccountItemId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });


  }

  tabSelected(tab: any) {

    console.log("tab selected: ", tab);
    if (tab.index == 0) {
      if (this.groupMasterForm.getRawValue().balance != 0) {
        var result = confirm('القيد غير متزن هل تريد الخروج ؟');
        if (result) {
          console.log("close");

          this.editData = '';
          this.MasterGroupInfoEntered = false;
          this.journalNo = '';
          this.groupMasterForm.controls['no'].setValue('');
          this.journalCtrl.setValue('');
          this.groupMasterForm.controls['date'].setValue(this.currentDate);
          this.groupMasterForm.controls['creditTotal'].setValue(0);
          this.groupMasterForm.controls['debitTotal'].setValue(0);
          this.groupMasterForm.controls['balance'].setValue(0);
          this.groupMasterForm.controls['description'].setValue('');
          this.groupMasterForm.controls['state'].setValue(this.defaultState);
          this.groupMasterForm.controls['fiEntrySourceTypeId'].setValue('');

          this.getAllMasterForms();
        }
        else {
          console.log("continue");

          let tabGroup = this.matgroup;
          tabGroup.selectedIndex = 1;
        }
      }
      // console.log("done: ", tab);

      // this.editData = '';
      // this.MasterGroupInfoEntered = false;
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

  setState(state: any) {

    console.log("state value changed: ", state.value);

    if (this.groupMasterForm.getRawValue().state == "مغلق") {
      if (this.groupMasterForm.getRawValue().balance != 0) {
        // this.groupMasterForm.controls['state'].reset();
        this.toastrWarningCloseDialog();

      }
    }

  }

  private _filterAccounts(value: string): Account[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.accountsList.filter(
      (account) =>
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
    this.groupMasterFormSearch.patchValue({ AccountId: account.id });
    this.groupDetailsForm.patchValue({ accountId: account.id });
  }
  openAutoAccount() {
    this.accountCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.accountCtrl.updateValueAndValidity();
  }


  private _filterJournals(value: string): Journal[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.journalsList.filter(
      (jounal) =>
        jounal.description ? jounal.description.toLowerCase().includes(filterValue) : '-'
    );
  }

  displayJounalName(jounal: any): string {
    return jounal && jounal.description ? jounal.description : '';
  }
  JournalSelected(event: MatAutocompleteSelectedEvent): void {
    const journal = event.option.value as Journal;
    console.log("journal selected: ", journal);
    this.selectedJournal = journal;

    this.journalStartDate = journal.startDate;
    this.journalEndDate = journal.endDate;

    this.groupMasterFormSearch.patchValue({ JournalId: journal.id });
    this.groupMasterForm.patchValue({ journalId: journal.id });

    this.journalStartDateFormat = formatDate(journal.startDate, 'yyyy-MM-dd', this.locale);
    this.journalEndDateFormat = formatDate(journal.endDate, 'yyyy-MM-dd', this.locale);

    this.getNumberByJournal(journal.no);
  }

  openAutoJournal() {
    this.journalCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.journalCtrl.updateValueAndValidity();
  }


  openFiEntryDialog() {
    this.editData = '';
    // this.groupMasterForm.reset();
    this.groupMasterForm.controls['no'].setValue('');
    this.groupMasterForm.controls['journalId'].setValue('');
    this.journalCtrl.reset();

    this.groupMasterForm.controls['fiEntrySourceTypeId'].setValue('');
    this.groupMasterForm.controls['date'].setValue(this.currentDate);
    this.getFiscalYears();

    this.groupMasterForm.controls['creditTotal'].setValue(0);
    this.groupMasterForm.controls['debitTotal'].setValue(0);
    this.groupMasterForm.controls['balance'].setValue(0);
    this.groupMasterForm.controls['state'].setValue(this.defaultState);
    this.groupMasterForm.controls['description'].setValue('');

    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    console.log("matGroup: ", tabGroup, "selectIndex: ", tabGroup.selectedIndex);

    this.getFiEntryAutoCode()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }

    if (filterValue == '') {
      this.getAllMasterForms();
    }
  }

  getAllMasterForms() {
    console.log("fiscalYearId To paginate: ", this.paginateFiscalYearId);

    // loadData() {
    if (!this.currentPage && this.serachFlag == false) {
      this.currentPage = 0;

      this.isLoading = true;
      fetch(this.api.getFiEntryPaginate(this.currentPage, this.pageSize, this.paginateFiscalYearId))
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
      if (this.serachFlag == false) {
        this.isLoading = true;
        fetch(this.api.getFiEntryPaginate(this.currentPage, this.pageSize, this.paginateFiscalYearId))
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
      else {
        console.log("search next paginate");
        this.getSearchFiEntry(this.groupMasterFormSearch.getRawValue().No, this.groupMasterFormSearch.getRawValue().StartDate, this.groupMasterFormSearch.getRawValue().EndDate, this.groupMasterFormSearch.getRawValue().FiEntrySourceTypeId, this.groupMasterFormSearch.getRawValue().FiscalYearId, this.groupMasterFormSearch.getRawValue().Description)
      }

    }
  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getAllMasterForms();
  }


  pageChangedDetails(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSizeDetails = event.pageSize;
    this.currentPageDetails = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getAllDetailsForms();
  }

  getFiEntryAutoCode() {
    this.api.getFiEntryAutoCode().subscribe({
      next: (res) => {
        this.autoCode = res;
        this.groupMasterForm.controls['no'].setValue(this.autoCode);
        console.log('autoCode res: ', this.autoCode);
      },
      error: (err) => {
        console.log('fetch autoCode data err: ', err);
        // alert('خطا اثناء جلب الدفاتر !');
        this.toastrAutoCodeGenerateError();
      },
    });
  }



  // getFiAccounts() {
  //   this.api.getFiAccounts().subscribe({
  //     next: (res) => {
  //       this.accountsList = res;
  //       console.log('accounts res: ', this.accountsList);
  //     },
  //     error: (err) => {
  //       console.log('fetch accounts data err: ', err);
  //       // alert('خطا اثناء جلب الدفاتر !');
  //     },
  //   });
  // }

  getFiAccounts() {
    this.loading = true;
    this.api.getFiAccounts().subscribe({
      next: (res) => {
        this.loading = false;
        this.accountsList = res;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        this.loading = false;
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب العناصر !');
      },
    });
  }

  getFiEntrySource() {
    this.api.getFiEntrySource().subscribe({
      next: (res) => {
        this.sourcesList = res;
        console.log('sources res: ', this.sourcesList);
      },
      error: (err) => {
        console.log('fetch sources data err: ', err);
        // alert('خطا اثناء جلب الدفاتر !');
      },
    });
  }

  // async getFiscalYears() {
  //   this.api.getFiscalYears()
  //     .subscribe({
  //       next: async (res) => {
  //         this.fiscalYearsList = res;
  //       },
  //       error: (err) => {
  //         // console.log("fetch fiscalYears data err: ", err);
  //         // alert("خطا اثناء جلب العناصر !");
  //       }
  //     })
  // }

  async getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: async (res) => {
        this.fiscalYearsList = res;

        this.api.getLastFiscalYear().subscribe({
          next: async (res) => {

            this.defaultFiscalYearSelectValue = await res;
            console.log(
              'selectedYearggggggggggggggggggg: ',
              this.defaultFiscalYearSelectValue
            );
            if (this.editData) {
              this.groupMasterForm.controls['fiscalYearId'].setValue(
                this.editData.fiscalYearId
              );
              this.fiscalYearValueChanges(
                this.groupMasterForm.getRawValue().fiscalYearId
              );
            } else {
              this.groupMasterForm.controls['fiscalYearId'].setValue(
                this.defaultFiscalYearSelectValue.id
              );
              this.fiscalYearValueChanges(
                this.groupMasterForm.getRawValue().fiscalYearId
              );
            }
          },
          error: (err) => {
            // console.log("fetch store data err: ", err);
            // alert("خطا اثناء جلب المخازن !");
          },
        });
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }

  editMasterForm(row: any) {
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    this.editData = row;

    console.log('master edit form: ', this.editData);
    // this.actionBtnMaster = 'Update';
    this.groupMasterForm.controls['no'].setValue(this.editData.no);
    this.groupMasterForm.controls['date'].setValue(this.editData.date);

    this.groupMasterForm.controls['journalId'].setValue(
      this.editData.journalId
    );
    this.groupMasterForm.controls['fiscalYearId'].setValue(
      this.editData.fiscalYearId
    );
    this.groupMasterForm.controls['fiEntrySourceTypeId'].setValue(
      this.editData.fiEntrySourceTypeId
    );

    this.groupMasterForm.controls['balance'].setValue(this.editData.balance);
    this.groupMasterForm.controls['creditTotal'].setValue(
      this.editData.creditTotal
    );
    this.groupMasterForm.controls['debitTotal'].setValue(
      this.editData.debitTotal
    );

    this.groupMasterForm.controls['state'].setValue(this.editData.state);
    // this.setState(this.editData.state);
    if (this.groupMasterForm.getRawValue().state != "مغلق") {
      this.entryRowReadOnlyState = true;
    }
    else {
      this.entryRowReadOnlyState = false;
    }


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
    this.api.getFiEntryDetails()
      .subscribe({
        next: (res) => {

          this.matchedIds = res.filter((a: any) => {
            // console.log("matched Id & HeaderId : ", a.HeaderId === id)
            return a.entryId === id;
          });

          var result = confirm('هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟');

          if (this.matchedIds.length) {
            for (let i = 0; i < this.matchedIds.length; i++) {
              console.log(
                'matchedIds details in loop: ',
                this.matchedIds[i].id
              );

              if (result) {
                this.api.deleteFiEntryDetails(this.matchedIds[i].id).subscribe({
                  next: (res) => {
                    console.log('master id to be deleted: ', id);

                    this.api.deleteFiEntry(id).subscribe({
                      next: (res) => {
                        // alert('تم حذف الرئيسي بنجاح');
                        this.getAllMasterForms();
                      },
                      error: () => {
                        // alert('خطأ أثناء حذف الرئيسي !!');
                      },
                    });
                  },
                  error: () => {
                    // alert('خطأ أثناء حذف التفاصيل !!');
                  },
                });
              }
            }
          } else {
            if (result) {
              console.log('master id to be deleted: ', id);

              this.api.deleteFiEntry(id).subscribe({
                next: (res) => {
                  // alert('تم حذف الرئيسي بنجاح');
                  this.toastrDeleteSuccess();
                  this.getAllMasterForms();
                },
                error: () => {
                  // alert('خطأ أثناء حذف الرئيسي !!');
                },
              });
            }
          }

        },
        error: (err) => {
          // alert('خطا اثناء حذف القيد !!');

        }
      })


  }

  getSearchFiEntry(no: any, startDate: any, endDate: any, sourceId: any, FiscalYearId: any, Description: any) {
    let accountId = this.groupMasterFormSearch.getRawValue().AccountId;
    let journalId = this.groupMasterFormSearch.getRawValue().JournalId;

    console.log(
      'no.: ', no,
      'journalId: ', journalId,
      'accountId : ', accountId,
      'startDate: ', startDate,
      'endDate: ', endDate,
      'sourceId: ', sourceId,
      'FiscalYearId', FiscalYearId,
      'Description', Description
    );
    this.loading = true;
    this.api
      .getFiEntrySearach(no, journalId, accountId, startDate, endDate, sourceId, FiscalYearId, Description)
      .subscribe({
        next: (res) => {
          this.loading = false;
          console.log('search fiEntry res: ', res);

          // this.dataSource2 = res;
          // this.dataSource2.paginator = this.paginator;
          // this.dataSource2.sort = this.sort;

          this.totalRows = res.length;
          if (this.serachFlag == false) {
            this.pageIndex = 0;
            this.pageSize = 5;
            this.length = this.totalRows;
            this.serachFlag = true;
          }
          console.log('master data paginate first Time: ', res);
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;

        },
        error: (err) => {
          this.loading = false;
          // alert('Error');
        },
      });
  }

  resetForm() {
    this.groupMasterFormSearch.reset();
    this.groupMasterForm.reset();
    this.groupDetailsForm.reset();

    this.accountCtrl.reset();
    this.journalCtrl.reset();
    this.accountItemCtrl.reset();


    this.serachFlag = false;

    this.getAllMasterForms();
  }

  previewPrint(no: any, startDate: any, endDate: any, sourceId: any, FiscalYearId: any, Description: any, report: any, reportType: any) {
    let journalId = this.groupMasterFormSearch.getRawValue().JournalId;

    if (report != null && reportType != null) {
      // this.loading = true;
      this.api
        .getFiEntryReport(no, journalId, startDate, endDate, sourceId, FiscalYearId, Description, report, reportType)
        .subscribe({
          next: (res) => {
            // this.loading = false;
            let blob: Blob = res.body as Blob;
            console.log(blob);
            let url = window.URL.createObjectURL(blob);
            localStorage.setItem('url', JSON.stringify(url));
            this.pdfurl = url;
            this.dialog.open(PrintDialogComponent, {
              width: '60%',
            });

            // this.dataSource = res;
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
          },
          error: (err) => {
            // this.loading = false;
            console.log('eroorr', err);
            window.open(err.url);
          },

        });
    }
    else {
      alert("ادخل التقرير و نوع التقرير!")
    }
  }


  downloadPrint(no: any, startDate: any, endDate: any, sourceId: any, FiscalYearId: any, Description: any, report: any, reportType: any) {
    // let costCenter = this.groupMasterFormSearch.getRawValue().costCenterId;
    // let employee = this.groupMasterFormSearch.getRawValue().employeeId;
    // let item = this.groupDetailsForm.getRawValue().itemId;
    // let store = this.groupMasterFormSearch.getRawValue().storeId;
    let journalId = this.groupMasterFormSearch.getRawValue().JournalId;

    this.api
      .getFiEntryReport(no, journalId, startDate, endDate, sourceId, FiscalYearId, Description, report, reportType)
      .subscribe({
        next: (res) => {
          console.log('search:', res);
          const url: any = res.url;
          window.open(url);
          // let blob: Blob = res.body as Blob;
          // let url = window.URL.createObjectURL(blob);

          // this.dataSource = res;
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log('eroorr', err);
          window.open(err.url);
        },
      });
  }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////

  async nextToAddFormDetails() {
    this.groupMasterForm.removeControl('id');

    this.groupMasterForm.controls['creditTotal'].setValue(0);
    this.groupMasterForm.controls['debitTotal'].setValue(0);
    this.groupMasterForm.controls['balance'].setValue(0);
    this.groupDetailsForm.controls['credit'].setValue(0);
    this.groupDetailsForm.controls['debit'].setValue(0);
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

    console.log('fiEntry master form: ', this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      console.log('Master add form : ', this.groupMasterForm.value);
      let dateFormat = formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale);
      let journalStartDateFormat = formatDate(this.journalStartDate, 'yyyy-MM-dd', this.locale);
      let journalEndDateFormat = formatDate(this.journalEndDate, 'yyyy-MM-dd', this.locale);

      if (this.groupMasterForm.getRawValue().state != "مغلق") {
        this.entryRowReadOnlyState = true;
      }
      else {
        this.entryRowReadOnlyState = false;
      }

      console.log('JOURNAL start date: ', journalStartDateFormat, "endDate: ", journalEndDateFormat, "date: ", dateFormat);
      if (dateFormat >= this.journalStartDate && dateFormat <= this.journalEndDate) {
        this.api.postFiEntry(this.groupMasterForm.value).subscribe({
          next: (res) => {
            console.log('ID fiEntry after post: ', res);
            this.getMasterRowId = {
              id: res,
            };
            console.log('mastered res: ', this.getMasterRowId.id);
            this.MasterGroupInfoEntered = true;

            this.toastrSuccess();
            this.getAllMasterForms();
            this.getAllDetailsForms();
            this.addDetailsInfo();
          },
          error: (err) => {
            console.log('header post err: ', err);
          },
        });
      }
      else {
        this.toastrWarningEntryDate();
        this.groupMasterForm.controls['date'].setValue('');
      }

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
      this.api.getFiEntryDetailsByMasterId(this.getMasterRowId.id).subscribe({
        next: (res) => {
          this.matchedIds = res;
          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res, "paginate: ", this.paginator);

          if (this.matchedIds) {
            // this.dataSource = new MatTableDataSource(this.matchedIds);
            // this.dataSource.paginator = this.paginatorDetails;
            // // this.dataSource.sort = this.sort;
            // // this.dataSource.data = this.matchedIds.items;
            // this.pageIndexDetails = 0;
            // // this.pageSizeDetails = this.matchedIds.length;
            // this.lengthDetails = this.matchedIds.length;
            // // setTimeout(() => {
            // // this.paginator.pageIndexDetails = this.currentPage;
            // // this.paginator.length = this.length;
            // // });

            // console.log("dataSource: ", this.dataSource);
            this.sumOfTotals = 0;
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
        fetch(this.api.getFiEntryDeatilsPaginateByMasterId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
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
        fetch(this.api.getFiEntryDeatilsPaginateByMasterId(this.currentPageDetails, this.pageSizeDetails, this.getMasterRowId.id))
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

  async updateMaster() {
    console.log('editData: ', this.editData, "for new data: ", this.groupMasterForm.value);
    this.journalStartDateFormat;
    this.journalEndDateFormat;

    console.log('editData CASE', this.selectedJournal);

    this.dateFormat = formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale);
    if (this.editData.journal_StartDate != this.selectedJournal?.startDate && this.editData.journal_EndDate != this.selectedJournal?.endDate) {
      // alert("editData journal S date" + this.editData.journal_StartDate + "format result: " + formatDate(this.editData.journal_StartDate, 'yyyy-MM-dd', this.locale));

      this.journalStartDateFormat = formatDate(this.editData.journal_StartDate, 'yyyy-MM-dd', this.locale);
      this.journalEndDateFormat = formatDate(this.editData.journal_EndDate, 'yyyy-MM-dd', this.locale);
    }
    // else {
    //   console.log('NOT editData CASE');

    //   journalStartDateFormat = this.selectedJournal?.startDate;
    //   journalEndDateFormat = this.selectedJournal?.endDate;
    //   console.log("startDate selected journal: ", journalStartDateFormat, "endDate: ", journalEndDateFormat);
    // }


    console.log('JOURNAL start date: ', this.journalStartDateFormat, "endDate: ", this.journalEndDateFormat, "date: ", this.dateFormat, "condition: ", formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale) >= this.journalStartDateFormat && formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale) <= this.journalEndDateFormat);
    // console.log("date get time condition: ", dateFormat.getTime() >= journalStartDateFormat && dateFormat <= journalEndDateFormat);
    if (this.dateFormat == undefined || this.journalStartDateFormat == undefined || this.journalEndDateFormat == undefined) {
      // alert("False: " + this.dateFormat + "s: " + this.journalStartDateFormat + "e: " + this.journalEndDateFormat);
    }
    // else {
    //   alert("True... date: " + dateFormat + " start: " + journalStartDateFormat + " end: " + journalEndDateFormat);
    //   alert("check condition: " + dateFormat >= journalStartDateFormat && dateFormat <= journalEndDateFormat);

    //   if (dateFormat >= journalStartDateFormat && dateFormat <= journalEndDateFormat) {
    //     this.api.putFiEntry(this.groupMasterForm.value).subscribe({
    //       next: (res) => {
    //         this.getAllMasterForms();
    //         this.groupDetailsForm.reset();

    //         this.accountCtrl.reset();
    //         this.accountItemCtrl.reset();
    //       },
    //     });
    //   }
    //   else {
    //     this.toastrWarningEntryDate();
    //     this.groupMasterForm.controls['date'].setValue('');
    //   }

    // }
    if (this.groupMasterForm.getRawValue().balance != 0 && this.groupMasterForm.getRawValue().state == "مغلق") {
      this.toastrWarningCloseDialog();
      console.log("balance: ", this.groupMasterForm.getRawValue().balance, "state: ", this.groupMasterForm.getRawValue().state);
      this.groupMasterForm.controls['state'].setValue(this.defaultState);
    }
    else {
      if (formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale) >= this.journalStartDateFormat && formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale) <= this.journalEndDateFormat) {
        this.api.putFiEntry(this.groupMasterForm.value).subscribe({
          next: (res) => {
            this.getAllMasterForms();
            this.groupDetailsForm.reset();

            this.accountCtrl.reset();
            this.accountItemCtrl.reset();
          },
        });
      }
      else {
        this.toastrWarningEntryDate();
        this.groupMasterForm.controls['date'].setValue('');
      }
    }



  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////

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
            this.api.postFiEntryDetails(this.groupDetailsForm.value)
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
                  this.accountItemCtrl.reset();
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
        this.api.putFiEntryDetails(this.groupDetailsForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.groupDetailsForm.reset();

              this.accountCtrl.reset();
              this.accountItemCtrl.reset();
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


  editDetailsForm(row: any) {
    console.log("details editData: ", row);
    this.editDataDetails = row;

    this.groupDetailsForm.controls['transactionUserId'].setValue(localStorage.getItem('transactionUserId'));
    this.groupDetailsForm.controls['entryId'].setValue(this.editDataDetails.entryId);
    this.groupDetailsForm.controls['accountId'].setValue(this.editDataDetails.accountId);
    this.groupDetailsForm.controls['fiAccountItemId'].setValue(this.editDataDetails.fiAccountItemId);

    this.groupDetailsForm.controls['credit'].setValue(this.editDataDetails.credit);
    this.groupDetailsForm.controls['debit'].setValue(this.editDataDetails.debit)

    this.groupDetailsForm.addControl('id', new FormControl('', Validators.required));
    this.groupDetailsForm.controls['id'].setValue(this.editDataDetails.id);

    if (this.groupMasterForm.getRawValue().state != "مغلق") {
      this.entryRowReadOnlyState = true;
    }
    else {
      this.entryRowReadOnlyState = false;
    }
    this.getMasterRowId = {
      "id": this.editDataDetails.id
    }
  }

  deleteFormDetails(id: number) {
    console.log('details id: ', id);

    var result = confirm('هل ترغب بتاكيد الحذف ؟');
    if (result) {
      this.api.deleteFiEntryDetails(id).subscribe({
        next: (res) => {
          // alert("تم الحذف بنجاح");
          this.toastrDeleteSuccess();
          this.getAllDetailsForms();
        },
        error: () => {
          // alert("خطأ أثناء حذف التفاصيل !!");
        },
      });
    }
  }


  async fiscalYearValueChanges(fiscalyaerId: any) {
    console.log('fiscalyaer: ', fiscalyaerId);
    this.groupMasterForm.controls['fiscalYearId'].setValue(fiscalyaerId);

    this.getJournalsByFiscalYear(this.groupMasterForm.getRawValue().fiscalYearId);
  }

  getJournalsByFiscalYear(fiscalYear: any) {
    this.api.getJournalsByFiscalYearId(this.paginateFiscalYearId).subscribe({
      next: (res) => {
        this.journalsList = res;
        console.log('journals res: ', this.journalsList);
        // this.journalsList = res.filter((journal: any) => {
        //   if (journal.fiscalYearId) {
        //     return journal.fiscalYearId == fiscalYear;
        //   }
        //   else return false;

        // });
      },
      error: (err) => {
        console.log('fetch journals data err: ', err);
      },
    });
  }


  getFiAccountItems() {
    this.loading = true;
    this.api.getFiAccountItems().subscribe({
      next: (res) => {
        this.loading = false;
        this.accountItemsList = res;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (err) => {
        this.loading = false;
        // console.log("fetch store data err: ", err);
        // alert('خطا اثناء جلب العناصر !');
      },
    });
  }


  getJournalByNumbr(no: any) {
    console.log("no: ", no.target.value);
    if (no.keyCode == 13) {
      this.journalsList.filter((a: any) => {
        if (a.no == no.target.value) {
          console.log("journal obj: ", a);

          this.groupMasterForm.controls['journalId'].setValue(a.id);

          this.journalCtrl.setValue(a.description);
          if (a.description) {
            this.journalByNoValue = a.description;
          }
          else {
            this.journalByNoValue = '-';
          }
          this.journalByNoValue = a.description;

        }
      })
    }

  }

  getNumberByJournal(item: any) {
    console.log("item by code: ", item, "code: ", this.journalsList);

    this.journalsList.filter((a: any) => {
      if (a.no == item) {
        console.log("item by code selected: ", a)
        if (a.no) {
          this.journalNo = a.no;
        }
        else {
          this.journalNo = 0;
        }
      }
    })

  }



  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrAutoCodeGenerateError(): void {
    this.toastr.error('  حدث خطا اثناء توليد الكود ! ');
  }
  toastrWarningCloseDialog(): void {
    this.toastr.warning("تحذير القيد غير متزن !");
  }

  toastrWarningEntryDate(): void {
    this.journalStartDate = formatDate(this.journalStartDate, 'yyyy-MM-dd', this.locale);
    this.journalEndDate = formatDate(this.journalEndDate, 'yyyy-MM-dd', this.locale);

    this.toastr.warning(` التاريخ خارج اليومية من ${this.journalStartDate} الى ${this.journalEndDate} `);
  }

  toastrWarningPostDetails(): void {
    this.toastr.warning("غير مسموح بادخال الدائن و المدين معا !");
  }

}