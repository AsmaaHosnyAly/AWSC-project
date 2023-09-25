import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { HrCityDialogComponent } from '../hr-city-dialog/hr-city-dialog.component';

@Component({
  selector: 'app-hr-city',
  templateUrl: './hr-city.component.html',
  styleUrls: ['./hr-city.component.css']
})
export class HrCityComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'name', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService){}
  ngOnInit(): void {
    this.getHrCities();
  }
  openDialog() {
    this.dialog.open(HrCityDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getHrCities();
      }
    })
  }
  getHrCities(){
    this.api.getHrCity()
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
  editHrCities(row : any){
    this.dialog.open(HrCityDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getHrCities();
      }
    })
  }
  daleteHrCities(id:number){
    console.log("id:",id)
    if(confirm("Are you sure to delete ")) {
      console.log("Implement delete functionality here");
    }
    this.api.deleteHrCity(id)
    .subscribe({
      next:(res)=>{
        alert("تأكيد حذف الوحدة");
        this.getHrCities();
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
