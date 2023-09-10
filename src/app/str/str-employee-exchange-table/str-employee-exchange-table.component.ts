import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { StrEmployeeExchangeDialogComponent } from '../str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-str-employee-exchange-table',
  templateUrl: './str-employee-exchange-table.component.html',
  styleUrls: ['./str-employee-exchange-table.component.css']
})
export class StrEmployeeExchangeTableComponent implements OnInit {
  displayedColumns: string[] = ['no', 'fiscalyear', 'employeeName', 'destEmployeeName', 'costCenterName', 'date', 'Action'];
  matchedIds: any;
  storeList: any;
  storeName: any;
  fiscalYearsList: any;
  employeesList: any;
  costCentersList: any;

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
    this.getStores();
    this.getFiscalYears();
    this.getEmployees();
    this.getCostCenters();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  openEmployeeExchangeDialog() {
    this.dialog.open(StrEmployeeExchangeDialogComponent, {
      width: '60%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllMasterForms();
      }
    })
  }

  getAllMasterForms() {
    this.api.getStrEmployeeExchange()
      .subscribe({
        next: (res) => {
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })


  }

  getStores() {
    this.api.getStore()
      .subscribe({
        next: (res) => {
          this.storeList = res;
        },
        error: (err) => {
          // console.log("fetch store data err: ", err);
          // alert("خطا اثناء جلب المخازن !");
        }
      })
  }

  editMasterForm(row: any) {
    this.dialog.open(StrEmployeeExchangeDialogComponent, {
      width: '60%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update' || val === 'save') {
        this.getAllMasterForms();
      }
    })
  }

  deleteBothForms(id: number) {

    this.http.get<any>("http://ims.aswan.gov.eg/api/STREmployeeExchangeDetails/get/all")
      .subscribe(res => {
        this.matchedIds = res.filter((a: any) => {
          return a.employee_ExchangeId === id
        })
        var result = confirm("هل ترغب بتاكيد حذف التفاصيل و الرئيسي؟");

        if (this.matchedIds.length) {
          for (let i = 0; i < this.matchedIds.length; i++) {
            if (result) {
              this.api.deleteStrEmployeeExchangeDetails(this.matchedIds[i].id)
                .subscribe({
                  next: (res) => {

                    this.api.deleteStrEmployeeExchange(id)
                      .subscribe({
                        next: (res) => {
                          this.toastrDeleteSuccess();
                          this.getAllMasterForms();
                        },
                        error: () => {
                          // alert("خطأ أثناء حذف الرئيسي !!");
                        }
                      })

                  },
                  error: () => {
                    // alert("خطأ أثناء حذف التفاصيل !!");
                  }
                })
            }

          }
        }
        else {
          if (result) {
            this.api.deleteStrEmployeeExchange(id)
              .subscribe({
                next: (res) => {
                  this.toastrDeleteSuccess();
                  this.getAllMasterForms();
                },
                error: () => {
                  // alert("خطأ أثناء حذف الرئيسي !!");
                }
              })
          }
        }

      }, err => {
        // alert("خطا اثناء تحديد المجموعة !!")
      })

  }

  getFiscalYears() {
    this.api.getFiscalYears()
      .subscribe({
        next: (res) => {
          this.fiscalYearsList = res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getEmployees() {
    this.api.getHrEmployees()
      .subscribe({
        next: (res) => {
          this.employeesList = res;
        },
        error: (err) => {
          // console.log("fetch employees data err: ", err);
          // alert("خطا اثناء جلب الموظفين !");
        }
      })
  }

  getCostCenters() {
    this.api.getFiCostCenter()
      .subscribe({
        next: (res) => {
          this.costCentersList = res;
        },
        error: (err) => {
          // console.log("fetch costCenter data err: ", err);
          // alert("خطا اثناء جلب مراكز التكلفة !");
        }
      })
  }

  getSearchStrOpen(no: any, costCenterId: any, employeeId: any, date: any, distEmployee: any) {
    this.api.getStrEmployeeExchangeSearach(no, costCenterId, employeeId, date, distEmployee)
      .subscribe({
        next: (res) => {
          this.dataSource2 = res
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        },
        error: (err) => {
          // alert("Error")
        }
      })
  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }












  
}