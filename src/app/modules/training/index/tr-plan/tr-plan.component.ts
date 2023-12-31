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
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TrPlanDialogComponent } from '../tr-plan-dialog/tr-plan-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';


interface TrPlan {
  classRoomName: string;
  Action: string;
}

@Component({
  selector: 'app-tr-plan',
  templateUrl: './tr-plan.component.html',
  styleUrls: ['./tr-plan.component.css']
})
export class TrPlanComponent implements OnInit {
  ELEMENT_DATA: TrPlan[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['tittle', 'classRoomName', 'courseName', 'noTrainee', 'days', 'finanacielDegreeName', 'fiscalYearName', 'purposeName', 'trainingCenterName', 'Action'];

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
  // accountsList: any;
  sourcesList: any;

  masterRowIdDelete: any;

  // dataSource2!: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<TrPlan> = new MatTableDataSource();

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
    global:GlobalService
  ) { 
    global.getPermissionUserRoles('IT', '', 'الإدارة العامة للتدريب', 'supervised_user_circle')
  }

  ngOnInit(): void {
    this.getAllMasterForms();
  }

  openDialog() {
    this.dialog
      .open(TrPlanDialogComponent, {
        width: '85%',
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
    // console.log("filterValue table: ", filterValue);
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  getAllMasterForms() {
    // loadData() {
    if (!this.currentPage) {
      this.currentPage = 0;

      this.isLoading = true;

      fetch(this.api.getTrPlanPaginate(this.currentPage, this.pageSize))
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

      fetch(this.api.getTrPlanPaginate(this.currentPage, this.pageSize))
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

    // this.api.getTrPlan().subscribe({
    //   next: (res) => {
    //     console.log("get all trPlan res: ", res);
    //     this.dataSource2 = res;
    //     this.dataSource2.paginator = this.paginator;
    //     this.dataSource2.sort = this.sort;

    //   },
    //   error: (err) => {
    //     // console.log("fetch items data err: ", err);
    //     // alert("خطا اثناء جلب العناصر !");
    //   }
    // })
  }



  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getAllMasterForms();
  }

  editMasterForm(row: any) {
    this.dialog
      .open(TrPlanDialogComponent, {
        width: '85%',
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

  deleteAllForms(id: number) {
    this.masterRowIdDelete = id;
    var result = confirm('تاكيد الحذف ؟ ');

    if (result) {
      // this.api.deletePyItemGroup(id).subscribe({
      //   next: (res) => {
      this.api.getTrPlanFinancierDetailsByHeaderId(id)
        .subscribe({
          next: async (res) => {

            this.matchedIds = res;

            for (let i = 0; i < this.matchedIds.length; i++) {
              await this.deleteDetailsFinancier(this.matchedIds[i].id);
            }

            this.api.getTrPlanInstructor()
              .subscribe({
                next: async (res) => {

                  this.matchedIds = res.filter((a: any) => {
                    return a.planId == id
                  });

                  for (let i = 0; i < this.matchedIds.length; i++) {
                    await this.deleteDetailsInstructor(this.matchedIds[i].id);
                  }

                  this.api.getTrPlanPositionByHeaderId(id)
                    .subscribe({
                      next: async (res) => {

                        this.matchedIds = res;

                        for (let i = 0; i < this.matchedIds.length; i++) {
                          await this.deleteDetailsPosition(this.matchedIds[i].id);
                        }

                        await this.deleteMaster();



                      },
                      // error: (err) => {
                      //   this.toastrDeleteError();

                      // }
                    })


                },
                // error: (err) => {
                //   this.toastrDeleteError();

                // }
              })

          },
          // error: (err) => {
          //   this.toastrDeleteError();

          // }
        })

      // this.getAllMasterForms();
      // },
      // error: () => {
      // alert('خطأ أثناء حذف المجموعة !!');
      //   },
      // });
    }
  }

  deleteMaster() {
    this.api.deleteTrPlan(this.masterRowIdDelete).subscribe({
      next: (res) => {
        this.toastrDeleteSuccess();
        this.getAllMasterForms();
      },
      error: (err) => {
        this.toastrDeleteError();
      },
    });
  }

  deleteDetailsFinancier(id: any) {
    // console.log("financier id: ", id);
    this.api.deleteTrPlanFinancier(id).subscribe({
      next: (res) => {
        // this.toastrDeleteSuccess();
        this.getAllMasterForms();
      },
      error: (err) => {
        this.toastrDeleteError();
      },
    });

  }

  deleteDetailsInstructor(id: any) {
    this.api.deleteTrPlanInstructor(id).subscribe({
      next: (res) => {
        // this.toastrDeleteSuccess();
        this.getAllMasterForms();
      },
      error: (err) => {
        this.toastrDeleteError();
      },
    });
  }

  deleteDetailsPosition(id: any) {
    this.api.deleteTrPlanPosition(id).subscribe({
      next: (res) => {
        // this.toastrDeleteSuccess();
        this.getAllMasterForms();
      },
      error: (err) => {
        this.toastrDeleteError();
      },
    });
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }

  toastrDeleteError(): void {
    this.toastr.error('خطا اثناء حذف البيانات !!');
  }
}
