import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

export class CategoryFirst {
  constructor(public id: number, public name: string, public code: any) { }
}
export class CategorySecond {
  constructor(public id: number, public name: string, public code: any) { }
}
export class CategoryThird {
  constructor(public id: number, public name: string, public code: any) { }
}
export class CostCenter {
  constructor(public id: number, public name: string) { }
}
export class Entry {
  constructor(public id: number, public description: string) { }
}

@Component({
  selector: 'app-fa-fixed-asset-dialog',
  templateUrl: './fa-fixed-asset-dialog.component.html',
  styleUrls: ['./fa-fixed-asset-dialog.component.css']
})
export class FaFixedAssetDialogComponent implements OnInit {

  transactionUserId = localStorage.getItem('transactionUserId')
  categoryFirstCtrl: FormControl;
  filteredCategoryFirst: Observable<CategoryFirst[]>;
  categoryFirstList: CategoryFirst[] = [];
  selectedCategoryFirst!: CategoryFirst;

  categorySecondCtrl: FormControl;
  filteredCategorySecond: Observable<CategorySecond[]>;
  categorySecondList: CategorySecond[] = [];
  selectedCategorySecond!: CategorySecond;

  categoryThirdCtrl: FormControl;
  filteredCategoryThird: Observable<CategoryThird[]>;
  categoryThirdList: CategoryThird[] = [];
  selectedCategoryThird!: CategoryThird;

  costCenterCtrl: FormControl;
  filteredCostCenter: Observable<CostCenter[]>;
  costCenterList: CostCenter[] = [];
  selectedCostCenter!: CostCenter;

  entryCtrl: FormControl;
  filteredEntry: Observable<Entry[]>;
  entryList: Entry[] = [];
  selectedEntry!: Entry;

  // formcontrol = new FormControl('');
  fixedAssetForm!: FormGroup;

