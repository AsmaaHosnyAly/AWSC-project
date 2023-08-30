import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { StrEmployeeExchangeDialogComponent } from '../str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-str-employee-exchange-container',
  templateUrl: './str-employee-exchange-container.component.html',
  styleUrls: ['./str-employee-exchange-container.component.css']
})
export class StrEmployeeExchangeContainerComponent implements OnInit{
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService,private global:GlobalService){
    global.getPermissionUserRoles(4, 'stores', 'نقل عهدة', '')
  }
   
  ngOnInit(): void {
  }

 

}
