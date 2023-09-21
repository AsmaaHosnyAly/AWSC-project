import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';
import { ParseSourceSpan } from '@angular/compiler';
import { PipesModule } from "../../pipes/pipes.module";
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class Item {
  constructor(public id: number, public name: string) { }
}

export class Vendor {
  constructor(public id: number, public name: string) { }
}

export class Model {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-str-product-dialog',
  templateUrl: './str-product-dialog.component.html',
  styleUrls: ['./str-product-dialog.component.css']
})
export class StrProductDialogComponent implements OnInit {
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  name: string = '';
  file: any;
  File = null; // Variable to store file
  freshnessList = ["Brand new", "Second Hand", "Refurbished"];
  groupForm !: FormGroup;
  actionBtn: string = "Save";
  groupSelectedSearch: any;
  basketballPlayers: any;
  // itemsList: any;
  // vendorsList: any;
  // modelsList: any;
  attachementList: any;
  itemName: any;
  productIdToEdit: any;
  userIdFromStorage: any;

  itemsList: Item[] = [];
  itemCtrl: FormControl;
  filteredItem: Observable<Item[]>;
  selectedItem: Item | undefined;
  formcontrol = new FormControl('');

  vendorsList: Vendor[] = [];
  vendorCtrl: FormControl;
  filteredVendor: Observable<Vendor[]>;
  selectedVendor: Vendor | undefined;

