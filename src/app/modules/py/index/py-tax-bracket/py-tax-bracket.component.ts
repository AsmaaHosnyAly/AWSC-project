import { Component, OnInit, ViewChild } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { GlobalService } from 'src/app/pages/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { PyTaxBracketDialogComponent } from '../py-tax-bracket-dialog/py-tax-bracket-dialog.component';
@Component({
  selector: 'app-py-tax-bracket',
  templateUrl: './py-tax-bracket.component.html',
  styleUrls: ['./py-tax-bracket.component.css']
})
export class PyTaxBracketComponent {

  title = 'angular13crud';
  displayedColumns: string[] = ['value','ratio', 'action'];
  dataSource!: MatTableDataSource<any>;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog,private toastr: ToastrService, private api : ApiService,private global:GlobalService , private http:HttpClient,private hotkeysService: HotkeysService){
    global.getPermissionUserRoles(9, 'stores', 'الوحدة', '')
    
 
  }
  ngOnInit(): void {
    this.getAllTaxBrackets();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  
  openDialog() {
    
    this.dialog.open(PyTaxBracketDialogComponent, {
      width: '30%'
      
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllTaxBrackets();
      }
    })
  }
  getAllTaxBrackets(){
    this.api.getTaxBracket()
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
  editTaxBracket(row : any){
    this.dialog.open(PyTaxBracketDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllTaxBrackets();
      }
    })
  }
  daleteTaxBracket(id:number){
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteTaxBracket(id)

  .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllTaxBrackets();
  
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

toastrDeleteSuccess(): void {
  this.toastr.success('تم الحذف بنجاح');
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
}
