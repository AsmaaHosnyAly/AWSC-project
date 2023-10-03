import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalService } from 'src/app/pages/services/global.service'; 
import { StrProudctSerialDialogComponent } from '../str-proudct-serial-dialog/str-proudct-serial-dialog.component';
import { ToastrService } from 'ngx-toastr';



export class product {
  constructor(public id: number, public name: string,public global:GlobalService) {}
}


@Component({
  selector: 'app-str-proudct-serial',
  templateUrl: './str-proudct-serial.component.html',
  styleUrls: ['./str-proudct-serial.component.css']
})
export class StrProudctSerialComponent  implements OnInit{
  productCtrl: FormControl;
  filteredProductes: Observable<product[]>;
  productes: product[] = [];
  selectedProduct!: product;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  title = 'Angular13Crud';
  //define table fields which has to be same to api fields
  displayedColumns: string[] = [  'productName','serial','productionDate','expireDate', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private dialog: MatDialog, private api: ApiService,private global:GlobalService,private toastr: ToastrService,) {
  this.productCtrl = new FormControl();
  this.filteredProductes = this.productCtrl.valueChanges.pipe(
    startWith(''),
    map((value) => this._filterProductes(value))
  );

  global.getPermissionUserRoles(4, 'stores', ' الموديل', '')
}
  
  ngOnInit(): void {
    // console.log(productForm)
    
    this.getAllProductserail();
    this.api.getAllProductes().subscribe((productes) => {
      this.productes = productes;
    });
  }
  openDialog() {
    this.dialog
      .open(StrProudctSerialDialogComponent, {
        width: '60%',
      height: '75%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllProductserail();
        }
      });
  }

  displayVendorName(product: any): string {
    return product && product.name ? product.name : '';
  }
  vendorSelected(event: MatAutocompleteSelectedEvent): void {
    const product = event.option.value as product;
    this.selectedProduct = product;
    this.gradeForm.patchValue({ productId: product.id });
    this.gradeForm.patchValue({ productName: product.name });
  }
  private _filterProductes(value: string): product[] {
    const filterValue = value.toLowerCase();
    return this.productes.filter(product =>
      product.name.toLowerCase().includes(filterValue) 
    );
  }
  getAllProductserail() {
    this.api.getProductserail().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error');
      },
    });
  }

  editProductserail(row: any) {
    this.dialog
      .open(StrProudctSerialDialogComponent, {
        width: '60%',
        height: '75%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        
        if (val === 'update') {
          this.getAllProductserail();
        }
      });
  }

  deleteGrade(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteProductserail(id).subscribe({
        next: (res) => {
          if(res == 'Succeeded'){
            console.log("res of deletestore:",res)
          // alert('تم الحذف بنجاح');
          this.toastrDeleteSuccess()
          this.getAllProductserail();
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
  openAutoProduct() {
    this.productCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.productCtrl.updateValueAndValidity();
  }
  async getSearchModels(name: any) {
   
    this.api.getProductserail().subscribe({
      next: (res) => {
        //enter id
       
        if (this.selectedProduct && name == '') {
          console.log('filter ID id: ', this.selectedProduct, 'name: ', name);

          this.dataSource = res.filter(
            (res: any) => res.ProductId == this.selectedProduct.id!
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter both
        else if (this.selectedProduct && name != '') {
          console.log('filter both id: ', this.selectedProduct, 'name: ', name);

          // this.dataSource = res.filter((res: any)=> res.name==name!)
          this.dataSource = res.filter(
            (res: any) =>
              res.productId == this.selectedProduct.id! &&
              res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        //enter name
        else {
          console.log('filter name id: ', this.selectedProduct, 'name: ', name);
          // this.dataSource = res.filter((res: any)=> res.commodity==commidityID! && res.name==name!)
          this.dataSource = res.filter((res: any) =>
            res.name.toLowerCase().includes(name.toLowerCase())
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        alert('Error');
      },
    });
    // this.getAllProducts()
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


