import { Component, OnInit, LOCALE_ID, ViewChild, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FIAccountHierarchyDialogComponent } from '../fi-account-hierarchy-dialog/fi-account-hierarchy-dialog.component';
import { FIJournalDialogComponent } from '../fi-journal-dialog/fi-journal-dialog.component';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import {
  FormControl,
  FormControlName,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { GlobalService } from 'src/app/pages/services/global.service';

interface fiJournal {
  no: string;
  description: string;
  startDate: string;
  endDate: string;
  action: string;
}

@Component({
  selector: 'app-fi-journal',
  templateUrl: './fi-journal.component.html',
  styleUrls: ['./fi-journal.component.css']
})
export class FIJournalComponent {
  ELEMENT_DATA: fiJournal[] = [];
  
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;

  title = 'angular13crud';
  fiscalYearsList: any;
  DescriptionsList: any;
  groupMasterForm!: FormGroup;
  // dataSource2!: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<fiJournal> = new MatTableDataSource();

  loading: boolean = false;
  displayedColumns: string[] = ['no', 'description', 'startDate', 'endDate', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource2.paginator = this.paginator;
  }
  
  constructor(private dialog: MatDialog,
    private hotkeysService: HotkeysService,
    private api: ApiService, private toastr: ToastrService, private formBuilder: FormBuilder, private global: GlobalService,
    @Inject(LOCALE_ID) private locale: string) {
    global.getPermissionUserRoles('Accounts', 'stores', 'إدارة الحسابات ', 'iso')
  }
  ngOnInit(): void {
    this.getFIJournals();
    this.getFiscalYears();

    this.groupMasterForm = this.formBuilder.group({
      no: [''],


      fiscalYear: [''],
      StartDate: [''],
      EndDate: [''],

      Description: [''],
      // storeId: [''],


      report: [''],
      reportType: ['']
      // item:['']
    });

    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog.open(FIJournalDialogComponent, {
      width: '70%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getFIJournals();
      }
    })
  }
  getFiscalYears() {
    this.api.getFiscalYears().subscribe({
      next: (res) => {
        this.fiscalYearsList = res;
        console.log('fiscalYears list: ', this.fiscalYearsList);
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getFIJournals() {
    // this.api.getFIJournal()
    //   .subscribe({
    //     next: (res) => {
    //       this.dataSource = new MatTableDataSource(res);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //       this.groupMasterForm.reset();
    //     },
    //     error: (err) => {
    //       // alert("خطأ عند استدعاء البيانات");
    //     }

    //   })

    if (!this.currentPage) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getFiJournalPaginate(this.currentPage, this.pageSize))
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
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }
    else {
      // this.isLoading = true;
      fetch(this.api.getFiJournalPaginate(this.currentPage, this.pageSize))
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
          // this.isLoading = false;
        }, error => {
          console.log(error);
          // this.isLoading = false;
        });
    }

  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.currentPage = event.previousPageIndex;
    this.getFIJournals();
  }
  
  editFIJournals(row: any) {
    this.dialog.open(FIJournalDialogComponent, {
      width: '70%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تحديث') {
        this.getFIJournals();
      }
    })
  }
  daleteFIJournals(id: number) {
    if (confirm("هل انت متأكد من الحذف؟ ")) {
      console.log("Implement delete functionality here");
    }

    this.api.deleteFIJournal(id)
      .subscribe({

        next: (res) => {
          this.toastrDeleteSuccess();
          this.getFIJournals();
        },
        error: () => {
          alert("خطأ عند الحذف")
        }
      })
  }


  async getSearchFIJournal(no: any, Description: any, StartDate: any, EndDate: any, fiscalYear: any) {

    // console.log("description: "+description,"no: "+no);
    this.loading = true;
    this.api.getFIJournalSearch(no, Description, StartDate, EndDate, fiscalYear)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.dataSource = res;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        },
        error: (err) => {
          this.loading = false;
          console.log('eroorr', err);
        }
      })
    // this.getAllGrades()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }


}
