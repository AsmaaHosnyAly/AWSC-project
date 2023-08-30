import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { StrEmployeeExchangeDialogComponent } from '../str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { formatDate } from '@angular/common';
import { FiEntryDialogComponent } from '../fi-entry-dialog/fi-entry-dialog.component';

@Component({
  selector: 'app-fi-entry-table',
  templateUrl: './fi-entry-table.component.html',
  styleUrls: ['./fi-entry-table.component.css']
})
export class FiEntryTableComponent implements OnInit {
  displayedColumns: string[] = ['no', 'balance', 'creditTotal', 'debitTotal', 'journalName', 'entrySourceTypeName', 'state', 'date', 'Action'];
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

  constructor(private api: ApiService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getAllMasterForms();
    this.getJournals();
    this.getFiAccounts();
    this.getFiEntrySource();
  }

  openFiEntryDialog() {
    this.dialog.open(FiEntryDialogComponent, {
      width: '100%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
      }
    })
  }

  getAllMasterForms() {
    this.api.getFiEntry()
      .subscribe({
        next: (res) => {
          console.log("fiEntry from api: ", res);
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات المدخلات !!");
        }
      })


  }

  getJournals() {
    this.api.getJournals()
      .subscribe({
        next: (res) => {
          this.journalsList = res;
          console.log("journals res: ", this.journalsList);
        },
        error: (err) => {
          console.log("fetch journals data err: ", err);
          alert("خطا اثناء جلب الدفاتر !");
        }
      })
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

  getFiEntrySource() {
    this.api.getFiEntrySource()
      .subscribe({
        next: (res) => {
          this.sourcesList = res;
          console.log("sources res: ", this.sourcesList);
        },
        error: (err) => {
          console.log("fetch sources data err: ", err);
          alert("خطا اثناء جلب الدفاتر !");
        }
      })
  }

  editMasterForm(row: any) {
    this.dialog.open(FiEntryDialogComponent, {
      width: '100%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllMasterForms();
      }
    })
  }

  deleteBothForms(id: number) {

    this.http.get<any>("http://ims.aswan.gov.eg/api/FIEntryDetails/get/all")
      .subscribe(res => {
        this.matchedIds = res.filter((a: any) => {
          console.log("matched Id & entryId : ", a.entryId === id)
          return a.entryId === id
        })
        var result = confirm("هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟");

        if (this.matchedIds.length) {
          for (let i = 0; i < this.matchedIds.length; i++) {

            console.log("matchedIds details in loop: ", this.matchedIds[i].id)

            if (result) {
              this.api.deleteFiEntryDetails(this.matchedIds[i].id)
                .subscribe({
                  next: (res) => {
                    console.log("master id to be deleted: ", id)

                    this.api.deleteFiEntry(id)
                      .subscribe({
                        next: (res) => {
                          alert("تم حذف الرئيسي بنجاح");
                          this.toastrDeleteSuccess();
                          this.getAllMasterForms();
                        },
                        error: () => {
                          alert("خطأ أثناء حذف الرئيسي !!");
                        }
                      })

                  },
                  error: () => {
                    alert("خطأ أثناء حذف التفاصيل !!");
                  }
                })
            }

          }
        }
        else {
          if (result) {
            console.log("master id to be deleted: ", id)

            this.api.deleteFiEntry(id)
              .subscribe({
                next: (res) => {
                  alert("تم حذف الرئيسي بنجاح");
                  this.toastrDeleteSuccess();
                  this.getAllMasterForms();
                },
                error: () => {
                  alert("خطأ أثناء حذف الرئيسي !!");
                }
              })
          }
        }

      }, err => {
        alert("خطا اثناء تحديد المجموعة !!")
      })

  }

  getSearchStrOpen(no: any, journalId: any, accountId: any, date: any, sourceId: any) {

    console.log("no. : ", no, "journalId: ", journalId, "accountId : ", accountId, "date: ", date, "sourceId: ", sourceId);
    this.api.getFiEntrySearach(no, journalId, accountId, date, sourceId)
      .subscribe({
        next: (res) => {
          console.log("search fiEntry res: ", res);

          this.dataSource2 = res
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;

        },
        error: (err) => {
          alert("Error")
        }
      })
  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}
