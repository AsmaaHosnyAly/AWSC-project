
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { STREmployeeOpeningCustodyDialogComponent } from '../str-employee-opening-custody-dialog/str-employee-opening-custody-dialog.component';



@Component({
  selector: 'app-str-employee-opening-custody',
  templateUrl: './str-employee-opening-custody.component.html',
  styleUrls: ['./str-employee-opening-custody.component.css']
})
export class STREmployeeOpeningCustodyComponent implements OnInit {
  displayedColumns: string[] = ['groupCode','groupName', 'groupCommdityCode', 'groupCommdity', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

constructor(private dialog: MatDialog, private api: ApiService){

}

ngOnInit(): void {
  // this.getAllGroups();
}
  openEmployeeingStockDialog() {
    this.dialog.open(STREmployeeOpeningCustodyDialogComponent, {
      width: '90%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        // this.getAllGroups();
      }
    })
  }

}
