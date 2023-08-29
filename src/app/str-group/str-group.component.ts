
import { Component,OnInit,ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StrGroupDialogComponent } from '../str-group-dialog/str-group-dialog.component';
import { GlobalService } from '../services/global.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-str-group',
  templateUrl: './str-group.component.html',
  styleUrls: ['./str-group.component.css']

  
})

export class StrGroupComponent {
  displayedColumns: string[] = ['code', 'name', 'platoonId', 'platoonName', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService, private toastr: ToastrService,private global:GlobalService) {
    global.getPermissionUserRoles(8,'stores', 'المجموعة', '')
   }

  ngOnInit(): void {
    this.getAllGroups();

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllGroups() {
    this.api.getGroup()
      .subscribe({
        next: (res) => {
          // console.log("response of get all getGroup from api bannel: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })
  }

  editGroup(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(StrGroupDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllGroups();
      }
    })
  }

  deleteGroup(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح المجموعة ؟ ");
    if (result) {
      this.api.deleteGroup(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            // alert("تم حذف المجموعة بنجاح");
            this.getAllGroups()
          },
          // error: () => {
          //   alert("خطأ أثناء حذف المجموعة !!");
          // }
        })
    }

  }

  openGroupDialog() {
    this.dialog.open(StrGroupDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllGroups();
      }
    })
  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }

}
