import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { StrEmployeeExchangeDialogComponent } from '../str-employee-exchange-dialog/str-employee-exchange-dialog.component';
import { FiEntryDialogComponent } from '../fi-entry-dialog/fi-entry-dialog.component';

@Component({
  selector: 'app-fi-entry-container',
  templateUrl: './fi-entry-container.component.html',
  styleUrls: ['./fi-entry-container.component.css']
})
export class FiEntryContainerComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) { }

  ngOnInit(): void {
  }

 
}
