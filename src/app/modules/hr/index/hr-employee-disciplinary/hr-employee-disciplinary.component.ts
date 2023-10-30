




import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { HrEmployeeDisciplinaryDialogComponent } from '../hr-employee-disciplinary-dialog/hr-employee-disciplinary-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-hr-employee-disciplinary',
  templateUrl: './hr-employee-disciplinary.component.html',
  styleUrls: ['./hr-employee-disciplinary.component.css']
})
export class HrEmployeeDisciplinaryComponent  implements OnInit {
  displayedColumns: string[] = ['no','noDays','description','employeeName','disciplinaryName','date', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService,private global:GlobalService) {
    global.getPermissionUserRoles('HR', '', 'شئون العاملين', 'people')
   }

  ngOnInit(): void {
    this.getDisciplinary();
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
    this.dialog.open(HrEmployeeDisciplinaryDialogComponent, {
      width: '50%',
      height:'75%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getDisciplinary();
      }
    })
  }

  getDisciplinary() {
    this.api.getHrEmployeeDisciplinary()
      .subscribe({
        next: (res) => {
          console.log("res of get all HrDisciplinary: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات انواع التعيينات !!");
        }
      })
  }

  editEmployeeDisciplinary(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(HrEmployeeDisciplinaryDialogComponent, {
      width: '50%',
      height:'75%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getDisciplinary();
      }
    })
  }

  deleteEmployeeDisciplinary(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح نوع التعيين ؟ ");
    if (result) {
      this.api.deleteHrEmployeeDisciplinary(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            // alert("تم حذف نوع التعيين بنجاح");
            this.getDisciplinary()
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
