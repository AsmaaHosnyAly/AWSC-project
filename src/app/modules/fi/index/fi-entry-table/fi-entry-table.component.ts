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
  constructor(public id: number, public name: string) { }
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

  displayedColumns: string[] = [
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
  pdfurl = '';
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

    global.getPermissionUserRoles('Accounts', 'stores', 'إدارة الحسابات ', 'iso')
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

  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getJournals();
    this.getFiAccounts();
    this.getFiEntrySource();
    this.getFiscalYears();

    this.groupMasterForm = this.formBuilder.group({
      StartDate: [''],
      EndDate: [''],
      No: [''],
      JournalId: [''],
      FiEntrySourceTypeId: [''],
      AccountId: [''],
      FiscalYearId: [''],
      Description: ['']
    });


    // this.groupDetailsForm = this.formBuilder.group({
    //   stR_WithdrawId: [''], //MasterId
    //   employeeId: [''],
    //   qty: [''],
    //   percentage: [''],
    //   price: [''],
    //   total: [''],
    //   transactionUserId: [1],
    //   destStoreUserId: [1],
    //   itemId: [''],
    //   stateId: [''], item: [''],

    //   // withDrawNoId: ['' ],

    //   itemName: [''],
    //   // avgPrice: [''],

    //   stateName: [''],

    //   // notesName: [''],
    // });

  }

  private _filterAccounts(value: string): Account[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.accountsList.filter(
      (account) =>
        account.name.toLowerCase().includes(filterValue)
    );
  }

  displayAccountName(account: any): string {
    return account && account.name ? account.name : '';
  }
  AccountSelected(event: MatAutocompleteSelectedEvent): void {
    const account = event.option.value as Account;
    console.log("account selected: ", account);
    this.selectedAccount = account;
    this.groupMasterForm.patchValue({ AccountId: account.id });
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
        jounal.description.toLowerCase().includes(filterValue)
    );
  }

  displayJounalName(jounal: any): string {
    return jounal && jounal.description ? jounal.description : '';
  }
  JournalSelected(event: MatAutocompleteSelectedEvent): void {
    const journal = event.option.value as Journal;
    console.log("journal selected: ", journal);
    this.selectedJournal = journal;
    this.groupMasterForm.patchValue({ JournalId: journal.id });
  }
  openAutoJournal() {
    this.journalCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.journalCtrl.updateValueAndValidity();
  }


  openFiEntryDialog() {
    this.dialog
      .open(FiEntryDialogComponent, {
        width: '60%',
        height: '79%'
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save' || val === 'update') {
          this.getAllMasterForms();
        }
      });
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
        this.getSearchFiEntry(this.groupMasterForm.getRawValue().No, this.groupMasterForm.getRawValue().StartDate, this.groupMasterForm.getRawValue().EndDate, this.groupMasterForm.getRawValue().FiEntrySourceTypeId, this.groupMasterForm.getRawValue().FiscalYearId, this.groupMasterForm.getRawValue().Description)
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

  async getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: async (res) => {
          this.fiscalYearsList = res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  editMasterForm(row: any) {
    this.dialog
      .open(FiEntryDialogComponent, {
        width: '60%',
        height: '79%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update' || val === 'save') {
          this.getAllMasterForms();
        }
      });
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
    let accountId = this.groupMasterForm.getRawValue().AccountId;
    let journalId = this.groupMasterForm.getRawValue().JournalId;

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
    this.groupMasterForm.reset();

    this.accountCtrl.reset();

    this.serachFlag = false;

    this.getAllMasterForms();
  }

  previewPrint(no: any, startDate: any, endDate: any, sourceId: any, FiscalYearId: any, Description: any, report: any, reportType: any) {
    let journalId = this.groupMasterForm.getRawValue().JournalId;

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
    // let costCenter = this.groupMasterForm.getRawValue().costCenterId;
    // let employee = this.groupMasterForm.getRawValue().employeeId;
    // let item = this.groupDetailsForm.getRawValue().itemId;
    // let store = this.groupMasterForm.getRawValue().storeId;
    let journalId = this.groupMasterForm.getRawValue().JournalId;

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
}