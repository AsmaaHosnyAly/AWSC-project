import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { publishFacade } from '@angular/compiler';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
export class Category {
  constructor(public id: number, public name: string) {}
}

import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-str-costcenter-dialog',
  templateUrl: './str-costcenter-dialog.component.html',
  styleUrls: ['./str-costcenter-dialog.component.css'],
})
export class StrCostcenterDialogComponent implements OnInit {
  centerCategoryCtrl: FormControl;
  filteredCategories: Observable<Category[]>;
  categories: Category[] = [];
  getCostCenterData: any;
  selectedCategory: Category | undefined;
  costcenterForm!: FormGroup;
  actionBtn: string = 'حفظ';
  autoCode: any;
  existingNames: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<StrCostcenterDialogComponent>,
    private toastr: ToastrService) {
    this.centerCategoryCtrl = new FormControl();
    this.filteredCategories = this.centerCategoryCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCategories(value))
    );
  }

  ngOnInit(): void {
    this.getExistingNames(); // Fetch existing names
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

    this.hotkeysService.add(
      new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addCostCenter();
        return false; // Prevent the default browser behavior
      })
    );
    if (this.editData) {
      this.actionBtn = 'تحديث';
      this.getCostCenterData = this.editData;
      this.costcenterForm.controls['code'].setValue(this.editData.code);
      this.costcenterForm.controls['name'].setValue(this.editData.name);
      this.costcenterForm.controls['costCenterCategoryId'].setValue(
        this.editData.costCenterCategoryId
      );
      this.costcenterForm.controls['transactionUserId'].setValue(
        this.editData.transactionUserId
      );
      this.costcenterForm.addControl(
        'id',
        new FormControl('', Validators.required)
      );
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
    return this.categories.filter((category) =>
      category.name.toLowerCase().includes(filterValue)
    );
  }

  openCenterCategory() {
    this.centerCategoryCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.centerCategoryCtrl.updateValueAndValidity();
  }

  getExistingNames() {
    this.api.getCostCenter().subscribe({
      next: (res) => {
        this.existingNames = res.map((item: any) => item.name);
      },
      error: (err) => {
        console.log('Error fetching existing names:', err);
      },
    });
  }


  addCostCenter() {
    if (!this.editData) {
      const enteredName = this.costcenterForm.get('name')?.value;

      if (this.existingNames.includes(enteredName)) {
        alert('هذا الاسم موجود من قبل، قم بتغييره');
        return;
      }
      if (this.costcenterForm.getRawValue().code) {
        this.costcenterForm.controls['code'].setValue(this.autoCode);
      } else {
        this.costcenterForm.controls['code'].setValue(this.autoCode);
      }
      this.costcenterForm.removeControl('id');
      if (this.costcenterForm.valid) {
        this.api.postCostCenter(this.costcenterForm.value).subscribe({
          next: (res) => {
            this.toastrSuccess();
            this.costcenterForm.reset();
            this.dialogRef.close('حفظ');
          },
          error: (err) => {
            this.toastrErrorSave(); 
          },
        });
      }
    } else {
      this.updateCostCenter();
    }
  }

  updateCostCenter() {
    this.api.putCostCenter(this.costcenterForm.value).subscribe({
      next: (res) => {
        this.toastrEdit();
        this.costcenterForm.reset();
        this.dialogRef.close('تحديث');
      },
      error: () => {
        this.toastrErrorEdit();
      },
    });
  }

  getCostCenterAutoCode() {
    this.api.getCostCenterAutoCode().subscribe({
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
