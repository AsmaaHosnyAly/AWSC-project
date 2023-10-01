
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StrGroupDialogComponent } from '../str-group-dialog/str-group-dialog.component';
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
 
    global.getPermissionUserRoles(12, 'stores', 'المنتجات', '')
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
onDownload() {
  this.http.get('http://192.168.100.213/files/str-uploads', { responseType: 'blob' })
    .subscribe(response => {
      const downloadUrl = URL.createObjectURL(response);
      window.open(downloadUrl);
    });
}
  openDialog() {
    this.dialog.open(StrProductDialogComponent, {
      width: '47%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllProducts();
      }
    })
  }


  // getAllFiles()
  // {
  //   debugger
  //   return this.http.get('http://localhost:48608/FileManager')
  //   .subscribe((result) => {
  //     this.files = result;
  //     console.log(result);
  // });
  // }
  downloadFile(id: number, contentType: string)
  {
    return this.http.get(`http://localhost:48608/FileManager/${id}`, {responseType: 'blob'})
    .subscribe((result: Blob) => {
      const blob = new Blob([result], { type: contentType }); // you can change the type
      const url= window.URL.createObjectURL(blob);
      window.open(url);
      console.log("Success");
  });
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
      width: '47%',
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

}