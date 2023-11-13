import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { __param } from 'tslib';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export class CityState {
  constructor(public id: number, public name: string) { }
}
export class OperationType {
  constructor(public id: number, public name: string, public code: any) { }
}
export class TenderType {
  constructor(public id: number, public name: string, public code: any) { }
}
export class PlanType {
  constructor(public id: number, public name: string, public code: any) { }
}

@Component({
  selector: 'app-pro-tender-dialog',
  templateUrl: './pro-tender-dialog.component.html',
  styleUrls: ['./pro-tender-dialog.component.css']
})
export class ProTenderDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  autoCode: any;
  proTenderForm !: FormGroup;
  actionBtn: string = "حفظ";

  cityStateCtrl: FormControl;
  filteredCityState: Observable<CityState[]>;
  cityStateList: CityState[] = [];
  selectedCityState!: CityState;

  operationTypeCtrl: FormControl;
  filteredOperationType: Observable<OperationType[]>;
  operationTypeList: OperationType[] = [];
  selectedOperationType!: OperationType;

  tenderTypeCtrl: FormControl;
  filteredTenderType: Observable<TenderType[]>;
  tenderTypeList: TenderType[] = [];
  selectedTenderType!: TenderType;

  planTypeCtrl: FormControl;
  filteredPlanType: Observable<PlanType[]>;
  planTypeList: PlanType[] = [];
  selectedPlanType!: PlanType;

  dateCurrent: any;
  technicalOpeningDateCurrent: any;
  technicalSelectionDateCurrent: any;
  deliveryDateCurrent: any;
  financialOpeningDateCurrent: any;
  financialSelectionDateCurrent: any;
  awardLetterDateCurrent: any;
  workOrderDateCurrent: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<ProTenderDialogComponent>,
    private toastr: ToastrService) {

    this.dateCurrent = new Date();
    this.technicalOpeningDateCurrent = new Date();
    this.technicalSelectionDateCurrent = new Date();
    this.deliveryDateCurrent = new Date();
    this.financialOpeningDateCurrent = new Date();
    this.financialSelectionDateCurrent = new Date();
    this.awardLetterDateCurrent = new Date();
    this.workOrderDateCurrent = new Date();

    this.cityStateCtrl = new FormControl();
    this.filteredCityState = this.cityStateCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCityState(value))
    );

    this.operationTypeCtrl = new FormControl();
    this.filteredOperationType = this.operationTypeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterOperationType(value))
    );

    this.tenderTypeCtrl = new FormControl();
    this.filteredTenderType = this.tenderTypeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTenderType(value))
    );

    this.planTypeCtrl = new FormControl();
    this.filteredPlanType = this.planTypeCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPlanType(value))
    );

  }

  ngOnInit(): void {

    this.getHrCityState();
    this.getProOperationType();
    this.getProTenderType();
    this.getProPlanType();

    this.proTenderForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      date: [this.dateCurrent, Validators.required],
      cityStateId: ['', Validators.required],
      operationTypeId: ['', Validators.required],
      tenderTypeId: ['', Validators.required],
      value: ['', Validators.required],
      planTypeId: ['', Validators.required],
      period: ['', Validators.required],
      torValue: ['', Validators.required],
      tenderBondValue: ['', Validators.required],
      technicalOpeningDate: [this.technicalOpeningDateCurrent, Validators.required],
      technicalSelectionDate: [this.technicalSelectionDateCurrent, Validators.required],
      financialOpeningDate: [this.financialOpeningDateCurrent, Validators.required],
      financialSelectionDate: [this.financialSelectionDateCurrent, Validators.required],
      estimatingValue: ['', Validators.required],
      awardValue: ['', Validators.required],
      awardLetterDate: [this.awardLetterDateCurrent, Validators.required],
      workOrderDate: [this.workOrderDateCurrent, Validators.required],
      deliveryDate: [this.deliveryDateCurrent, Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addProTender();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      console.log("edit data", this.editData);

      this.actionBtn = "تعديل";
      this.proTenderForm.controls['code'].setValue(this.editData.code);
      this.proTenderForm.controls['name'].setValue(this.editData.name);
      this.proTenderForm.controls['description'].setValue(this.editData.description);
      this.proTenderForm.controls['date'].setValue(this.editData.date);
      this.proTenderForm.controls['cityStateId'].setValue(this.editData.cityStateId);
      this.proTenderForm.controls['operationTypeId'].setValue(this.editData.operationTypeId);
      this.proTenderForm.controls['tenderTypeId'].setValue(this.editData.tenderTypeId);
      this.proTenderForm.controls['value'].setValue(this.editData.value);
      this.proTenderForm.controls['planTypeId'].setValue(this.editData.planTypeId);
      this.proTenderForm.controls['period'].setValue(this.editData.period);
      this.proTenderForm.controls['torValue'].setValue(this.editData.torValue);
      this.proTenderForm.controls['tenderBondValue'].setValue(this.editData.tenderBondValue);
      this.proTenderForm.controls['technicalOpeningDate'].setValue(this.editData.technicalOpeningDate);
      this.proTenderForm.controls['technicalSelectionDate'].setValue(this.editData.technicalSelectionDate);
      this.proTenderForm.controls['financialOpeningDate'].setValue(this.editData.financialOpeningDate);
      this.proTenderForm.controls['financialSelectionDate'].setValue(this.editData.financialSelectionDate);
      this.proTenderForm.controls['estimatingValue'].setValue(this.editData.estimatingValue);
      this.proTenderForm.controls['awardValue'].setValue(this.editData.awardValue);
      this.proTenderForm.controls['awardLetterDate'].setValue(this.editData.awardLetterDate);
      this.proTenderForm.controls['workOrderDate'].setValue(this.editData.workOrderDate);
      this.proTenderForm.controls['deliveryDate'].setValue(this.editData.deliveryDate);
      this.proTenderForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.proTenderForm.addControl('id', new FormControl('', Validators.required));
      this.proTenderForm.controls['id'].setValue(this.editData.id);

    }
    else {
      this.getProTenderAutoCode();
    }

  }


  private _filterCityState(value: string): CityState[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.cityStateList.filter(
      (cityState) =>
        cityState.name ? cityState.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayCityStateName(categoryFirst: any): string {
    return categoryFirst ? categoryFirst.name && categoryFirst.name != null ? categoryFirst.name : '-' : '';
  }
  CityStateSelected(event: MatAutocompleteSelectedEvent): void {
    const cityState = event.option.value as CityState;
    console.log("cityState selected: ", cityState);
    this.selectedCityState = cityState;
    this.proTenderForm.patchValue({ cityStateId: cityState.id });

  }
  openAutoCityState() {
    this.cityStateCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.cityStateCtrl.updateValueAndValidity();
  }


  private _filterOperationType(value: string): OperationType[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.operationTypeList.filter(
      (operationType) =>
        operationType.name ? operationType.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayOperationTypeName(operationType: any): string {
    return operationType ? operationType.name && operationType.name != null ? operationType.name : '-' : '';
  }
  OperationTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const operationType = event.option.value as OperationType;
    console.log("operationType selected: ", operationType);
    this.selectedOperationType = operationType;
    this.proTenderForm.patchValue({ operationTypeId: operationType.id });

  }
  openAutoOperationType() {
    this.operationTypeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.operationTypeCtrl.updateValueAndValidity();
  }


  private _filterTenderType(value: string): TenderType[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.tenderTypeList.filter(
      (tenderType) =>
        tenderType.name ? tenderType.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayTenderTypeName(tenderType: any): string {
    return tenderType ? tenderType.name && tenderType.name != null ? tenderType.name : '-' : '';
  }
  TenderTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const tenderType = event.option.value as TenderType;
    console.log("tenderType selected: ", tenderType);
    this.selectedTenderType = tenderType;
    this.proTenderForm.patchValue({ tenderTypeId: tenderType.id });

  }
  openAutoTenderType() {
    this.tenderTypeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.tenderTypeCtrl.updateValueAndValidity();
  }


  private _filterPlanType(value: string): PlanType[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.planTypeList.filter(
      (planType) =>
        planType.name ? planType.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayPlanTypeName(planType: any): string {
    return planType ? planType.name && planType.name != null ? planType.name : '-' : '';
  }
  PlanTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const planType = event.option.value as PlanType;
    console.log("planType selected: ", planType);
    this.selectedPlanType = planType;
    this.proTenderForm.patchValue({ planTypeId: planType.id });

  }
  openAutoPlanType() {
    this.planTypeCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.planTypeCtrl.updateValueAndValidity();
  }


  async addProTender() {
    if (!this.editData) {
      this.proTenderForm.removeControl('id')

      this.proTenderForm.controls['transactionUserId'].setValue(this.transactionUserId);

      console.log("form post value: ", this.proTenderForm.value)

      if (this.proTenderForm.valid) {

        this.api.postProTender(this.proTenderForm.value)
          .subscribe({
            next: (res) => {
              this.toastrPostSuccess();
              this.proTenderForm.reset();

              this.dialogRef.close('حفظ');
            },
            error: (err) => {
              this.toastrPostError();
            }
          })
      }
      else {
        this.toastrPostWarning();
      }

    }
    else {
      this.updateProTender()
    }
  }

  updateProTender() {
    console.log("update form values: ", this.proTenderForm.value)
    this.api.putProTender(this.proTenderForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()

          this.proTenderForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          this.toastrEditWarning();
        }
      })
  }

  getProTenderAutoCode() {
    this.api.getProTenderAutoCode()
      .subscribe({
        next: (res) => {
          console.log("autoCode res: ", res);
          this.autoCode = res;
          this.proTenderForm.controls['code'].setValue(this.autoCode);
        },
        error: (err) => {
          console.log("fetch autoCode data err: ", err);
          this.toastrAutoCodeGenerateError();
        }
      })
  }

  getHrCityState() {
    this.api.getHrCityState()
      .subscribe({
        next: (res) => {
          this.cityStateList = res;
        },
        error: (err) => {
          console.log("fetch cityStateList data err: ", err);
        }
      })
  }

  getProOperationType() {
    this.api.getProOperationType()
      .subscribe({
        next: (res) => {
          this.operationTypeList = res;
        },
        error: (err) => {
          console.log("fetch operationTypeList data err: ", err);
        }
      })
  }

  getProTenderType() {
    this.api.getProTenderType()
      .subscribe({
        next: (res) => {
          this.tenderTypeList = res;
        },
        error: (err) => {
          console.log("fetch tenderTypeList data err: ", err);
        }
      })
  }

  getProPlanType() {
    this.api.getProPlanType()
      .subscribe({
        next: (res) => {
          this.planTypeList = res;
        },
        error: (err) => {
          console.log("fetch planTypeList data err: ", err);
        }
      })
  }



  toastrPostSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }
  toastrPostError(): void {
    this.toastr.error('  حدث خطا اثناء الاضافة ! ');
  }
  toastrPostWarning(): void {
    this.toastr.error(' برجاء التاكد من ادخال البيانات كاملة ! ');
  }
  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
  toastrEditWarning(): void {
    this.toastr.warning(' حدث خطا اثناء التحديث ! ');
  }
  toastrAutoCodeGenerateError(): void {
    this.toastr.error('  حدث خطا اثناء توليد الكود ! ');
  }
}
