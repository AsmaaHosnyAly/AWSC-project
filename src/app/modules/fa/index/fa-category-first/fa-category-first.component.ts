import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';
import { FaCategorySecondDialogComponent } from '../fa-category-second-dialog/fa-category-second-dialog.component';
import { FaCategoryFirstDialogComponent } from '../fa-category-first-dialog/fa-category-first-dialog.component';


@Component({
  selector: 'app-fa-category-first',
  templateUrl: './fa-category-first.component.html',
  styleUrls: ['./fa-category-first.component.css']
})
export class FaCategoryFirstComponent implements OnInit {
  displayedColumns: string[] = ['code', 'name', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService, global: GlobalService) {
    global.getPermissionUserRoles('FA', '', 'الاصول الثابتة', 'collections_bookmark')
  }

  ngOnInit(): void {
    this.getFaCategoryFirst();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getFaCategoryFirst() {
    this.api.getFaCategoryFirst()
      .subscribe({
        next: (res) => {
          console.log("res of get all FaCategoryFirst: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          this.toastrWarningGetTableData();
        }
      })
  }

  openDialog() {
    this.dialog.open(FaCategoryFirstDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getFaCategoryFirst();
      }
    })
  }


  editFaCategoryFirst(row: any) {
    this.dialog.open(FaCategoryFirstDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تعديل') {
        this.getFaCategoryFirst();
      }
    })
  }



  deleteFaCategoryFirst(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteFaCategoryFirst(id)
        .subscribe({
          next: (res) => {
            console.log("delete row res: ", res);
            if (res == 'Succeeded') {
              this.toastrSuccessDeleteRow();
              this.getFaCategoryFirst();

            } else {
              this.toastrWarningDeleteRow();
            }
          },
          error: () => {
            this.toastrErrorDeleteRow();
          },
        });
    }

  }


  toastrWarningGetTableData(): void {
    this.toastr.warning(" خطا اثناء جلب السجلات ! ");
  }
  toastrSuccessDeleteRow(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
  toastrWarningDeleteRow(): void {
    this.toastr.warning(" لا يمكن الحذف لارتباطها بجداول اخرى ! ");
  }
  toastrErrorDeleteRow(): void {
    this.toastr.error(" خطا فى حذف العنصر ! ");
  }
}
