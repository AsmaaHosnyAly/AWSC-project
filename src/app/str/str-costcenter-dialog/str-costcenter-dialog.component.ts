

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { publishFacade } from '@angular/compiler';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export class Category {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-str-costcenter-dialog',
  templateUrl: './str-costcenter-dialog.component.html',
  styleUrls: ['./str-costcenter-dialog.component.css']
})
export class StrCostcenterDialogComponent  implements OnInit {
  centerCategoryCtrl: FormControl;
  filteredCategories: Observable<Category[]>;
  categories: Category[] = [];
  getCostCenterData: any;
  selectedCategory: Category | undefined;
  costcenterForm !: FormGroup;
  actionBtn: string = "حفظ"
  autoCode:any;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrCostcenterDialogComponent>) { 
      this.centerCategoryCtrl = new FormControl();
    this.filteredCategories = this.centerCategoryCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCategories(value))
    );
    }

  ngOnInit(): void {
    this.getCostCenterAutoCode();
    this.costcenterForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      costCenterCategoryId: ['', Validators.required],
      transactionUserId: [1],

      
    });

    this.api.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });

    if (this.editData) {
      this.actionBtn = "تحديث";
      this.getCostCenterData = this.editData;
      this.costcenterForm.controls['code'].setValue(this.editData.code);
      this.costcenterForm.controls['name'].setValue(this.editData.name);
      this.costcenterForm.controls['costCenterCategoryId'].setValue(this.editData.costCenterCategoryId);    
      this.costcenterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
      this.costcenterForm.addControl('id', new FormControl('', Validators.required));
      this.costcenterForm.controls['id'].setValue(this.editData.id);
    }
  }

  displayCenterCategory(category: any): string {
    return category && category.name ? category.name : '';
  }

  centerCategorySelected(event: MatAutocompleteSelectedEvent): void {
    const category = event.option.value as Category;
    this.selectedCategory = category;
    this.costcenterForm.patchValue({ costCenterCategoryId: category.id });
    this.costcenterForm.patchValue({ costCenterCategoryName: category.name });
  }

  private _filterCategories(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(
      (category) =>
      category.name.toLowerCase().includes(filterValue)
    );
  }

  openCenterCategory() {
    this.centerCategoryCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.centerCategoryCtrl.updateValueAndValidity();
  }

  addCostCenter() {
    if (!this.editData) {
      if (this.costcenterForm.getRawValue().code) {
        this.costcenterForm.controls['code'].setValue(this.autoCode);
      }
      else{
        this.costcenterForm.controls['code'].setValue(this.autoCode);
      }
      this.costcenterForm.removeControl('id')

      if (this.costcenterForm.valid) {
        this.api.postCostCenter(this.costcenterForm.value)
          .subscribe({
            next: (res) => {
              alert("تم اضافة المركز");
              this.costcenterForm.reset();
              this.dialogRef.close('حفظ');
            },
            error: (err) => {
             alert("!خطأ في العملية")
              
            }
          })
      }
    }else{
      this.updateCostCenter()
    }
  }

  updateCostCenter(){
    this.api.putCostCenter(this.costcenterForm.value)
    .subscribe({
      next:(res)=>{
        alert("تم التحديث بنجاح");
        this.costcenterForm.reset();
        this.dialogRef.close('تحديث');
      },
      error:()=>{
        alert("خطأ في التحديث");
      }
    })
  }

  getCostCenterAutoCode() {
    this.api.getCostCenterAutoCode()
      .subscribe({
        next: (res) => {
          this.autoCode = res;
          return res;
        },
        error: (err) => {
          // console.log("fetch fiscalYears data err: ", err);
          // alert("خطا اثناء جلب العناصر !");
        }
      })
  }

}