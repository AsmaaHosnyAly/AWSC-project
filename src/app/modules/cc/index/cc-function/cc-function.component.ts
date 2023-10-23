






import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CcFunctionDialogComponent } from '../cc-function-dialog/cc-function-dialog.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
// import { GlobalService } from '../services/global.service';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-cc-function',
  templateUrl: './cc-function.component.html',
  styleUrls: ['./cc-function.component.css']
})
export class CcFunctionComponent  implements OnInit {
 
  displayedColumns: string[] = ['code','name', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private hotkeysService: HotkeysService,private api: ApiService, private toastr: ToastrService) {
   }

  ngOnInit(): void {
    this.getAllCcFunction();
    // console.log("shortlink",this.shortLink)
    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getAllCcFunction() {
    this.api.getCcFunction()
      .subscribe({
        next: (res) => {
          console.log("res of get all products: ", res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert("خطأ أثناء جلب سجلات المنتجات !!");
        }
      })
  }

  openDialog() {
    this.dialog.open(CcFunctionDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'حفظ') {
        this.getAllCcFunction();
      }
    })
  }


  editCcFunction(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(CcFunctionDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'تعديل') {
        this.getAllCcFunction();
      }
    })
  }
   


deleteCcFunction(id: number) {
  var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
  if (result) {
    this.api.deleteCcFunction(id)
    .subscribe({
      next: (res) => {
        if(res == 'Succeeded'){
          console.log("res of deletestore:",res)
        // alert('تم الحذف بنجاح');
        this.toastrDeleteSuccess();
        this.getAllCcFunction();

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
    this.toastr.success("تم الحذف بنجاح");
  }

}
