// import { FileUploadComponent } from './../file-upload/file-upload.component';
// import { FileUploadDialogComponent } from 'module';
import { FileUploadDialogComponent } from '../../file-upload-dialog/file-upload-dialog.component';
// import { FileUploadComponent } from "./FileUploadComponent,";
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StrGroupDialogComponent } from '../str-group-dialog/str-group-dialog.component';
import { GlobalService } from '../../services/global.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { StrProductDialogComponent } from '../str-product-dialog/str-product-dialog.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';


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
  displayedColumns: string[] = ['name', 'itemId', 'vendorId', 'modelId','attachment', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService, private toastr: ToastrService,public global:GlobalService) {
    // this.mytrustedUrl=sanitizer.bypassSecurityTrustUrl(this.myUrl)
    global.getPermissionUserRoles(
      1,
      'stores',
      'الأصناف',
      ''
    );
   }

  ngOnInit(): void {
    this.getAllProducts();
    // console.log("shortlink",this.shortLink)
  
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
//   onUpload() {
//     this.loading = !this.loading;
//     console.log(this.file);
//     this.api.upload(this.file).subscribe(
//         (event: any) => {
//             if (typeof (event) === 'object') {

//                 // Short link via api response
//                 this.shortLink = event.link;

//                 this.loading = false; // Flag variable 
//             }
//         }
//     );
// }
  openDialog() {
    this.dialog.open(StrProductDialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllProducts();
      }
    })
  }
  // showfile(event:Event){
  //   alert("shortfileeee")
  //   this.api.showfile(this.file).subscribe(
  //     (event: any) => {
  //             this.shortLink = event.link;

  //             this.loading = false; // Flag variable 
  //             console.log("shortlink",this.shortLink)
  //         }
     
  // );
  //   }

  editProduct(row: any) {
    // console.log("edit row: ", row)
    this.dialog.open(StrProductDialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') {
        this.getAllProducts();
      }
    })
  }
   
//   showfile() {

// this.dialog.open(FileUploadDialogComponent, {
//   width: '30%',

// }).afterClosed().subscribe(val => {

//     this.getAllProducts();
  
// })
//       }
    

  deleteProduct(id: number) {
    var result = confirm("هل ترغب بتاكيد مسح المنتج ؟ ");
    if (result) {
      this.api.deleteStrProduct(id)
        .subscribe({
          next: (res) => {
            this.toastrDeleteSuccess();
            // alert("تم حذف المنتج بنجاح");
            this.getAllProducts()
          },
          // error: () => {
          //   alert("خطأ أثناء حذف المنتج !!");
          // }
        })
    }

  }

  toastrDeleteSuccess(): void {
    this.toastr.success("تم الحذف بنجاح");
  }

}