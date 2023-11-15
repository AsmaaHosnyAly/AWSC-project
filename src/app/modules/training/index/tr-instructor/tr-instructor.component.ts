import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TrInstructorDialogComponent } from '../tr-instructor-dialog/tr-instructor-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';

interface TrInstructor {
  headerCode: any;
  headerName: any;
  type: any;
  trainingCenterName: any;
  headerPhone: any;
  headerEmail: any;
  headerAddress: any;
  headerGender: any;
  headerCityName: any;
  action: any;
}

@Component({
  selector: 'app-tr-instructor',
  templateUrl: './tr-instructor.component.html',
  styleUrls: ['./tr-instructor.component.css']
})
export class TrInstructorComponent {
  ELEMENT_DATA: TrInstructor[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<TrInstructor> = new MatTableDataSource();

  title = 'angular13crud';
  displayedColumns: string[] = ['headerCode', 'headerName', 'type', 'trainingCenterName', 'headerPhone', 'headerEmail', 'headerAddress', 'headerGender', 'headerCityName', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog, private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService, global: GlobalService) {
    global.getPermissionUserRoles('IT', '', 'الإدارة العامة للتدريب', 'supervised_user_circle')
  }

  ngOnInit(): void {
    this.getTrInstructor();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  openDialog() {
    this.dialog.open(TrInstructorDialogComponent, {
      width: '50%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getTrInstructor();
      }
    })
  }

  getTrInstructor() {
    // this.api.getTrInstructor()
    //   .subscribe({
    //     next: (res) => {
    //       this.dataSource = new MatTableDataSource(res);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //     },
    //     error: (err) => {
    //       this.toastrWarning();
    //       // alert("خطأ عند استدعاء البيانات");
    //     }

    //   })

    if (!this.currentPage) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getTrInstructorPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
          this.dataSource.data = data.items;
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
      fetch(this.api.getTrInstructorPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate: ", data);
          this.dataSource.data = data.items;
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

    this.getTrInstructor();
  }

  editTrInstructor(row: any) {
    this.dialog.open(TrInstructorDialogComponent, {
      width: '50%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getTrInstructor();
      }
    })
  }

  daleteTrInstructor(row: any) {
    if (row.type != 'خارجي') {
      this.daleteTrEmpInstructor(row.id);
    }
    else if (row.type == 'خارجي') {
      this.daleteTrEmpInstructor(row.id);
      this.daleteTrExtInstructor(row.instructorDataId);
    }
  }

  daleteTrEmpInstructor(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteTrInstructor(id)
        .subscribe({
          next: (res) => {
            if (res == 'Succeeded') {
              // console.log("res of deletestore:", res)
              // alert('تم الحذف بنجاح');
              this.toastrDeleteSuccess();
              this.getTrInstructor();

            } else {
              alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
            }
          },
          error: () => {
            alert('خطأ فى حذف العنصر');
          },
        });
    }
  }

  daleteTrExtInstructor(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteTrEtrInstructor(id)
        .subscribe({
          next: (res) => {
            if (res == 'Succeeded') {
              // console.log("res of deletestore:", res)
              // alert('تم الحذف بنجاح');
              this.toastrDeleteSuccess();
              this.getTrInstructor();

            } else {
              alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
            }
          },
          error: () => {
            alert('خطأ فى حذف العنصر');
          },
        });
    }
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

  toastrWarning(): void {
    this.toastr.warning('خطأ عند استدعاء البيانات');
  }

}
