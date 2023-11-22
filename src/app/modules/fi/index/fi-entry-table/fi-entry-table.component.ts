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

import { FiEntryDialogComponent } from '../fi-entry-dialog/fi-entry-dialog.component';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatTabGroup } from '@angular/material/tabs';

import {
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { Router, Params } from '@angular/router';
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

export class Account {
  constructor(public id: number, public name: string, public code: any) { }
}

export class Journal {
  constructor(public id: number, public description: string, public no: any, public startDate: any, public endDate: any) { }
}


@Component({
  selector: 'app-fi-entry-table',
  templateUrl: './fi-entry-table.component.html',
  styleUrls: ['./fi-entry-table.component.css'],
})
export class FiEntryTableComponent implements OnInit {
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
  @ViewChild(MatSort) sort!: MatSort;
  pageIndex: any;
  length: any;

  @ViewChild("matgroup", { static: false })
  matgroup!: MatTabGroup;


  currentDate: any;

  journalStartDate: any;
  journalEndDate: any;
  getMasterRowId: any;
  MasterGroupInfoEntered = false;
  dataSource!: MatTableDataSource<any>;
  sumOfTotals = 0;
  sumOfCreditTotals = 0;
  sumOfDebitTotals = 0;
  resultOfBalance = 0;
  editData: any;
  accountItemsList: any;
  defaultFiscalYearSelectValue: any;
  no: any;
  journalByNoValue: any;
  editDataDetails: any;

  userIdFromStorage = localStorage.getItem('transactionUserId');

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

    global.getPermissionUserRoles('Accounts', 'fi-home', 'إدارة الحسابات ', 'iso')

    this.accountCtrl = new FormControl();
    this.filteredAccount = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAccounts(value))
    );

    this.journalCtrl = new FormControl();
    this.filteredJournal = this.journalCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterJournals(value))
    );

    this.currentDate = new Date();


  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getJournals();
    this.getFiAccounts();
    this.getFiEntrySource();
    this.getFiscalYears();

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
      state: ['', Validators.required], //will rename to state
      transactionUserId: ['', Validators.required],
      date: [this.currentDate, Validators.required],
      description: [''],
    });

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
        jounal.description || jounal.no ? jounal.description.toLowerCase().includes(filterValue) ||
          jounal.no.toString().toLowerCase().includes(filterValue) : '-'
    );
  }

  displayJounalName(jounal: any): string {
    return jounal ? jounal.description && jounal.description != null ? jounal.description : '-' : '';
  }
  JournalSelected(event: MatAutocompleteSelectedEvent): void {
    const journal = event.option.value as Journal;
    console.log("journal selected: ", journal);
    this.selectedJournal = journal;

    this.journalStartDate = journal.startDate;
    this.journalEndDate = journal.endDate;

    this.groupMasterFormSearch.patchValue({ JournalId: journal.id });
    this.groupMasterForm.patchValue({ journalId: journal.id });

    this.getNumberByJournal(journal.no);
  }
  openAutoJournal() {
    this.journalCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.journalCtrl.updateValueAndValidity();
  }


  openFiEntryDialog() {
    let tabGroup = this.matgroup;
    tabGroup.selectedIndex = 1;

    console.log("matGroup: ", tabGroup, "selectIndex: ", tabGroup.selectedIndex);

    this.getAllDetailsForms();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  getAllMasterForms() {
    // loadData() {
    if (!this.currentPage && this.serachFlag == false) {
      this.currentPage = 0;

      this.isLoading = true;
      fetch(this.api.getFiEntryPaginate(this.currentPage, this.pageSize))
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
        fetch(this.api.getFiEntryPaginate(this.currentPage, this.pageSize))
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

  getJournals() {
    this.api.getJournals().subscribe({
      next: (res) => {
        this.journalsList = res;
        console.log('journals res: ', this.journalsList);
      },
      error: (err) => {
        console.log('fetch journals data err: ', err);
        // alert('خطا اثناء جلب الدفاتر !');
      },
    });
  }

  getFiAccounts() {
    this.api.getFiAccounts().subscribe({
      next: (res) => {
        this.accountsList = res;
        console.log('accounts res: ', this.accountsList);
      },
      error: (err) => {
        console.log('fetch accounts data err: ', err);
        // alert('خطا اثناء جلب الدفاتر !');
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
    this.groupMasterForm.controls['description'].setValue(
      this.editData.description
    );

    this.groupMasterForm.addControl(
      'id',
      new FormControl('', Validators.required)
    );
    this.groupMasterForm.controls['id'].setValue(this.editData.id);

    this.groupMasterForm.controls['transactionUserId'].setValue(
      this.userIdFromStorage
    );

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

    this.accountCtrl.reset();
    this.journalCtrl.reset();

    this.serachFlag = false;

    this.getAllMasterForms();
  }

  previewPrint(no: any, startDate: any, endDate: any, sourceId: any, FiscalYearId: any, Description: any, report: any, reportType: any) {
    let journalId = this.groupMasterFormSearch.getRawValue().JournalId;

    if (report != null && reportType != null) {
      this.loading = true;
      this.api
        .getFiEntryReport(no, journalId, startDate, endDate, sourceId, FiscalYearId, Description, report, reportType)
        .subscribe({
          next: (res) => {
            this.loading = false;
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
            this.loading = false;
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
    this.groupMasterForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
    this.groupMasterForm.controls['state'].setValue('مغلق');

    console.log('fiEntry master form: ', this.groupMasterForm.value);

    if (this.groupMasterForm.valid) {
      console.log('Master add form : ', this.groupMasterForm.value);
      let dateFormat = formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale);
      let journalStartDateFormat = formatDate(this.journalStartDate, 'yyyy-MM-dd', this.locale);
      let journalEndDateFormat = formatDate(this.journalEndDate, 'yyyy-MM-dd', this.locale);

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
            this.getAllDetailsForms();
            // this.addDetailsInfo();
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
    console.log("mastered row get all data: ", this.getMasterRowId)
    if (this.getMasterRowId) {
      this.api.getFiEntryDetailsByMasterId(this.getMasterRowId.id).subscribe({
        next: (res) => {
          this.matchedIds = res;
          console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: ", res);

          if (this.matchedIds) {
            this.dataSource = new MatTableDataSource(this.matchedIds);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

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
    }
  }

  async updateMaster() {
    console.log('nnnvvvvvvvvvv: ', this.groupMasterForm.value);

    console.log(
      'update both: ',
      this.groupDetailsForm.valid
    );
    // console.log("edit : ", this.groupDetailsForm.value)

    let dateFormat = formatDate(this.groupMasterForm.getRawValue().date, 'yyyy-MM-dd', this.locale);
    let journalStartDateFormat = formatDate(this.editData.journal_StartDate, 'yyyy-MM-dd', this.locale);
    let journalEndDateFormat = formatDate(this.editData.journal_EndDate, 'yyyy-MM-dd', this.locale);

    console.log('JOURNAL start date: ', journalStartDateFormat, "endDate: ", journalEndDateFormat, "date: ", dateFormat, "condition: ", dateFormat >= journalStartDateFormat && dateFormat <= journalEndDateFormat);
    if (dateFormat >= journalStartDateFormat && dateFormat <= journalEndDateFormat) {
      this.api.putFiEntry(this.groupMasterForm.value).subscribe({
        next: (res) => {
          this.groupDetailsForm.reset();
        },
      });
    }
    else {
      this.toastrWarningEntryDate();
      this.groupMasterForm.controls['date'].setValue('');
    }


  }

  editDetailsForm(row: any) {
    console.log("details editData: ", row);
    this.editDataDetails = row;

    // this.dialog
    //   .open(FiEntryDetailsDialogComponent, {
    //     width: '95%',
    //     height: '78%',
    //     data: row,
    //   })
    //   .afterClosed()
    //   .subscribe((val) => {
    //     if (val === 'save' || val === 'update') {
    //       this.getAllDetailsForms();
    //     }
    //   });
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
    this.api.getJournals().subscribe({
      next: (res) => {
        this.journalsList = res;
        console.log('journals res: ', this.journalsList);
        this.journalsList = res.filter((journal: any) => {
          if (journal.fiscalYearId) {
            return journal.fiscalYearId == fiscalYear;
          }
          else return false;

        });
      },
      error: (err) => {
        console.log('fetch journals data err: ', err);
      },
    });
  }

  getFiAccountItems() {
    this.api.getFiAccountItems().subscribe({
      next: (res) => {
        this.accountItemsList = res;
        // console.log("accountItems res: ", this.accountItemsList);
      },
      error: (err) => {
        console.log('fetch accountItems data err: ', err);
        // alert("خطا اثناء جلب الدفاتر !");
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
          this.no = a.no;
        }
        else {
          this.no = '-';
        }
      }
    })

  }



  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  // toastrDeleteSuccess(): void {
  //   this.toastr.success('تم الحذف بنجاح');
  // }
  toastrWarningCloseDialog(): void {
    this.toastr.warning("تحذير القيد غير متزن !");
  }

  toastrWarningEntryDate(): void {
    this.toastr.warning("هذا التاريخ خارج نطاق اليومية !");
  }

}