  // formcontrol = new FormControl('');
  // fixedAssetForm !: FormGroup;
  actionBtn: string = "حفظ"
  selectedOption: any;
  getModelData: any;
  Id: string | undefined | null;
  subRegionDt: any = {
    id: 0,
  }
  commname: any;
  dataSource!: MatTableDataSource<any>;
  existingNames: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  vendorlist: any;
  storeList: any;
  vendorName: any;
  autoCode: any;
  stateDefaultValue: any;
  autoCodeCategoryFirst: any;
  autoCodeCategorySecond: any;
  autoCodeCategoryThird: any;
  selectedCategorySecondCode: any;
  selectedCategoryThirdCode: any;
  selectedCategoryFirstCode: any;
  buyDateCurrent: any;
  workDateCurrent: any;
  speculateDateCurrent: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<FaFixedAssetDialogComponent>,
    private toastr: ToastrService) {

    this.stateDefaultValue = "جديد";
    this.buyDateCurrent = new Date();
    this.workDateCurrent = new Date();
    this.speculateDateCurrent = new Date();


    this.categoryFirstCtrl = new FormControl();
    this.filteredCategoryFirst = this.categoryFirstCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCategoryFirst(value))
    );

    this.categorySecondCtrl = new FormControl();
    this.filteredCategorySecond = this.categorySecondCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCategorySecond(value))
    );

    this.categoryThirdCtrl = new FormControl();
    this.filteredCategoryThird = this.categoryThirdCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCategoryThird(value))
    );

    this.costCenterCtrl = new FormControl();
    this.filteredCostCenter = this.costCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCostCenter(value))
    );

    this.entryCtrl = new FormControl();
    this.filteredEntry = this.entryCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEntry(value))
    );

  }
  ngOnInit(): void {
    this.getFaCategoryFirst();
    this.getFaCategorySecond();
    this.getFaCategoryThird();
    this.getCcCostCenter();
    this.getFiEntry();

    this.fixedAssetForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      place: ['', Validators.required],
      categoryFirstId: ['', Validators.required],
      categorySecondId: ['', Validators.required],
      categoryThirdId: ['', Validators.required],
      no: ['', Validators.required],
      code: ['', Validators.required],
      costCenterId: [''],
      entryId: ['', Validators.required],
      state: [this.stateDefaultValue, Validators.required],
      buyDate: [this.buyDateCurrent, Validators.required],
      workDate: [this.workDateCurrent, Validators.required],
      speculateDate: [this.speculateDateCurrent, Validators.required],
      initialValue: ['', Validators.required],
      bookValue: ['', Validators.required],
      speculateValue: ['', Validators.required],
      depreciationRate: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addFaFixedAset();
      return false; // Prevent the default browser behavior
    }));

    if (this.editData) {
      console.log("editData: ", this.editData);

      this.actionBtn = "تعديل";

      this.fixedAssetForm.controls['transactionUserId'].setValue(this.transactionUserId);
      this.fixedAssetForm.controls['name'].setValue(this.editData.name);
      this.fixedAssetForm.controls['description'].setValue(this.editData.description);
      this.fixedAssetForm.controls['place'].setValue(this.editData.place);

      this.fixedAssetForm.controls['categoryFirstId'].setValue(this.editData.categoryFirstId);
      this.fixedAssetForm.controls['categorySecondId'].setValue(this.editData.categorySecondId);
      this.fixedAssetForm.controls['categoryThirdId'].setValue(this.editData.categoryThirdId);

      this.fixedAssetForm.controls['no'].setValue(this.editData.no);
      this.fixedAssetForm.controls['code'].setValue(this.editData.code);
      this.fixedAssetForm.controls['costCenterId'].setValue(this.editData.costCenterId);
      this.fixedAssetForm.controls['entryId'].setValue(this.editData.entryId);
      this.fixedAssetForm.controls['state'].setValue(this.editData.state);
      this.fixedAssetForm.controls['buyDate'].setValue(this.editData.buyDate);
      this.fixedAssetForm.controls['workDate'].setValue(this.editData.workDate);
      this.fixedAssetForm.controls['speculateDate'].setValue(this.editData.speculateDate);
      this.fixedAssetForm.controls['initialValue'].setValue(this.editData.initialValue);
      this.fixedAssetForm.controls['bookValue'].setValue(this.editData.bookValue);
      this.fixedAssetForm.controls['speculateValue'].setValue(this.editData.speculateValue);
      this.fixedAssetForm.controls['depreciationRate'].setValue(this.editData.depreciationRate);

      this.fixedAssetForm.addControl('id', new FormControl('', Validators.required));
      this.fixedAssetForm.controls['id'].setValue(this.editData.id);

      this.getFaCategoryIdsEditDataCase(this.editData.categoryFirstCode, this.editData.categorySecondCode, this.editData.categoryThirdCode, this.editData.no);
    }
    // else{
    //   this.getFaFixedAssetAutoCode();
    // }
  }


  private _filterCategoryFirst(value: string): CategoryFirst[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.categoryFirstList.filter(
      (categoryFirst) =>
        categoryFirst.name ? categoryFirst.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayCategoryFirstName(categoryFirst: any): string {
    return categoryFirst ? categoryFirst.name && categoryFirst.name != null ? categoryFirst.name : '-' : '';
  }
  CategoryFirstSelected(event: MatAutocompleteSelectedEvent): void {
    const categoryFirst = event.option.value as CategoryFirst;
    console.log("categoryFirst selected: ", categoryFirst);
    this.selectedCategoryFirst = categoryFirst;
    this.selectedCategoryFirstCode = categoryFirst.code;
    this.fixedAssetForm.patchValue({ categoryFirstId: categoryFirst.id });
    this.getFaCategoryFirstById(this.fixedAssetForm.getRawValue().categoryFirstId, categoryFirst.code);

  }
  openAutoCategoryFirst() {
    this.categoryFirstCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.categoryFirstCtrl.updateValueAndValidity();
  }


  private _filterCategorySecond(value: string): CategorySecond[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.categorySecondList.filter(
      (categorySecond) =>
        categorySecond.name ? categorySecond.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayCategorySecondName(categorySecond: any): string {
    return categorySecond ? categorySecond.name && categorySecond.name != null ? categorySecond.name : '-' : '';
  }
  CategorySecondSelected(event: MatAutocompleteSelectedEvent): void {
    const categorySecond = event.option.value as CategorySecond;
    console.log("categorySecond selected: ", categorySecond);
    this.selectedCategorySecond = categorySecond;
    this.fixedAssetForm.patchValue({ categorySecondId: categorySecond.id });
    this.selectedCategorySecondCode = categorySecond.code;
    this.getFaCategorySecondById(this.fixedAssetForm.getRawValue().categorySecondId, categorySecond.code);
  }
  openAutoCategorySecond() {
    this.categorySecondCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.categorySecondCtrl.updateValueAndValidity();
  }


  private _filterCategoryThird(value: string): CategoryThird[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.categoryThirdList.filter(
      (categoryThird) =>
        categoryThird.name ? categoryThird.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayCategoryThirdName(categoryThird: any): string {
    return categoryThird ? categoryThird.name && categoryThird.name != null ? categoryThird.name : '-' : '';
  }
  CategoryThirdSelected(event: MatAutocompleteSelectedEvent): void {
    const categoryThird = event.option.value as CategoryThird;
    console.log("categoryThird selected: ", categoryThird);
    this.selectedCategoryThird = categoryThird;
    this.selectedCategoryThirdCode = categoryThird.code;
    this.fixedAssetForm.patchValue({ categoryThirdId: categoryThird.id });
    this.getFaCategoryThirdById(this.fixedAssetForm.getRawValue().categoryThirdId, categoryThird.code);
  }
  openAutoCategoryThird() {
    this.categoryThirdCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.categoryThirdCtrl.updateValueAndValidity();
  }


  private _filterCostCenter(value: string): CostCenter[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.costCenterList.filter(
      (costCenter) =>
        costCenter.name ? costCenter.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayCostCenterName(costCenter: any): string {
    return costCenter ? costCenter.name && costCenter.name != null ? costCenter.name : '-' : '';
  }
  CostCenterSelected(event: MatAutocompleteSelectedEvent): void {
    const costCenter = event.option.value as CostCenter;
    console.log("costCenter selected: ", costCenter);
    this.selectedCostCenter = costCenter;
    this.fixedAssetForm.patchValue({ costCenterId: costCenter.id });
  }
  openAutoCostCenter() {
    this.costCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costCenterCtrl.updateValueAndValidity();
  }


  private _filterEntry(value: string): Entry[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.entryList.filter(
      (entry) =>
        entry.description ? entry.description.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayEntryName(entry: any): string {
    return entry ? entry.description && entry.description != null ? entry.description : '-' : '';
  }
  EntrySelected(event: MatAutocompleteSelectedEvent): void {
    const entry = event.option.value as Entry;
    console.log("entry selected: ", entry);
    this.selectedEntry = entry;
    this.fixedAssetForm.patchValue({ entryId: entry.id });
  }
  openAutoEntry() {
    this.entryCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.entryCtrl.updateValueAndValidity();
  }


  addFaFixedAset() {
    if (!this.editData) {
      this.fixedAssetForm.removeControl('id');
      this.fixedAssetForm.controls['no'].setValue(this.fixedAssetForm.getRawValue().no.toString());
      this.fixedAssetForm.controls['transactionUserId'].setValue(this.transactionUserId);

      if (!this.fixedAssetForm.getRawValue().costCenterId) {
        this.fixedAssetForm.controls['costCenterId'].setValue(null);
      }
      console.log("post form values: ", this.fixedAssetForm.value);

      if (this.fixedAssetForm.valid) {
        this.api.postFaFixedAsset(this.fixedAssetForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.fixedAssetForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              this.toastrErrorSave();
            }
          })
      }
      else {
        this.toastrWarningInputValid();
      }
    } else {
      this.updateFaFixedAsset()
    }
  }


  updateFaFixedAsset() {
    this.fixedAssetForm.controls['no'].setValue(this.fixedAssetForm.getRawValue().no.toString());
    console.log("update form values: ", this.fixedAssetForm.value);

    this.api.putFaFixedAsset(this.fixedAssetForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEdit();
          this.fixedAssetForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          this.toastrErrorEdit();
        }
      })
  }

  getFaCategoryFirst() {
    this.api.getFaCategoryFirst().subscribe({
      next: (res) => {
        this.categoryFirstList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("categoryFirstList fetch err: ", err);
      },
    });
  }

  getFaCategorySecond() {
    this.api.getFaCategorySecond().subscribe({
      next: (res) => {
        this.categorySecondList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("categorySecondList fetch err: ", err);
      },
    });
  }

  getFaCategoryThird() {
    this.api.getFaCategoryThird().subscribe({
      next: (res) => {
        this.categoryThirdList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("categoryThirdList fetch err: ", err);
      },
    });
  }

  getCcCostCenter() {
    this.api.getCcCostCenter().subscribe({
      next: (res) => {
        // console.log("costCenterList res: ", res);
        this.costCenterList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("costCenterList fetch err: ", err);
      },
    });
  }

  getFiEntry() {
    this.api.getFiEntry().subscribe({
      next: (res) => {
        // console.log("entryList res: ", res);
        this.entryList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("entryList fetch err: ", err);
      },
    });
  }

  getFaFixedAssetAutoCode() {
    if (this.autoCodeCategoryFirst && this.autoCodeCategorySecond && this.autoCodeCategoryThird) {

      if (this.editData) {
        if (this.autoCodeCategoryFirst == this.editData.categoryFirstCode
          && this.autoCodeCategorySecond == this.editData.categorySecondCode
          && this.autoCodeCategoryThird == this.editData.categoryThirdCode) {
          this.toastrWarningInput();
          this.fixedAssetForm.controls['categoryFirstId'].reset();
          this.categoryFirstCtrl.reset();
          this.fixedAssetForm.controls['categorySecondId'].reset();
          this.categorySecondCtrl.reset();
          this.fixedAssetForm.controls['categoryThirdId'].reset();
          this.categoryThirdCtrl.reset();
          this.fixedAssetForm.controls['no'].setValue('');
          this.fixedAssetForm.controls['code'].setValue('');
        }
        else {
          this.api.getFaFixedAssetAutoCode(this.fixedAssetForm.getRawValue().categoryFirstId, this.fixedAssetForm.getRawValue().categorySecondId, this.fixedAssetForm.getRawValue().categoryThirdId).subscribe({
            next: (res) => {
              console.log("autoCode res: ", res);
              this.autoCode = res;
              this.fixedAssetForm.controls['no'].setValue(this.autoCode);
              this.concatFullCode(this.autoCode);

            },
            error: (err) => {
              // alert('Error');
              console.log("autoCode fetch err: ", err);
            },
          });
        }
      }
      else {
        this.api.getFaFixedAssetAutoCode(this.fixedAssetForm.getRawValue().categoryFirstId, this.fixedAssetForm.getRawValue().categorySecondId, this.fixedAssetForm.getRawValue().categoryThirdId).subscribe({
          next: (res) => {
            console.log("autoCode res: ", res);
            this.autoCode = res;
            this.fixedAssetForm.controls['no'].setValue(this.autoCode);
            this.concatFullCode(this.autoCode);

          },
          error: (err) => {
            // alert('Error');
            console.log("autoCode fetch err: ", err);
          },
        });
      }


    }
    else if (this.editData) {
      this.concatFullCode(this.editData.no);

    }

  }

  getFaCategoryFirstById(id: any, code: any) {
    console.log("autoCode category1 selected: ", code);
    this.autoCodeCategoryFirst = code;

    // if (this.editData) {
    this.getFaFixedAssetAutoCode();
    // }
    // else {
    //   alert("Post for first time: ");

    //   this.getFaFixedAssetAutoCode();
    // }
  }

  getFaCategoryIdsEditDataCase(categoryFirstCode: any, categorySecondCode: any, categoryThirdCode: any, no: any) {

    // alert("fullCode generated in EditDataCase: " + categoryFirstCode + categorySecondCode + categoryThirdCode + no);
    this.fixedAssetForm.controls['code'].setValue(categoryFirstCode + categorySecondCode + categoryThirdCode + no);

  }

  getFaCategorySecondById(id: any, code: any) {
    console.log("autoCode category2 selected: ", code);
    this.autoCodeCategorySecond = code;
    // if (this.editData) {

    this.getFaFixedAssetAutoCode();
    // }
    // else {
    //   alert("Post for first time: ");

    //   this.getFaFixedAssetAutoCode();
    // }
  }

  getFaCategoryThirdById(id: any, code: any) {
    console.log("autoCode category3 selected: ", code);
    this.autoCodeCategoryThird = code;

    // if (this.editData) {

    this.getFaFixedAssetAutoCode();

    // }
    // else {
    //   alert("Post for first time: ");

    //   this.getFaFixedAssetAutoCode();
    // }
  }

  concatFullCode(autoCodeGeneraed: any) {

    // alert("autoCode generated in NO: " + autoCodeGeneraed);

    if (!this.autoCodeCategoryFirst) {
      this.autoCodeCategoryFirst = this.editData.categoryFirstCode;
    }
    if (!this.autoCodeCategorySecond) {
      this.autoCodeCategorySecond = this.editData.categorySecondCode;
    }
    if (!this.autoCodeCategoryThird) {
      this.autoCodeCategoryThird = this.editData.categoryThirdCode;
    }

    // alert("FullCode edit Changeddd: " + this.autoCodeCategoryFirst + this.autoCodeCategorySecond + this.autoCodeCategoryThird + autoCodeGeneraed);
    this.fixedAssetForm.controls['code'].setValue(this.autoCodeCategoryFirst + this.autoCodeCategorySecond + this.autoCodeCategoryThird + autoCodeGeneraed);

  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEdit(): void {
    this.toastr.success('تم التحديث بنجاح');
  }

  toastrWarningInput(): void {
    this.toastr.warning('!ادخل بيانات تصنيف مختلفة ');
  }

  toastrWarningInputValid(): void {
    this.toastr.warning('!اكمل ادخال البيانات  ');
  }

  toastrErrorSave(): void {
    this.toastr.error('!خطأ عند حفظ البيانات');
  }

  toastrErrorEdit(): void {
    this.toastr.error('!خطأ عند تحديث البيانات');
  }
}
