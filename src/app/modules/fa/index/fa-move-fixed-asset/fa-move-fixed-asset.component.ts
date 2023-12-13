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
import { FaMoveFixedAssetDialogComponent } from '../fa-move-fixed-asset-dialog/fa-move-fixed-asset-dialog.component';

interface FaMoveFixedAsset {
  move_No: any;
  move_Type: any;
  statement: any;
  rate: any;
  costCenterName: any;
  fixedAssetName: any;
  activityName: any;
  document_NO: any;
  document_Date: any;
  Action: any;
}

export class FixedAsset {
  constructor(public id: number, public name: string) { }
}
export class Activity {
  constructor(public id: number, public name: string) { }
}
export class CostCenter {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-fa-move-fixed-asset',
  templateUrl: './fa-move-fixed-asset.component.html',
  styleUrls: ['./fa-move-fixed-asset.component.css']
})
export class FaMoveFixedAssetComponent implements OnInit {
  ELEMENT_DATA: FaMoveFixedAsset[] = [];
  isLoading = false;
  totalRows = 0;
  pageSize = 5;
  currentPage: any;
  pageIndex: any;
  length: any;
  serachFlag: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // costCenterList: any;
  // activityList: any;
  // fixedAssetList: any;

  fixedAssetCtrl: FormControl;
  filteredFixedAsset: Observable<FixedAsset[]>;
  fixedAssetList: FixedAsset[] = [];
  selectedFixedAsset!: FixedAsset;

  activityCtrl: FormControl;
  filteredActivity: Observable<Activity[]>;
  activityList: Activity[] = [];
  selectedActivity!: Activity;

  costCenterCtrl: FormControl;
  filteredCostCenter: Observable<CostCenter[]>;
  costCenterList: CostCenter[] = [];
  selectedCostCenter!: CostCenter;

  formcontrol = new FormControl('');
  fixedMoveAssetSearchForm!: FormGroup;
  title = 'Angular13Crud';

  displayedColumns: string[] = [
    'move_No', 'move_Type', 'statement', 'rate', 'costCenterName',
    'fixedAssetName', 'activityName', 'document_NO', 'document_Date', 'Action'];

