
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { StrProductDialogComponent } from '../str-product-dialog/str-product-dialog.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-str-product',
  templateUrl: './str-product.component.html',
  providers: [GlobalService],


  styleUrls: ['./str-product.component.css']
})
export class StrProductComponent implements OnInit {
  // myUrl='javascript:alert("attachment")';
  // mytrustedUrl;
   loading: boolean = false; // Flag variable
  file:any
  File = null;
  displayedColumns: string[] = ['code','name', 'itemName', 'vendorName', 'modelName','attachment', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService, private toastr: ToastrService,public global:GlobalService,private hotkeysService: HotkeysService,private http: HttpClient) {
    // this.mytrustedUrl=sanitizer.bypassSecurityTrustUrl(this.myUrl)
 
    global.getPermissionUserRoles('Store', 'str-home', 'إدارة المخازن وحسابات المخازن ', 'store')
   }

  ngOnInit(): void {
    this.getAllProducts();
    // this.getAllFiles();
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


  getAllProducts() {
    this.api.getStrProduct()
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
  
onDownload() {
  this.http.get('http://192.168.100.213/files/str-uploads', { responseType: 'blob' })
    .subscribe(response => {
      console.log("text",response);
      
      const downloadUrl = URL.createObjectURL(response);
      window.open(downloadUrl);
    });
}
  openDialog() {
    // this.loading=true;
    this.dialog.open(StrProductDialogComponent, {
      width: '47%'
    }).afterClosed().subscribe(val => {
      this.loading=false;
      if (val === 'save') {
        this.getAllProducts();
      }
    })
  }

  downloadFile(id: any)
  {
    console.log("rowid:",id);
    
     this.http.get(`http://ims.aswan.gov.eg/api/STRProduct/DownloadFile?id=${id}`)
  .subscribe({
    next: (res:any) => {
      console.log('search:', res);
      if(res.url != null && res.url != undefined){

        const url: any = res.url;
        window.open(url);
      }
      else{
        this.toastrFoundFailed();
      }
    },
    error: (err) => {
      console.log('eroorr', err);
      window.open(err.url);
    },
  });
  }

  editProduct(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(StrProductDialogComponent, {
      width: '47%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllProducts();
      }
    })
  }
      

  deleteProduct(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح المنتج ؟ ");
    if (result) {
      this.api.deleteStrProduct(id)
        .subscribe({
          next: (res) => {
            if(res == 'Succeeded'){
              console.log("res of deletestore:",res)
            alert('تم الحذف بنجاح');
            // this.toastrDeleteSuccess();

            this.getAllProducts()

          }else{
            alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
          }
            // this.toastrDeleteSuccess();
            // alert("تم حذف المنتج بنجاح");
            // this.getAllProducts()
          },
          error: () => {
            alert('خطأ فى حذف العنصر');
          },
        })
    }

  }


  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }
  toastrFoundFailed(): void {
    this.toastr.error("لا يوجد ملف لتحميله");
  }

}