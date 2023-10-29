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
import { TrExcutedDialogComponent } from '../tr-excuted-dialog/tr-excuted-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-tr-excuted',
  templateUrl: './tr-excuted.component.html',
  styleUrls: ['./tr-excuted.component.css']
})
export class TrExcutedComponent implements OnInit{
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns: string[] = ['classRoomName', 'courseName', 'noTrainee', 'days', 'fiscalYearName', 'purposeName', 'trainingCenterName', 'Action'];

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

  dataSource2!: MatTableDataSource<any>;

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
    global.getPermissionUserRoles('IT', '', 'الإدارة العامة للتدريب', '')
  }

  ngOnInit(): void {
    this.getAllMasterForms();
  }

  openDialog() {
    this.dialog
      .open(TrExcutedDialogComponent, {
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
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  getAllMasterForms() {
    if (!this.currentPage) {
      this.currentPage = 0;

      this.isLoading = true;

      this.api.getTrExcuted().subscribe({
        next: (res) => {
          console.log("get all trExcuted res: ", res);
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;

        },
        error: (err) => {
          // console.log("fetch items data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
    }

  }

  editMasterForm(row: any) {
    this.dialog
      .open(TrExcutedDialogComponent, {
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

  // deleteAllForms(id: number) {
  //   this.masterRowIdDelete = id;
  //   var result = confirm('تاكيد الحذف ؟ ');

  //   if (result) {
  //     this.api.deletePyItemGroup(id).subscribe({
  //       next: (res) => {
  //         this.api.getPyItemGroupDetailsByHeaderId(id)
  //           .subscribe({
  //             next: (res) => {

  //               this.matchedIds = res;

  //               for (let i = 0; i < this.matchedIds.length; i++) {
  //                 this.deleteFormDetails(this.matchedIds[i].id);
  //                 this.deleteFormDetailsEmployee(this.matchedIds[i].id);
  //               }

  //             },
  //             error: (err) => {
  //               this.toastrDeleteError();

  //             }
  //           })

  //         this.getAllMasterForms();
  //       },
  //       error: () => {
  //         // alert('خطأ أثناء حذف المجموعة !!');
  //       },
  //     });
  //   }
  // }

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

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }

  toastrDeleteError(): void {
    this.toastr.error('خطا اثناء حذف البيانات !!');
  }
}
