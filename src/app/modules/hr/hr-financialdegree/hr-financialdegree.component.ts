import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { GlobalService } from 'src/app/pages/services/global.service';

import { HttpClient } from '@angular/common/http';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { HrFinancialdegreeDailogComponent } from '../hr-financialdegree-dailog/hr-financialdegree-dailog.component';

@Component({
  selector: 'app-hr-financialdegree',
  templateUrl: './hr-financialdegree.component.html',
  styleUrls: ['./hr-financialdegree.component.css']
})
export class HrFinancialdegreeComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'name','noYear', 'action'];
  dataSource!: MatTableDataSource<any>;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService,private global:GlobalService , private http:HttpClient,private hotkeysService: HotkeysService){
    // global.getPermissionUserRoles(9, 'stores', 'الوحدة', '')
    
 
  }
  ngOnInit(): void {
    this.getAllFinancialDegree();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  
  openDialog() {
    
    this.dialog.open(HrFinancialdegreeDailogComponent, {
      width: '30%'
      
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllFinancialDegree();
      }
    })
  }
  getAllFinancialDegree(){
    this.api.getFinancialDegree()
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
    this.dialog.open(HrFinancialdegreeDailogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllFinancialDegree();
      }
    })
  }
  daleteunit(id:number){
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteFinancialDegree(id)

  .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
          alert('تم الحذف بنجاح');
          this.getAllFinancialDegree();
  
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
  

}
