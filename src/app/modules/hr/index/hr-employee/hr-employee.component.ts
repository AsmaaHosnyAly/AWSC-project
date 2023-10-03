
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrEmployeeDialogComponent } from '../hr-employee-dialog/hr-employee-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-hr-employee',
  templateUrl: './hr-employee.component.html',
  styleUrls: ['./hr-employee.component.css']
})
export class HrEmployeeComponent  implements OnInit {
  displayedColumns: string[] = ['name','code','national_Code','birth_Date','jobTitleName','maritalState','qualificationName', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getHrEmployee();
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

  openDialog() {
    this.dialog.open(HrEmployeeDialogComponent, {
      width: '85%',
      height:'79%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getHrEmployee();
      }
    })
  }

  getHrEmployee() {
    this.api.getHrEmployee()
      .subscribe({
        next: (res) => {
          console.log("res of get all hremployee: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات انواع التعيينات !!");
        }
      })
  }

  editHrEmployee(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(HrEmployeeDialogComponent, {
      width: '85%',
      height:'79%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getHrEmployee();
      }
    })
  }

  deleteHrEmployee(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح نوع التعيين ؟ ");
    if (result) {
      this.api.deleteHrEmployee(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            // alert("تم حذف نوع التعيين بنجاح");
            this.getHrEmployee()
          },
          error: () => {
            alert("خطأ أثناء حذف نوع التعيين !!");
          }
        })
    }

  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}

