import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { TrTraineeDialogComponent } from '../tr-trainee-dialog/tr-trainee-dialog.component';
import { GlobalService } from 'src/app/pages/services/global.service';

interface TrTrainee {
  name: any;
  code: any;
  phone: any;
  gender: any;
  address: any;
  email: any;
  corporationCLinetName: any;
  action: any;
}

@Component({
  selector: 'app-tr-trainee',
  templateUrl: './tr-trainee.component.html',
  styleUrls: ['./tr-trainee.component.css']
})
export class TrTraineeComponent implements OnInit {
  ELEMENT_DATA: TrTrainee[] = [];
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: any;
  length: any;
  dataSource: MatTableDataSource<TrTrainee> = new MatTableDataSource();

  displayedColumns: string[] = ['name', 'code', 'phone', 'gender', 'address', 'email', 'corporationCLinetName', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog, private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService, global: GlobalService) {
    global.getPermissionUserRoles(4, 'stores', ' الإدارة العامة للتدريب', 'supervised_user_circle')
  }

  ngOnInit(): void {
    this.getTrTrainee();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  openDialog() {
    this.dialog.open(TrTraineeDialogComponent, {
      width: '60%',
      height: '79%'
    }).afterClosed().subscribe(val => {
      if (val === 'Save') {
        this.getTrTrainee();
      }
    })
  }

  getTrTrainee() {
    // this.api.getTrTrainee()
    //   .subscribe({
    //     next: (res) => {
    //       this.dataSource = new MatTableDataSource(res);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //     },
    //     error: (err) => {
    //       this.toastrWarning();
    //     }

    //   })

    if (!this.currentPage) {
      this.currentPage = 0;

      // this.isLoading = true;
      fetch(this.api.getTrTraineePaginate(this.currentPage, this.pageSize))
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
      fetch(this.api.getTrTraineePaginate(this.currentPage, this.pageSize))
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

    this.getTrTrainee();
  }


  editTrTrainee(row: any) {
    this.dialog.open(TrTraineeDialogComponent, {
      width: '60%',
      height: '79%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'Update' || 'Save') {
        this.getTrTrainee();
      }
    })
  }

  daleteTrTrainee(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteTrTrainee(id)
        .subscribe({
          next: (res) => {
            if (res == 'Succeeded') {
              this.toastrDeleteSuccess();
              this.getTrTrainee();

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
