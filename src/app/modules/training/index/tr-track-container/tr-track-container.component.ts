import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-tr-track-container',
  templateUrl: './tr-track-container.component.html',
  styleUrls: ['./tr-track-container.component.css']
})
export class TrTrackContainerComponent {
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService,global:GlobalService) {
    global.getPermissionUserRoles(4, 'stores', ' الإدارة العامة للتدريب', 'supervised_user_circle')
  }

  ngOnInit(): void {
  }
}
