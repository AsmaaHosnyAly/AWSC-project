import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';

// import { publishFacade } from '@angular/compiler';
// import { STRGradeComponent } from '../str-grade/str-grade.component';

export class Product {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-proudct-serial-dialog',
  templateUrl: './str-proudct-serial-dialog.component.html',
  styleUrls: ['./str-proudct-serial-dialog.component.css']
})
export class StrProudctSerialDialogComponent {
  transactionUserId = localStorage.getItem('transactionUserId');
  productCtrl: FormControl;
  filteredProductes: Observable<Product[]>;
  productes: Product[] = [];
  getGradeData: any;
  selectedProduct: Product | undefined;
  formcontrol = new FormControl('');
  gradeForm!: FormGroup;
  actionBtn: string = 'حفظ';
  selectedOption: any;
  Id:string  | undefined | null;
  proudutDt:any={
 id:0,
}
commname:any;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  productlist: any;
  storeList: any;
  productName: any;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private readonly route: ActivatedRoute,private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrProudctSerialDialogComponent>
  ) {
    this.productCtrl = new FormControl();
    this.filteredProductes = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProductes(value))
    );
  }
  ngOnInit(): void {
    this.gradeForm = this.formBuilder.group({
      //define the components of the form
      transactionUserId: ['', Validators.required],
      // name : ['',Validators.required],
      productionDate: ['', Validators.required],
      expireDate: ['', Validators.required],
      productId: ['', Validators.required],
      id: ['', Validators.required],
      serial: ['', Validators.required],
      // matautocompleteFieldName : [''],
    });

    this.api.getAllProductes().subscribe((productes) => {
      this.productes = productes;
    });

    if (this.editData) {
      this.actionBtn = 'تعديل';
      this.getGradeData = this.editData;
      this.gradeForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
     console.log("in edit data:",this.editData)
      // this.gradeForm.controls['name'].setValue(this.editData.name);
      this.gradeForm.controls['serial'].setValue(this.editData.serial)
      this.gradeForm.controls['productionDate'].setValue(this.editData.productionDate)
      this.gradeForm.controls['expireDate'].setValue(this.editData.expireDate)
      this.gradeForm.controls['productId'].setValue(
        this.editData.productId
      );
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.gradeForm.addControl('id', new FormControl('', Validators.required));
      this.gradeForm.controls['id'].setValue(this.editData.id);
    }
  }

  displaProductName(product: any): string {
    return product && product.name ? product.name : '';
  }

  productSelected(event: MatAutocompleteSelectedEvent): void {
    const product = event.option.value as Product;
    this.selectedProduct = product;
    this.gradeForm.patchValue({ productId: product.id });
    this.gradeForm.patchValue({ productName: product.name });
   
  }

  private _filterProductes(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.productes.filter(
      (product) =>
      product.name.toLowerCase().includes(filterValue) 
       
    );
  }

  openAutoProduct() {
    this.productCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.productCtrl.updateValueAndValidity();
  }



  addProductserail(){
    if(!this.editData){
      
      this.gradeForm.removeControl('id')
      
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.gradeForm.value);
      this.gradeForm.controls['transactionUserId'].setValue(this.transactionUserId);
      
      if(this.gradeForm.valid){
        this.api.postProductserail(this.gradeForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.gradeForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            console.log('error:',err)
              this.toastrErrorSave(); 
          }
        })
      }
    }else{
      this.updateProductserail()
    }
  }
  displayProduct (option:any):string {
    return option && option.name ? option.name:'';
  }
 
      updateProductserail(){
        this.api.putProductserail(this.gradeForm.value)
        .subscribe({
          next:(res)=>{
           console.log(res)
            // alert("تم التحديث بنجاح");
            this.toastrEdit();
            this.gradeForm.reset();
            this.dialogRef.close('update');
          },
          error:(err)=>{
            this.toastrErrorEdit();
        console.log('error:',err);
          }
        })
      }
      toastrSuccess(): void {
        this.toastr.success('تم الحفظ بنجاح');
      }
    
      toastrEdit(): void {
        this.toastr.success('تم التحديث بنجاح');
      }
    
      toastrErrorSave(): void {
        this.toastr.error('!خطأ عند حفظ البيانات');
      }
    
      toastrErrorEdit(): void {
        this.toastr.error('!خطأ عند تحديث البيانات');
      }
  }
  

