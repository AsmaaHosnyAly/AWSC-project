import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';

import { ApiService } from '../../services/api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { FaFixedAssetDialogComponent } from '../fa-fixed-asset-dialog/fa-fixed-asset-dialog.component';
import { formatDate } from '@angular/common';

interface FaFixedAsset {
  code: string;
  name: string;
  categoryFirstName: string;
  categorySecondName: string;
  categoryThirdName: string;
  costCenterName: string;
  fiEntryDescription: string;
  initialValue: string;
  bookValue: string;
  speculateValue: string;
  depreciationRate: string;
  place: string;
  state: string;
  buyDate: string;
  workDate: string;
  speculateDate: string;
  Action: string;
}

export class CategoryFirst {
  constructor(public id: number, public name: string) { }
}
export class CategorySecond {
  constructor(public id: number, public name: string) { }
}
export class CategoryThird {
  constructor(public id: number, public name: string) { }
}
export class CostCenter {
  constructor(public id: number, public name: string) { }
}
export class Entry {
  constructor(public id: number, public description: string) { }
}

@Component({
  selector: 'app-fa-fixed-asset',
  templateUrl: './fa-fixed-asset.component.html',
  styleUrls: ['./fa-fixed-asset.component.css']
})
export class FaFixedAssetComponent implements OnInit {
  ELEMENT_DATA: FaFixedAsset[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageIndex: any;
  length: any;
  serachFlag: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];

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

  formcontrol = new FormControl('');
  fixedAssetSearchForm!: FormGroup;
  title = 'Angular13Crud';

  displayedColumns: string[] = [
    'code', 'name', 'categoryFirstName', 'categorySecondName', 'categoryThirdName',
    'costCenterName', 'fiEntryDescription', 'initialValue', 'bookValue', 'speculateValue',
    'depreciationRate', 'place', 'state', 'buyDate', 'workDate', 'speculateDate', 'action'];

  // dataSource!: MatTableDataSource<any>;
  dataSource: MatTableDataSource<FaFixedAsset> = new MatTableDataSource();


