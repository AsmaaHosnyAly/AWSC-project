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
  costCentersList: any;
  journalsList: any;

  sourcesList: any;

  dataSource2: MatTableDataSource<ccEntry> = new MatTableDataSource();

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
    global.getPermissionUserRoles('Accounts', 'stores', 'إدارة الحسابات ', '')

  }

  ngOnInit(): void {
    this.getAllMasterForms();

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
  }

  openCcEntryDialog() {
    this.dialog
      .open(CcEntryDialogComponent, {
        width: '95%',
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
    this.dialog
      .open(CcEntryDialogComponent, {
        width: '95%',
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
      },
      error: (err) => {
        console.log('delete details err: ', err);
      },
    });
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