  // dataSource!: MatTableDataSource<any>;
  dataSource: MatTableDataSource<FaMoveFixedAsset> = new MatTableDataSource();


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
    @Inject(LOCALE_ID) private localeDate: string,) {

    this.fixedAssetCtrl = new FormControl();
    this.filteredFixedAsset = this.fixedAssetCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterFixedAsset(value))
    );

    this.activityCtrl = new FormControl();
    this.filteredActivity = this.activityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterActivity(value))
    );

    this.costCenterCtrl = new FormControl();
    this.filteredCostCenter = this.costCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCostCenter(value))
    );

  }

  ngOnInit(): void {
    this.getFaMoveFixedAsset();

    // this.getFaCategoryFirst();
    this.getCcActivity();
    this.getFaFixedAsset();
    this.getCcCostCenter();
    // this.getFiEntry();

    this.hotkeysService.add(new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.openDialog();
      return false; // Prevent the default browser behavior
    }));

    this.fixedMoveAssetSearchForm = this.formBuilder.group({
      Move_Type: [''],
      Move_No: [''],
      Description: [''],
      Statement: [''],
      Document_NO: [''],
      Document_Date: [''],
      Rate: [''],
      CostCenterId: [''],
      FixedAssetId: [''],
      ActivityId: ['']
    });

  }
  openDialog() {
    this.dialog
      .open(FaMoveFixedAssetDialogComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getFaMoveFixedAsset();
        }
      });
  }


  private _filterFixedAsset(value: string): FixedAsset[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.fixedAssetList.filter(
      (fixedAsset) =>
        fixedAsset.name ? fixedAsset.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayFixedAssetName(fixedAsset: any): string {
    return fixedAsset ? fixedAsset.name && fixedAsset.name != null ? fixedAsset.name : '-' : '';
  }
  FixedAssetSelected(event: MatAutocompleteSelectedEvent): void {
    const fixedAsset = event.option.value as FixedAsset;
    console.log("fixedAsset selected: ", fixedAsset);
    this.selectedFixedAsset = fixedAsset;
    this.fixedMoveAssetSearchForm.patchValue({ FixedAssetId: fixedAsset.id });
  }
  openAutoFixedAsset() {
    this.fixedAssetCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.fixedAssetCtrl.updateValueAndValidity();
  }


  private _filterActivity(value: string): Activity[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.activityList.filter(
      (activity) =>
        activity.name ? activity.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayActivityName(activity: any): string {
    return activity ? activity.name && activity.name != null ? activity.name : '-' : '';
  }
  ActivitySelected(event: MatAutocompleteSelectedEvent): void {
    const activity = event.option.value as Activity;
    console.log("activity selected: ", activity);
    this.selectedActivity = activity;
    this.fixedMoveAssetSearchForm.patchValue({ ActivityId: activity.id });
  }
  openAutoActivity() {
    this.activityCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.activityCtrl.updateValueAndValidity();
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
    this.fixedMoveAssetSearchForm.patchValue({ CostCenterId: costCenter.id });
  }
  openAutoCostCenter() {
    this.costCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costCenterCtrl.updateValueAndValidity();
  }


  getFaMoveFixedAsset() {
    if (!this.currentPage && this.serachFlag == false) {
      this.currentPage = 0;

      this.isLoading = true;

      fetch(this.api.getFaMoveFixedAssetPaginate(this.currentPage, this.pageSize))
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

        fetch(this.api.getFaMoveFixedAssetPaginate(this.currentPage, this.pageSize))
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
        this.getFaMoveFixedAsset();
      }

    }

  }

  pageChanged(event: PageEvent) {
    console.log("page event: ", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getFaMoveFixedAsset();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editFaMoveFixedAsset(row: any) {
    this.dialog
      .open(FaMoveFixedAssetDialogComponent, {
        width: '50%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getFaMoveFixedAsset();
        }
      });
  }

  deleteFaMoveFixedAsset(id: number) {
    var result = confirm('هل ترغب بتاكيد الحذف ؟ ');
    if (result) {
      this.api.deleteFaMoveFixedAsset(id).subscribe({
        next: (res) => {
          if (res == 'Succeeded') {
            console.log("res of deletestore:", res);
            this.toastrDeleteSuccess();
            this.getFaMoveFixedAsset();

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

  getCcActivity() {
    this.api.getCcActivity().subscribe({
      next: (res) => {
        this.activityList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("activityList fetch err: ", err);
      },
    });
  }

  getFaFixedAsset() {
    this.api.getFaFixedAsset().subscribe({
      next: (res) => {
        this.fixedAssetList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("fixedAssetList fetch err: ", err);
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

  getSearch() {
    let Move_Type = this.fixedMoveAssetSearchForm.getRawValue().Move_Type;
    let Move_No = this.fixedMoveAssetSearchForm.getRawValue().Move_No;
    let Description = this.fixedMoveAssetSearchForm.getRawValue().Description;
    let Statement = this.fixedMoveAssetSearchForm.getRawValue().Statement;
    let Document_NO = this.fixedMoveAssetSearchForm.getRawValue().Document_NO;
    let Document_Date;

    if (this.fixedMoveAssetSearchForm.getRawValue().Document_Date) {
      Document_Date = formatDate(this.fixedMoveAssetSearchForm.getRawValue().Document_Date, 'MM/dd/yyyy', this.localeDate);
    }

    let Rate = this.fixedMoveAssetSearchForm.getRawValue().Rate;
    let CostCenterId = this.fixedMoveAssetSearchForm.getRawValue().CostCenterId;
    let FixedAssetId = this.fixedMoveAssetSearchForm.getRawValue().FixedAssetId;
    let ActivityId = this.fixedMoveAssetSearchForm.getRawValue().ActivityId;


    this.loading = true;
    console.log('Move_Type: ', Move_Type, "Move_No: ", Move_No, "Description: ", Description, "Statement: ", Statement, "Document_NO: ", Document_NO, "Document_Date: ", Document_Date, "Rate: ", Rate, "CostCenterId: ", CostCenterId, "FixedAssetId: ", FixedAssetId, "ActivityId: ", ActivityId);

    this.api
      .getFaMoveFixedAssetSearach(Move_Type, Move_No, Description, Statement, Document_NO, Document_Date, Rate, CostCenterId, FixedAssetId, ActivityId)
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
    this.fixedMoveAssetSearchForm.reset();

    this.costCenterCtrl.reset();
    this.activityCtrl.reset();
    this.fixedAssetCtrl.reset();

    this.serachFlag = false;

    this.getFaMoveFixedAsset();
  }

  resetMaster() {
    this.fixedMoveAssetSearchForm.reset();

    this.costCenterCtrl.reset();
    this.activityCtrl.reset();
    this.fixedAssetCtrl.reset();

    this.api.getFaMoveFixedAsset().subscribe({
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
