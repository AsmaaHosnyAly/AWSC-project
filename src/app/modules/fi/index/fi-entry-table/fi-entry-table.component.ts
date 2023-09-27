import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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

@Component({
  selector: 'app-fi-entry-table',
  templateUrl: './fi-entry-table.component.html',
  styleUrls: ['./fi-entry-table.component.css'],
})
export class FiEntryTableComponent implements OnInit {
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
  journalsList: any;
  accountsList: any;
  sourcesList: any;

  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient, private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getJournals();
    this.getFiAccounts();
    this.getFiEntrySource();

    this.groupMasterForm = this.formBuilder.group({
      no: [''],
      employee: [''],
      costcenter: [''],
      // :[''],
      //  costcentersList:[''],
      costCenterId: [''],
      item: [''],
      fiscalYear: [''],
      StartDate: [''],
      EndDate: [''],

      store: [''],
      storeId: [''],
      employeeId: [''],
      employeeName: [''],
      itemId: [''],
      itemName: [''],

      report: [''],
      reportType: ['']
      // item:['']
    });


    this.groupDetailsForm = this.formBuilder.group({
      stR_WithdrawId: [''], //MasterId
      employeeId: [''],
      qty: [''],
      percentage: [''],
      price: [''],
      total: [''],
      transactionUserId: [1],
      destStoreUserId: [1],
      itemId: [''],
      stateId: [''], item: [''],

      // withDrawNoId: ['' ],

      itemName: [''],
      // avgPrice: [''],

      stateName: [''],

      // notesName: [''],
    });

  }

  openFiEntryDialog() {
    this.dialog
      .open(FiEntryDialogComponent, {
        width: '95%',
        height: '85%'
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
    this.api.getFiEntry().subscribe({
      next: (res) => {
        console.log('fiEntry from api: ', res);
        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      error: () => {
        // alert('خطأ أثناء جلب سجلات المدخلات !!');
      },
    });
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

  editMasterForm(row: any) {
    this.dialog
      .open(FiEntryDialogComponent, {
        width: '95%',
        height: '85%',
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
                        this.toastrDeleteSuccess();
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

  getSearchFiEntry(
    no: any,
    journalId: any,
    accountId: any,
    date: any,
    sourceId: any
  ) {
    console.log(
      'no. : ',
      no,
      'journalId: ',
      journalId,
      'accountId : ',
      accountId,
      'date: ',
      date,
      'sourceId: ',
      sourceId
    );
    this.api
      .getFiEntrySearach(no, journalId, accountId, date, sourceId)
      .subscribe({
        next: (res) => {
          console.log('search fiEntry res: ', res);

          this.dataSource2 = res;
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: (err) => {
          // alert('Error');
        },
      });
  }
  //   previewPrint(no: any, StartDate: any,EndDate:any, fiscalYear: any,report:any,reportType:any) {
  //     let costCenter = this.groupMasterForm.getRawValue().costCenterId;
  //     let employee = this.groupMasterForm.getRawValue().employeeId;
  //     let item = this.groupMasterForm.getRawValue().itemId;
  //     let store = this.groupMasterForm.getRawValue().storeId;
  // if(report!= null && reportType!=null){
  //     this.api
  //       .getStr(no, store, StartDate,EndDate, fiscalYear, item, employee, costCenter,report,reportType)
  //       .subscribe({
  //         next: (res) => {
  //           let blob: Blob = res.body as Blob;
  //           console.log(blob);
  //           let url = window.URL.createObjectURL(blob);
  //           localStorage.setItem('url', JSON.stringify(url));
  //           this.pdfurl = url;
  //           this.dialog.open(PrintDialogComponent, {
  //             width: '50%',
  //           });

  //           // this.dataSource = res;
  //           // this.dataSource.paginator = this.paginator;
  //           // this.dataSource.sort = this.sort;
  //         },
  //         error: (err) => {
  //           console.log('eroorr', err);
  //           window.open(err.url);
  //         },

  //       });}
  //       else{
  // alert("ادخل التقرير و نوع التقرير!")      }
  //   }


  //   downloadPrint(no: any, StartDate: any,EndDate:any, fiscalYear: any,report:any,reportType:any) {
  //     let costCenter = this.groupMasterForm.getRawValue().costCenterId;
  //     let employee = this.groupMasterForm.getRawValue().employeeId;
  //     let item = this.groupDetailsForm.getRawValue().itemId;
  //     let store = this.groupMasterForm.getRawValue().storeId;

  //     this.api
  //     .getStr(no, store, StartDate,EndDate, fiscalYear, item, employee, costCenter,report,reportType)
  //     .subscribe({
  //         next: (res) => {
  //           console.log('search:', res);
  //           const url: any = res.url;
  //           window.open(url);
  //           // let blob: Blob = res.body as Blob;
  //           // let url = window.URL.createObjectURL(blob);

  //           // this.dataSource = res;
  //           // this.dataSource.paginator = this.paginator;
  //           // this.dataSource.sort = this.sort;
  //         },
  //         error: (err) => {
  //           console.log('eroorr', err);
  //           window.open(err.url);
  //         },
  //       });
  //   }
  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
