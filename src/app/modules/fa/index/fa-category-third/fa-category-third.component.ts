
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { GlobalService } from '../services/global.service';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';
import { FaCategoryThirdDialogComponent } from '../fa-category-third-dialog/fa-category-third-dialog.component';

@Component({
  selector: 'app-fa-category-third',
  templateUrl: './fa-category-third.component.html',
  styleUrls: ['./fa-category-third.component.css']
})
export class FaCategoryThirdComponent implements OnInit {

  displayedColumns: string[] = ['code', 'name', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService, global: GlobalService) {
  }

  ngOnInit(): void {
    this.getAllFaCategory();
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


  getAllFaCategory() {
    this.api.getFaCategoryThird()
      .subscribe({
        next: (res) => {
          console.log("res of get all FaCategoryThird: ", res);
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
    this.dialog.open(FaCategoryThirdDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getAllFaCategory();
      }
    })
  }


  editFaCategoryThird(row: any) {
    this.dialog.open(FaCategoryThirdDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تعديل') {
        this.getAllFaCategory();
      }
    })
  }



  deleteFaCategoryThird(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteFaCategoryThird(id)
        .subscribe({
          next: (res) => {
            console.log("delete row res: ", res);
            if (res == 'Succeeded') {
              this.toastrSuccessDeleteRow();
              this.getAllFaCategory();

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
