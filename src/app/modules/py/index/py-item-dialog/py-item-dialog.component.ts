import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

export class Category {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-py-item-dialog',
  templateUrl: './py-item-dialog.component.html',
  styleUrls: ['./py-item-dialog.component.css']
})
export class PyItemDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')
  categoryCtrl: FormControl;
  filteredCategories: Observable<Category[]>;
  categories: Category[] = [];
  selectedCategory: Category | undefined;
  getPyItem: any;
  PyItem!: FormGroup;
  actionBtn: string = 'حفظ';
  productIdToEdit: any;
  existingNames: string[] = [];

  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<PyItemDialogComponent>){
      this.categoryCtrl = new FormControl();
      this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCategories(value))
      );
    }
    ngOnInit(): void {
      this.PyItem = this.formBuilder.group({
        name: ['', Validators.required],
        manner: ['', Validators.required],
        type: ['', Validators.required],
        calcType: ['', Validators.required],
        status: ['', Validators.required],
        party: ['', Validators.required],
        resetType: ['', Validators.required],
        equation: ['', Validators.required],
        round: ['', Validators.required],
        code: ['', Validators.required],
        value: ['', Validators.required],
        minValue: ['', Validators.required],
        maxValue: ['', Validators.required],
        resetValue: ['', Validators.required],
        visibility: ['', Validators.required],
        categoryId: ['', Validators.required],
        transactionUserId: ['',Validators.required],
      });
      
      this.api.getAllCategory().subscribe((categories) => {
        this.categories = categories;
      });
  
  
  
      this.hotkeysService.add(
        new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
          // Call the deleteGrade() function in the current component
          this.AddItem();
          return false; // Prevent the default browser behavior
        })
      );
  
      if (this.editData) {
        this.actionBtn = 'تحديث';
        this.getPyItem = this.editData;
        this.PyItem.controls['name'].setValue(this.editData.name);
        this.PyItem.controls['manner'].setValue(this.editData.manner);
        this.PyItem.controls['type'].setValue(this.editData.type);
        this.PyItem.controls['calcType'].setValue(this.editData.calcType);
        this.PyItem.controls['party'].setValue(this.editData.party);
        this.PyItem.controls['resetType'].setValue(this.editData.resetType);
        this.PyItem.controls['equation'].setValue(this.editData.equation);
        this.PyItem.controls['round'].setValue(this.editData.round);
        this.PyItem.controls['code'].setValue(this.editData.code);
        this.PyItem.controls['value'].setValue(this.editData.value);
        this.PyItem.controls['minValue'].setValue(this.editData.minValue);
        this.PyItem.controls['maxValue'].setValue(this.editData.maxValue);
        this.PyItem.controls['resetValue'].setValue(this.editData.resetValue);
        this.PyItem.controls['visibility'].setValue(this.editData.visibility);
        this.PyItem.controls['categoryId'].setValue(this.editData.categoryId);
        this.PyItem.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        this.PyItem.addControl('id', new FormControl('', Validators.required));
        this.PyItem.controls['id'].setValue(this.editData.id);
      }
    }

    displayCategoryName(category: any): string {
      return category && category.name ? category.name : '';
    }
  
    categorySelected(event: MatAutocompleteSelectedEvent): void {
      const category = event.option.value as Category;
      this.selectedCategory = category;
      this.PyItem.patchValue({ categoryId: category.id });
      this.PyItem.patchValue({ categoryName: category.name });
    }
  
    private _filterCategories(value: string): Category[] {
      const filterValue = value.toLowerCase();
      return this.categories.filter(
        (category) => category.name.toLowerCase().includes(filterValue)
        );
    }
  
    openAutoCategory() {
      this.categoryCtrl.setValue('');
      this.categoryCtrl.updateValueAndValidity();
    }
  
    

    getExistingNames() {
      this.api.getPyItem().subscribe({
        next: (res) => {
          this.existingNames = res.map((product: any) => product.name);
        },
        error: (err) => {
          console.log('Error fetching existing names:', err);
        },
      });
    }

  AddItem(){
    if(!this.editData){
      
      this.PyItem.removeControl('id')
      console.log("add: ", this.PyItem.value);
      this.PyItem.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.PyItem.valid){
        this.api.postPyItem(this.PyItem.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.PyItem.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert(err) 
          }
        })
      }
    }else{
      this.updateItem()
    }
  }


  updateItem(){
        this.api.putPyInstallment(this.PyItem.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.PyItem.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }
      toastrSuccess(): void {
        this.toastr.success('تم الحفظ بنجاح');
      }
      
      toastrEditSuccess(): void {
        this.toastr.success('تم التعديل بنجاح');
      }
}