  modelsList: Model[] = [];
  modelCtrl: FormControl;
  filteredModel: Observable<Model[]>;
  selectedModel: Model | undefined;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<StrProductDialogComponent>,
    private toastr: ToastrService) {

    this.itemCtrl = new FormControl();
    this.filteredItem = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterItems(value))
    );

    this.vendorCtrl = new FormControl();
    this.filteredVendor = this.vendorCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterVendors(value))
    );

    this.modelCtrl = new FormControl();
    this.filteredModel = this.modelCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterModels(value))
    );

  }

  ngOnInit(): void {
    this.getItems();
    this.getVendors();
    this.getModels();

    this.groupForm = this.formBuilder.group({
      // code: ['', Validators.required],
      name: ['', Validators.required],
      itemId: ['', Validators.required],
      vendorId: ['', Validators.required],
      modelId: ['', Validators.required],
      attachment: [''],

      // platoonName: [''],
      transactionUserId: [''],
      // createUserName: [''],
      // id: [''],

    });
    this.hotkeysService.add(new Hotkey('ctrl+p', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addProduct();
      return false; // Prevent the default browser behavior
    }));
    console.log("edit data", this.editData);
    if (this.editData) {
      this.actionBtn = "Update";
      // this.groupForm.controls['code'].setValue(this.editData.code);
      this.groupForm.controls['name'].setValue(this.editData.name);
      this.groupForm.controls['itemId'].setValue(this.editData.itemId);
      this.groupForm.controls['vendorId'].setValue(this.editData.vendorId);
      this.groupForm.controls['modelId'].setValue(this.editData.modelId);
      this.groupForm.controls['attachment'].setValue(this.editData.attachment);

      // console.log("attachhh",this.editData.attachement
      // )

      // this.groupForm.controls['platoonId'].setValue(this.editData.platoonId);
      this.userIdFromStorage = localStorage.getItem('transactionUserId');

      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);
      // this.groupForm.controls['id'].setValue(this.editData.id);
      this.groupForm.addControl('id', new FormControl('', Validators.required));
      this.groupForm.controls['id'].setValue(this.editData.id);

    }

  }

  private _filterItems(value: string): Item[] {
    const filterValue = value;
    return this.itemsList.filter(item =>
      item.name.toLowerCase().includes(filterValue)
    );
  }
  displayItemName(item: any): string {
    return item && item.name ? item.name : '';
  }
  ItemSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as Item;
    console.log("item selected: ", item);
    this.selectedItem = item;
    this.groupForm.patchValue({ itemId: item.id });
    console.log("item in form: ", this.groupForm.getRawValue().itemId);
  }
  openAutoItem() {
    this.itemCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.itemCtrl.updateValueAndValidity();
  }


  private _filterVendors(value: string): Vendor[] {
    const filterValue = value;
    return this.vendorsList.filter(vendor =>
      vendor.name.toLowerCase().includes(filterValue)
    );
  }
  displayVendorName(vendor: any): string {
    return vendor && vendor.name ? vendor.name : '';
  }
  VendorSelected(event: MatAutocompleteSelectedEvent): void {
    const vendor = event.option.value as Vendor;
    console.log("vendor selected: ", vendor);
    this.selectedItem = vendor;
    this.groupForm.patchValue({ vendorId: vendor.id });
    console.log("vendor in form: ", this.groupForm.getRawValue().vendorId);
  }
  openAutoVendor() {
    this.vendorCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.vendorCtrl.updateValueAndValidity();
  }


  private _filterModels(value: string): Vendor[] {
    const filterValue = value;
    return this.modelsList.filter(model =>
      model.name.toLowerCase().includes(filterValue)
    );
  }
  displayModelName(model: any): string {
    return model && model.name ? model.name : '';
  }
  ModelSelected(event: MatAutocompleteSelectedEvent): void {
    const model = event.option.value as Model;
    console.log("model selected: ", model);
    this.selectedItem = model;
    this.groupForm.patchValue({ modelId: model.id });
    console.log("model in form: ", this.groupForm.getRawValue().modelId);
  }
  openAutoModel() {
    this.modelCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.modelCtrl.updateValueAndValidity();
  }

  //   onChange(event:any) {
  //     this.file = event.target.files[0];
  //     console.log(event)
  // }


  // // OnClick of button Upload
  // onUpload() {
  //   const fd=new FormData;
  //   fd.append('IMAGES',this.file,this.file.name);
  //   this.api.upload(this.file).subscribe(event=>{console.log(event)

  //   })
  //     // this.loading = !this.loading;
  //     // console.log(this.file);
  //     // this.api.upload(this.file).subscribe(
  //     //     (event: any) => {
  //     //         if (typeof (event) === 'object') {

  //     //             // Short link via api response
  //     //             this.shortLink = event.link;

  //     //             this.loading = false; // Flag variable 
  //     //         }
  //     //     }
  //     // );
  // }
  onChange(event: any) {
    this.file = event.target.files[0];
    console.log("file", this.file);
    alert("on change function")

  }

  // OnClick of button Upload
  onUpload() {
    let formdata = new FormData;
    formdata.set("name", this.file.name)
    formdata.set("file", this.file)
    this.groupForm.controls['attachment'].setValue(formdata);
    console.log("form data", formdata)



    // this.http.post("http://192.168.100.213/files/str-uploads",formdata).subscribe((response)=>{

    // })

    // this.loading = !this.loading;
    this.api.upload(this.file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {

          // Short link via api response
          this.shortLink = event.link;

          this.loading = false; // Flag variable 
          console.log("shortlink", this.shortLink)
          this.groupForm.controls['attachment'].setValue(this.shortLink);
          alert("display link: " + this.groupForm.getRawValue().attachment)
        }
      }
    );
  }
  async addProduct() {
    // console.log("att",this.editData.attachement)

    console.log("form entered values", this.groupForm.value);
    if (!this.editData) {
      this.groupForm.removeControl('id')

      // if (this.groupForm.getRawValue().platoonId) {
      // this.itemName = await this.getItemByID(this.groupForm.getRawValue().platoonId);
      // this.groupForm.controls['platoonName'].setValue(this.platoonName);
      this.userIdFromStorage = localStorage.getItem('transactionUserId');
      this.groupForm.controls['transactionUserId'].setValue(this.userIdFromStorage);

      console.log("form add product value: ", this.groupForm.value)

      console.log("if state: ", this.groupForm.valid)
      if (this.groupForm.valid) {
        this.api.postStrProduct(this.groupForm.value)
          .subscribe({
            next: (res) => {
              console.log("add product res: ", res);
              this.productIdToEdit = res.id;

              this.toastrSuccess();
              alert("تمت إضافة المنتج بنجاح");
              this.groupForm.reset();

              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("حدث خطأ أثناء إضافة منتج");
              console.log("post product with api err: ", err)
            }
          })
      }
      // }

    }
    else {
      this.updateProduct()
    }
  }

  updateProduct() {
    console.log("update product last values, id: ", this.groupForm.value)
    this.api.putStrProduct(this.groupForm.value)
      .subscribe({
        next: (res) => {
          alert("تم تحديث المنتج بنجاح");
          this.toastrSuccess();
          this.groupForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ أثناء تحديث سجل المنتج !!")
        }
      })
  }

  getItems() {
    this.api.getItems()
      .subscribe({
        next: (res) => {
          this.itemsList = res;
          console.log("itemsList res: ", this.itemsList);
        },
        error: (err) => {
          console.log("fetch items data err: ", err);
          alert("خطا اثناء جلب العناصر !");
        }
      })
  }

  getVendors() {
    this.api.getVendors()
      .subscribe({
        next: (res) => {
          this.vendorsList = res;
          console.log("vendorsList res: ", this.vendorsList);
        },
        error: (err) => {
          console.log("fetch vendors data err: ", err);
          alert("خطا اثناء جلب البائعين !");
        }
      })
  }

  getModels() {
    this.api.getModels()
      .subscribe({
        next: (res) => {
          this.modelsList = res;
          console.log("modelsList res: ", this.modelsList);
        },
        error: (err) => {
          console.log("fetch models data err: ", err);
          alert("خطا اثناء جلب النماذج !");
        }
      })
  }
  // getAttachement() {
  //   this.api.Attachement()
  //     .subscribe({
  //       next: (res) => {
  //         this.modelsList = res;
  //         console.log("modelsList res: ", this.modelsList);
  //       },
  //       error: (err) => {
  //         console.log("fetch models data err: ", err);
  //         alert("خطا اثناء جلب النماذج !");
  //       }
  //     })
  // }

  toastrSuccess(): void {
    this.toastr.success("تم الحفظ بنجاح");
  }

}