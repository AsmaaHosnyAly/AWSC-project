import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { STRAddDialogComponent } from '../str-add-dialog/str-add-dialog.component';
import { GlobalService } from '../../services/global.service';


@Component({
  selector: 'app-str-add-container',
  templateUrl: './str-add-container.component.html',
  styleUrls: ['./str-add-container.component.css']
})
export class STRAddContainerComponent implements OnInit {
  displayedColumns: string[] = ['groupCode','groupName', 'groupCommdityCode', 'groupCommdity', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService,private global:GlobalService){

    
  }

  ngOnInit(): void {
    this.getAllGroups();
  }

  openAddDialog() {
    this.dialog.open(STRAddDialogComponent, {
      width: '95%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllGroups();
      }
    })
  }

  getAllGroups() {
    this.api.getGroup()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          // alert("خطأ أثناء جلب سجلات المجموعة !!");
        }
      })
  }

}
