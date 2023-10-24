import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HrCityDialogComponent } from '../hr-city-dialog/hr-city-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HrEmployeePositionDialogComponent } from '../hr-employee-position-dialog/hr-employee-position-dialog.component';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';
@Component({
  selector: 'app-hr-employee-position',
  templateUrl: './hr-employee-position.component.html',
  styleUrls: ['./hr-employee-position.component.css']
})
export class HrEmployeePositionComponent implements OnInit {
  title = 'angular13crud';
  displayedColumns: string[] = ['employeeName', 'positionName', 'workPlaceName', 'date', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog,private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService,private global:GlobalService) {
    global.getPermissionUserRoles('HR', '', 'شئون العاملين', '')
   }

  ngOnInit(): void {
    this.getHrEmployeePositions();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  openDialog() {
    this.dialog.open(HrEmployeePositionDialogComponent, {
      width: '50%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getHrEmployeePositions();
      }
    })
  }

  getHrEmployeePositions() {
    this.api.getHrEmployeePosition()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          this.toastrWarning();
          // alert("خطأ عند استدعاء البيانات");
        }

      })
  }

  editHrEmployeePosition(row: any) {
    this.dialog.open(HrEmployeePositionDialogComponent, {
      width: '50%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getHrEmployeePositions();
      }
    })
  }

  daleteHrEmployeePosition(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteHrEmployeePosition(id)
        .subscribe({
          next: (res) => {
            if (res == 'Succeeded') {
              // console.log("res of deletestore:", res)
              // alert('تم الحذف بنجاح');
              this.toastrDeleteSuccess();
              this.getHrEmployeePositions();

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
