import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/pages/services/global.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';
import { ParseSourceSpan } from '@angular/compiler';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { UploadService } from 'src/app/upload.service';
import { vendor } from '../str-model/str-model.component';
export class Item {
  constructor(public id: number, public name: string) {}
}

export class Vendor {
  constructor(public id: number, public name: string) {}
}

export class Model {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-product-dialog',
  templateUrl: './str-product-dialog.component.html',
  styleUrls: ['./str-product-dialog.component.css'],
})
export class StrProductDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId');
  
  itemCtrl: FormControl;
  filteredItems: Observable<Item[]>;
  items: Item[] = [];
  selectedItem: Item | undefined;
  vendorCtrl: FormControl;
  filteredVendors: Observable<Vendor[]>;
  vendors: Vendor[] = [];
  selectedVendor: Vendor | undefined;
  modelCtrl: FormControl;
  filteredModels: Observable<Model[]>;
  models: Model[] = [];
  selectedModel: Model | undefined;
  getProductData: any;
  productForm!: FormGroup;
  actionBtn: string = 'حفظ';
  autoCode: any;
  productIdToEdit: any;
  existingNames: string[] = [];
  loading :boolean=false;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrProductDialogComponent>,
    private toastr: ToastrService
  ) {
    this.itemCtrl = new FormControl();
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterItems(value))
    );

    this.vendorCtrl = new FormControl();
    this.filteredVendors= this.vendorCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterVendors(value))
    );

    this.modelCtrl = new FormControl();
    this.filteredModels = this.modelCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterModels(value))
    );
  }

  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
    this.getProductAutoCode();
    this.productForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      itemId: ['', Validators.required],
      vendorId: ['', Validators.required],
      modelId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.getItems();

    this.getVendors();

    this.getModels();
    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addProduct();
        return false; // Prevent the default browser behavior
      })
    );

    if (this.editData) {
      this.actionBtn = 'تحديث';
      this.getProductData = this.editData;
      // alert( this.productForm.controls['name'].setValue(this.editData.name))
      this.productForm.controls['code'].setValue(this.editData.code);
      this.productForm.controls['name'].setValue(this.editData.name);
      this.productForm.controls['itemId'].setValue(this.editData.itemId);
      // this.productForm.controls['itemName'].setValue(this.editData.itemName);
      this.productForm.controls['vendorId'].setValue(this.editData.vendorId);
      // this.productForm.controls['vendorName'].setValue(this.editData.vendorName);
      this.productForm.controls['modelId'].setValue(this.editData.modelId);
      // this.productForm.controls['modelName'].setValue(this.editData.modelName);

      this.productForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.productForm.addControl('id', new FormControl('', Validators.required));
      this.productForm.controls['id'].setValue(this.editData.id);
    }
  }
  displayItemName(item: any): string {
    return item && item.name ? item.name : '';
  }

  getItems() {
    this.loading = true;
    this.api.getItems().subscribe({
      next: (res) => {
        this.loading = false;
        this.items= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getVendors() {
    this.loading = true;
    this.api.getVendors().subscribe({
      next: (res) => {
        this.loading = false;
        this.vendors= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
  getModels() {
    this.loading = true;
    this.api.getModels().subscribe({
      next: (res) => {
        this.loading = false;
        this.models= res;
       
      },
      error: (err) => {
        this.loading = false;
        console.log('fetch items data err: ', err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
  }
 
  itemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    this.selectedItem = item;
    this.productForm.patchValue({ itemId: item.id });
    this.productForm.patchValue({ itemName: item.name });
  }

  private _filterItems(value: string): Item[] {
    const filterValue = value.toLowerCase();
    return this.items.filter(item => 
      item.name ? item.name.toLowerCase().includes(filterValue) : '-'
      );
  }

  openAutoItem() {
    this.itemCtrl.setValue('');
    this.itemCtrl.updateValueAndValidity();
  }

  
  displayVendorName(vendor: any): string {
    return vendor && vendor.name ? vendor.name : '';
  }

  vendorSelected(event: MatAutocompleteSelectedEvent): void {
    const vendor = event.option.value as Vendor;
    this.selectedVendor = vendor;
    this.productForm.patchValue({ vendorId: vendor.id });
    this.productForm.patchValue({ vendorName: vendor.name });
  }

  private _filterVendors(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendors.filter( vendor =>
       vendor.name ? vendor.name.toLowerCase().includes(filterValue) : '-'
      );
  }

  openAutoVendor() {
    this.vendorCtrl.setValue('');
    this.vendorCtrl.updateValueAndValidity();
  }

  displayModelName(model: any): string {
    return model && model.name ? model.name : '';
  }

  modelSelected(event: MatAutocompleteSelectedEvent): void {
    const model = event.option.value as Model;
    this.selectedItem = model;
    this.productForm.patchValue({ modelId: model.id });
    this.productForm.patchValue({ modelName: model.name });
  }

  private _filterModels(value: string): Model[] {
    const filterValue = value.toLowerCase();
    return this.models.filter(model =>
      model.name ? model.name.toLowerCase().includes(filterValue) : '-'
    );
  }

  openAutoModel() {
    this.modelCtrl.setValue('');
    this.modelCtrl.updateValueAndValidity();
  }

  getExistingNames() {
    this.api.getStrProduct().subscribe({
      next: (res) => {
        this.existingNames = res.map((product: any) => product.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      },
    });
  }
  

  addProduct() {
    if (!this.editData) {
      const enteredName = this.productForm.get('name')?.value;

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }
      if (this.productForm.getRawValue().code) {
        this.productForm.controls['code'].setValue(this.autoCode);
      } else {
        this.productForm.controls['code'].setValue(this.autoCode);
      }
      this.productForm.removeControl('id');
      this.productForm.controls['transactionUserId'].setValue(
        this.transactionUserId
      );
      if (this.productForm.valid) {
        this.loading = true;
        this.api.postStrProduct(this.productForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log('add product res: ', res);
            this.productIdToEdit = res.id;

            this.toastrSuccess();
            this.productForm.reset();

            this.dialogRef.close('save');
          },
          error: (err) => {
            this.loading = false;
            console.log('error:',err)
              this.toastrErrorSave(); 
          },
        });
      }
      // }
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    console.log('update product last values, id: ', this.productForm.value);
    this.api.putStrProduct(this.productForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        this.toastrErrorEdit();
      },
    });
  }

  getProductAutoCode() {
    this.api.getProductAutoCode().subscribe({
      next: (res) => {
        this.autoCode = res;
        return res;
      },
      error: (err) => {
        // console.log("fetch fiscalYears data err: ", err);
        // alert("خطا اثناء جلب العناصر !");
      },
    });
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

