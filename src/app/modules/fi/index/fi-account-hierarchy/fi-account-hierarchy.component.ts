import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { FIAccountHierarchyDialogComponent } from '../fi-account-hierarchy-dialog/fi-account-hierarchy-dialog.component';

@Component({
  selector: 'app-fi-account-hierarchy',
  templateUrl: './fi-account-hierarchy.component.html',
  styleUrls: ['./fi-account-hierarchy.component.css']
})
export class FIAccountHierarchyComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'name','level', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog, private api : ApiService){}
  ngOnInit(): void {
    this.getFIAccountHierarchies();
  }
  openDialog() {
    this.dialog.open(FIAccountHierarchyDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getFIAccountHierarchies();
      }
    })
  }
  getFIAccountHierarchies(){
    this.api.getFIAccountHierarchy()
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
  editFIAccountHierarchies(row : any){
    this.dialog.open(FIAccountHierarchyDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getFIAccountHierarchies();
      }
    })
  }
  daleteFIAccountHierarchies(id:number){
    if(confirm("Are you sure to delete ")) {
      console.log("Implement delete functionality here");
    }
    this.api.deleteFIAccountHierarchy(id)
    .subscribe({
      next:(res)=>{
        alert("تأكيد حذف الوحدة");
        this.getFIAccountHierarchies();
      },
      error:()=>{
        alert("خطأ عند الحذف")
      }
    })
  }

  async getSearchGrades(level :any,name:any) {
    
  console.log("name: "+name,"commidityID: "+level);
  
        this.api.getFIAccountHierarchy()
          .subscribe({
            next: (res) => {
              // 1-
              if (level != '' && name == '' ){
            console.log("enter id only: ", "res : ", res, "input id: ", level)
  
                this.dataSource = res.filter((res: any)=> res.level==level!) 
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              else if (level != '' && name != ''){
            console.log("enter name & id: ", "res : ", res, "input name: ", name, "id: ", level)
  
                // this.dataSource = res.filter((res: any)=> res.name==name!)
                this.dataSource = res.filter((res: any)=> res.level==level! && res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              else{
            console.log("enter name only: ", "res name: ", res, "input name: ", name)
  
                // this.dataSource = res.filter((res: any)=> res.level==level! && res.name==name!)
                this.dataSource = res.filter((res: any)=> res.name.toLowerCase().includes(name.toLowerCase()))
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            
              
            },
            error: (err) => {
              alert("Error")
            }
          })
          // this.getAllGrades()
        }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
