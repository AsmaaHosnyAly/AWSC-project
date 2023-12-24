
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-cc-entry-container',
  templateUrl: './cc-entry-container.component.html',
  styleUrls: ['./cc-entry-container.component.css']
})
export class CcEntryContainerComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService,global:GlobalService) { 
    global.getPermissionUserRoles('CC', 'ccHome', 'التكاليف', 'credit_card')
  }

  ngOnInit(): void {
  }


}
