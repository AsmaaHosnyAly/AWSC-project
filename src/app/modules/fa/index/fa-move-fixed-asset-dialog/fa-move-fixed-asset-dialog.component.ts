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
  selector: 'app-fa-move-fixed-asset-dialog',
  templateUrl: './fa-move-fixed-asset-dialog.component.html',
  styleUrls: ['./fa-move-fixed-asset-dialog.component.css']
})
export class FaMoveFixedAssetDialogComponent implements OnInit {

  transactionUserId = localStorage.getItem('transactionUserId');

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

  // formcontrol = new FormControl('');
  MovefixedAssetForm!: FormGroup;

  // formcontrol = new FormControl('');
  // MovefixedAssetForm !: FormGroup;
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
  documentDateCurrent: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<FaMoveFixedAssetDialogComponent>,
    private toastr: ToastrService) {

    this.stateDefaultValue = "جديد";
    this.documentDateCurrent = new Date();

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
    this.getCcActivity();
    this.getFaFixedAsset();
    this.getCcCostCenter();

    this.MovefixedAssetForm = this.formBuilder.group({
      move_Type: ['', Validators.required],
      move_No: ['', Validators.required],
      description: [''],
      statement: ['', Validators.required],
      document_NO: ['', Validators.required],
      document_Date: [this.documentDateCurrent, Validators.required],
      rate: ['', Validators.required],
      costCenterId: ['', Validators.required],
      fixedAssetId: ['', Validators.required],
      activityId: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addFaMoveFixedAset();
      return false; // Prevent the default browser behavior
    }));

    if (this.editData) {
      console.log("editData: ", this.editData);

      this.actionBtn = "تعديل";

      this.MovefixedAssetForm.controls['transactionUserId'].setValue(this.transactionUserId);
      this.MovefixedAssetForm.controls['move_Type'].setValue(this.editData.move_Type);
      this.MovefixedAssetForm.controls['move_No'].setValue(this.editData.move_No);
      this.MovefixedAssetForm.controls['description'].setValue(this.editData.description);
      this.MovefixedAssetForm.controls['statement'].setValue(this.editData.statement);
      this.MovefixedAssetForm.controls['document_NO'].setValue(this.editData.document_NO);
      this.MovefixedAssetForm.controls['document_Date'].setValue(this.editData.document_Date);
      this.MovefixedAssetForm.controls['rate'].setValue(this.editData.rate);

      this.MovefixedAssetForm.controls['costCenterId'].setValue(this.editData.costCenterId);
      this.MovefixedAssetForm.controls['fixedAssetId'].setValue(this.editData.fixedAssetId);
      this.MovefixedAssetForm.controls['activityId'].setValue(this.editData.activityId);


      this.MovefixedAssetForm.addControl('id', new FormControl('', Validators.required));
      this.MovefixedAssetForm.controls['id'].setValue(this.editData.id);

    }

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
    this.MovefixedAssetForm.patchValue({ fixedAssetId: fixedAsset.id });
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
    this.MovefixedAssetForm.patchValue({ activityId: activity.id });
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
    this.MovefixedAssetForm.patchValue({ costCenterId: costCenter.id });
  }
  openAutoCostCenter() {
    this.costCenterCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.costCenterCtrl.updateValueAndValidity();
  }


  addFaMoveFixedAset() {
    if (!this.editData) {
      this.MovefixedAssetForm.removeControl('id');
      this.MovefixedAssetForm.controls['transactionUserId'].setValue(this.transactionUserId);

      console.log("post form values: ", this.MovefixedAssetForm.value);

      if (this.MovefixedAssetForm.valid) {
        this.api.postFaMoveFixedAsset(this.MovefixedAssetForm.value)
          .subscribe({
            next: (res) => {
              this.toastrSuccess();
              this.MovefixedAssetForm.reset();
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
      this.updateFaMoveFixedAsset()
    }
  }


  updateFaMoveFixedAsset() {
    console.log("update form values: ", this.MovefixedAssetForm.value);

    this.api.putFaMoveFixedAsset(this.MovefixedAssetForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEdit();
          this.MovefixedAssetForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          this.toastrErrorEdit();
        }
      })
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
        // console.log("costCenterList res: ", res);
        this.costCenterList = res;
      },
      error: (err) => {
        alert('Error');
        console.log("costCenterList fetch err: ", err);
      },
    });
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
