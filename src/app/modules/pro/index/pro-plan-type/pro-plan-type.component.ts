import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProTenderTypeDailogComponent } from '../pro-tender-type-dailog/pro-tender-type-dailog.component';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { GlobalService } from 'src/app/pages/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-pro-plan-type',
  templateUrl: './pro-plan-type.component.html',
  styleUrls: ['./pro-plan-type.component.css']
})
export class ProPlanTypeComponent {

  displayedColumns: string[] = ['code', 'name', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService, global: GlobalService) {
  }

  ngOnInit(): void {
    this.getAllTenderType();
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


  getAllTenderType() {
    this.api.getTenderType()
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
    this.dialog.open(ProTenderTypeDailogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getAllTenderType();
      }
    })
  }


  editFaCategoryFirst(row: any) {
    this.dialog.open(ProTenderTypeDailogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تعديل') {
        this.getAllTenderType();
      }
    })
  }



  deleteFaCategoryFirst(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteTenderType(id)
        .subscribe({
          next: (res) => {
            console.log("delete row res: ", res);
            if (res == 'Succeeded') {
              this.toastrSuccessDeleteRow();
              this.getAllTenderType();

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

