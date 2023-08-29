import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { STRUnitsDialogComponent } from '../str-units-dialog/str-units-dialog.component';
import { ApiService } from '../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-str-units',
  templateUrl: './str-units.component.html',
  styleUrls: ['./str-units.component.css']
})
export class STRUnitsComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'name', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService,private global:GlobalService){
    global.getPermissionUserRoles(9, 'stores', 'الوحدة', '')
  }
  ngOnInit(): void {
    this.getAllUnits();
  }
  openDialog() {
    this.dialog.open(STRUnitsDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllUnits();
      }
    })
  }
  getAllUnits(){
    this.api.getunit()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("خطأ عند استدعاء البيانات");
      }
      
    })
  }
  editunit(row : any){
    this.dialog.open(STRUnitsDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllUnits();
      }
    })
  }
  daleteunit(id:number){
    if(confirm("Are you sure to delete ")) {
      console.log("Implement delete functionality here");
    }
    this.api.deleteunit(id)
    .subscribe({
      next:(res)=>{
        alert("تأكيد حذف الوحدة");
        this.getAllUnits();
      },
      error:()=>{
        alert("خطأ عند الحذف")
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

