import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { HrVacationDailogComponent } from '../hr-vacation-dailog/hr-vacation-dailog.component';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { GlobalService } from 'src/app/pages/services/global.service';

@Component({
  selector: 'app-hr-vacation',
  templateUrl: './hr-vacation.component.html',
  styleUrls: ['./hr-vacation.component.css']
})
export class HrVacationComponent {
title = 'angular13crud';
  displayedColumns: string[] = [ 'name', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog,private hotkeysService: HotkeysService, private api : ApiService,private toastr: ToastrService,private global:GlobalService){
    global.getPermissionUserRoles('HR', '', 'شئون العاملين', 'people')
  }
  ngOnInit(): void {
    this.getAllVacations();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  openDialog() {
    this.dialog.open(HrVacationDailogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllVacations();
      }
    })
  }
  getAllVacations(){
    this.api.getVacation()
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
  editVacation(row : any){
    this.dialog.open(HrVacationDailogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllVacations();
      }
    })
  }
  daleteVacation(id:number){
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.daleteVacation(id)
      .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
          // alert('تم الحذف بنجاح');
          this.toastrDeleteSuccess();
          this.getAllVacations();
  
  
  
        }else{
          alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
        }
        },
        error: () => {
          alert('خطأ فى حذف العنصر'); 
        },
      });
    }
  }


 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
}





