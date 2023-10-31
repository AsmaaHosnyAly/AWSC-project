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
import { TrPurposeDialogComponent } from '../tr-purpose-dialog/tr-purpose-dialog.component';

@Component({
  selector: 'app-tr-purpose',
  templateUrl: './tr-purpose.component.html',
  styleUrls: ['./tr-purpose.component.css']
})
export class TrPurposeComponent {
  title = 'angular13crud';
  displayedColumns: string[] = [ 'name','isActive', 'action'];
  dataSource!: MatTableDataSource<any>;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog,private toastr: ToastrService, private api : ApiService,private global:GlobalService , private http:HttpClient,private hotkeysService: HotkeysService){
    global.getPermissionUserRoles('IT', '', 'الإدارة العامة للتدريب', 'supervised_user_circle')
 
  }
  ngOnInit(): void {
    this.getAllPurpose();
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }
  
  openDialog() {
    
    this.dialog.open(TrPurposeDialogComponent, {
      width: '30%'
      
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllPurpose();
      }
    })
  }
  getAllPurpose(){
    this.api.getPurpose()
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
  editPurpose(row : any){
    this.dialog.open(TrPurposeDialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllPurpose();
      }
    })
  }
  daletePurpose(id:number){
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deletePurpose(id)

  .subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
            this.toastrDeleteSuccess();
          this.getAllPurpose();
  
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
