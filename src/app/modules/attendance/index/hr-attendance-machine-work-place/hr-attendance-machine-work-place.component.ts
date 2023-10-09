import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { HrAttendanceMachineWorkPlaceDialogComponent } from '../hr-attendance-machine-work-place-dialog/hr-attendance-machine-work-place-dialog.component';

@Component({
  selector: 'app-hr-attendance-machine-work-place',
  templateUrl: './hr-attendance-machine-work-place.component.html',
  styleUrls: ['./hr-attendance-machine-work-place.component.css']
})
export class HrAttendanceMachineWorkPlaceComponent implements OnInit {

  title = 'angular13crud';
  displayedColumns: string[] = ['name' ,'attendanceMachineName', 'workPlaceName', 'date', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private hotkeysService: HotkeysService, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getHrAttendanceMachineWorkPlace();

    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  openDialog() {
    this.dialog.open(HrAttendanceMachineWorkPlaceDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getHrAttendanceMachineWorkPlace();
      }
    })
  }

  getHrAttendanceMachineWorkPlace() {
    this.api.getHrAttendanceMachineWorkPlace()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert("خطأ عند استدعاء البيانات");
        }

      })
  }

  editHrAttendanceMachineWorkPlace(row: any) {
    this.dialog.open(HrAttendanceMachineWorkPlaceDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getHrAttendanceMachineWorkPlace();
      }
    })
  }

  deleteHrAttendanceMachine(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteHrAttendanceMachineWorkPlace(id)
        .subscribe({
          next: (res) => {
            if (res == 'Succeeded') {
              console.log("res of deletestore:", res)
              // alert('تم الحذف بنجاح');
              this.toastrDeleteSuccess();
              this.getHrAttendanceMachineWorkPlace();

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

}
