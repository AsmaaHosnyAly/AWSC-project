import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StrWithdrawDialogComponent } from '../str-withdraw-dialog2/str-withdraw-dialog2.component';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-str-withdraw-container',
  templateUrl: './str-withdraw-container.component.html',
  styleUrls: ['./str-withdraw-container.component.css']
})
export class StrWithdrawContainerComponent implements OnInit{
  displayedColumns: string[] = ['groupCode','groupName', 'groupCommdityCode', 'groupCommdity', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService,private global :GlobalService){
    this.global.getPermissionUserRoles(1, 'stores', ' إذن صرف ', '')
  }

  ngOnInit(): void {
    // this.getAllGroups();
  }

  

  // getAllGroups() {
  //   this.api.getGroup()
  //     .subscribe({
  //       next: (res) => {
  //         this.dataSource = new MatTableDataSource(res);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       },
  //       error: () => {
  //         // alert("خطأ أثناء جلب سجلات المجموعة !!");
  //       }
  //     })
  // }
}