  loading: boolean = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private dialog: MatDialog,
    private toastr: ToastrService,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private localeBuyDate: string,
    @Inject(LOCALE_ID) private localeWorkDate: string,
    @Inject(LOCALE_ID) private localeSpeculateDate: string,) {

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
    this.getFaFixedAsset();

    this.getFaCategoryFirst();
    this.getFaCategorySecond();
    this.getFaCategoryThird();
    this.getCcCostCenter();
    this.getFiEntry();

    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));

    this.fixedAssetSearchForm = this.formBuilder.group({
      name: [''],
      place: [''],
      categoryFirstId: [''],
      categorySecondId: [''],
      categoryThirdId: [''],
      code: [''],
      costCenterId: [''],
      entryId: [''],
      buyDate: [''],
      workDate: [''],
      speculateDate: ['']
    });

  }
  openDialog() {
    this.dialog
      .open(FaFixedAssetDialogComponent, {
        width: '70%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getFaFixedAsset();
        }
      });
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
    this.fixedAssetSearchForm.patchValue({ categoryFirstId: categoryFirst.id });
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
    this.selectedCategoryFirst = categorySecond;
    this.fixedAssetSearchForm.patchValue({ categorySecondId: categorySecond.id });
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
    this.fixedAssetSearchForm.patchValue({ categoryThirdId: categoryThird.id });
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
    this.fixedAssetSearchForm.patchValue({ costCenterId: costCenter.id });
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
    this.fixedAssetSearchForm.patchValue({ entryId: entry.id });
  }
  openAutoEntry() {
    this.entryCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.entryCtrl.updateValueAndValidity();
  }


  getFaFixedAsset() {
    if (!this.currentPage && this.serachFlag == false) {
      this.currentPage = 0;

      this.isLoading = true;

      fetch(this.api.getFaFixedAssetPaginate(this.currentPage, this.pageSize))
        .then(response => response.json())
        .then(data => {
          this.totalRows = data.length;
          console.log("master data paginate first Time: ", data);
          this.dataSource.data = data.items;
          this.pageIndex = data.page;
          this.pageSize = data.pageSize;
          this.length = data.totalItems;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = this.length;
          });
          this.isLoading = false;
        }, error => {
          console.log(error);
          this.isLoading = false;
        });
    }
    else {
      if (this.serachFlag == false) {
        this.isLoading = true;

        fetch(this.api.getFaFixedAssetPaginate(this.currentPage, this.pageSize))
          .then(response => response.json())
          .then(data => {
            this.totalRows = data.length;
            console.log("master data paginate: ", data);
            this.dataSource.data = data.items;
            this.pageIndex = data.page;
            this.pageSize = data.pageSize;
            this.length = data.totalItems;
            setTimeout(() => {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = this.length;
            });
            this.isLoading = false;
          }, error => {
            console.log(error);
            this.isLoading = false;
          });
      }
      else {
        console.log("search next paginate");
        this.getFaFixedAsset();
      }

    }

  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getFaFixedAsset();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editFaFixedAsset(row: any) {
    this.dialog
      .open(FaFixedAssetDialogComponent, {
        width: '70%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getFaFixedAsset();
        }
      });
  }

  deleteFaFixedAsset(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteFaFixedAsset(id).subscribe({
        next: (res) => {
          if (res == 'Succeeded') {
            console.log("res of deletestore:", res);
            this.toastrDeleteSuccess();
            this.getFaFixedAsset();

          } else {
            alert(" لا يمكن الحذف لارتباطها بجداول اخري!")
          }
        },
        error: () => {
          alert('خطأ فى حذف العنصر');
        },
      });
    }
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
        console.log("costCenterList res: ", res);
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
        console.log("entryList res: ", res);
        this.entryList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("entryList fetch err: ", err);
      },
    });
  }

  getSearch() {
    let Name = this.fixedAssetSearchForm.getRawValue().name;
    let Place = this.fixedAssetSearchForm.getRawValue().place;
    let CategoryFirstId = this.fixedAssetSearchForm.getRawValue().categoryFirstId;
    let CategorySecondId = this.fixedAssetSearchForm.getRawValue().categorySecondId;
    let CategoryThirdId = this.fixedAssetSearchForm.getRawValue().categoryThirdId;
    let Code = this.fixedAssetSearchForm.getRawValue().code;
    let CostCenterId = this.fixedAssetSearchForm.getRawValue().costCenterId;
    let EntryId = this.fixedAssetSearchForm.getRawValue().entryId;
    let BuyDate, WorkDate, SpeculateDate;

    if (this.fixedAssetSearchForm.getRawValue().buyDate) {
      BuyDate = formatDate(this.fixedAssetSearchForm.getRawValue().buyDate, 'MM/dd/yyyy', this.localeBuyDate);
    }
    if (this.fixedAssetSearchForm.getRawValue().workDate) {
      WorkDate = formatDate(this.fixedAssetSearchForm.getRawValue().workDate, 'MM/dd/yyyy', this.localeWorkDate);
    }
    if (this.fixedAssetSearchForm.getRawValue().speculateDate) {
      SpeculateDate = formatDate(this.fixedAssetSearchForm.getRawValue().speculateDate, 'MM/dd/yyyy', this.localeSpeculateDate);
    }

    this.loading = true;
    console.log('name: ', Name, "place: ", Place, "code: ", Code, "buyDate: ", BuyDate, "workDate: ", WorkDate, "SpeculateDate: ", SpeculateDate);

    this.api
      .getFaFixedAssetSearach(Name, Place, CategoryFirstId, CategorySecondId, CategoryThirdId, Code, CostCenterId, EntryId, BuyDate, WorkDate, SpeculateDate)
      .subscribe({
        next: (res) => {
          this.loading = false;
          console.log('search faFixedAsset res: ', res);

          // this.dataSource = res;
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;

          this.totalRows = res.length;
          if (this.serachFlag == false) {
            this.pageIndex = 0;
            this.pageSize = 5;
            this.length = this.totalRows;
            this.serachFlag = true;
          }
          console.log('master data paginate first Time: ', res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        },
        error: (err) => {
          this.loading = false;
          // alert('Error');
        },
      });
  }

  resetForm() {
    this.fixedAssetSearchForm.reset();

    this.entryCtrl.reset();
    this.costCenterCtrl.reset();
    this.categoryFirstCtrl.reset();
    this.categorySecondCtrl.reset();
    this.categoryThirdCtrl.reset();
    
    this.serachFlag = false;

    this.getFaFixedAsset();
  }

  resetMaster() {
    this.fixedAssetSearchForm.reset();

    this.categoryFirstCtrl.reset();
    this.categorySecondCtrl.reset();
    this.categoryThirdCtrl.reset();
    this.costCenterCtrl.reset();
    this.entryCtrl.reset();

    this.api.getFaFixedAsset().subscribe({
      next: (res) => {
        this.dataSource = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      // error: (err) => {
      //   alert('Error');
      //   console.log("entryList fetch err: ", err);
      // },
    });


  }

  toastrDeleteSuccess(): void {
    this.toastr.success('تم الحذف بنجاح');
  }
}
