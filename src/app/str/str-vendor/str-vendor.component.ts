import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { StrVendorDialogComponent } from '../str-vendor-dialog/str-vendor-dialog.component';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-str-vendor',
  templateUrl: './str-vendor.component.html',
  styleUrls: ['./str-vendor.component.css']
})
export class StrVendorComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'name', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService){}
  ngOnInit(): void {
    this.getAllVendors();
  }
  openDialog() {
    this.dialog.open(StrVendorDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllVendors();
      }
    })
  }
  getAllVendors(){
    this.api.getVendor()
    .subscribe({
      next:(res)=>{
        console.log("res get vendor: ", res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        console.log("err get vendor: ", err)
        alert("خطأ عند استدعاء البيانات");
      }
      
    })
  }
  editVendor(row : any){
    this.dialog.open(StrVendorDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllVendors();
      }
    })
  }
  daleteVendor(id:number){
    if(confirm("Are you sure to delete ")) {
      console.log("Implement delete functionality here");
    }
    this.api.daleteVendor(id)
    .subscribe({
      next:(res)=>{
        alert("تأكيد حذف الوحدة");
        this.getAllVendors();
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



