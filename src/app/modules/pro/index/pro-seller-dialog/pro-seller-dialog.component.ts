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

export class City {
  constructor(public id: number, public name: string) { }
}

@Component({
  selector: 'app-pro-seller-dialog',
  templateUrl: './pro-seller-dialog.component.html',
  styleUrls: ['./pro-seller-dialog.component.css']
})
export class ProSellerDialogComponent implements OnInit {
  transactionUserId = localStorage.getItem('transactionUserId')
  autoCode: any;
  proSellerForm !: FormGroup;
  actionBtn: string = "حفظ";
  // cityStateList: any;
  // cityList: any;

  cityStateCtrl: FormControl;
  filteredCityState: Observable<CityState[]>;
  cityStateList: CityState[] = [];
  selectedCityState!: CityState;

  cityCtrl: FormControl;
  filteredCity: Observable<City[]>;
  cityList: City[] = [];
  selectedCity!: City;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public editData: any, private http: HttpClient,
    private dialogRef: MatDialogRef<ProSellerDialogComponent>,
    private toastr: ToastrService) {

    this.cityStateCtrl = new FormControl();
    this.filteredCityState = this.cityStateCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCityState(value))
    );

    this.cityCtrl = new FormControl();
    this.filteredCity = this.cityCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCity(value))
    );
  }

  ngOnInit(): void {

    this.getHrCity();
    this.getHrCityState();

    this.proSellerForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      cityId: [null],
      cityStateId: [null],
      address: [''],
      commericalRegister: ['', Validators.required],
      taxCard: ['', Validators.required],
      transactionUserId: ['', Validators.required],
    });

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addProSeller();
      return false; // Prevent the default browser behavior
    }));


    if (this.editData) {
      console.log("edit data", this.editData);

      this.actionBtn = "تعديل";
      this.proSellerForm.controls['code'].setValue(this.editData.code);
      this.proSellerForm.controls['name'].setValue(this.editData.name);
      this.proSellerForm.controls['phone'].setValue(this.editData.phone);
      this.proSellerForm.controls['email'].setValue(this.editData.email);
      this.proSellerForm.controls['cityId'].setValue(this.editData.cityId);
      this.proSellerForm.controls['cityStateId'].setValue(this.editData.cityStateId);
      this.proSellerForm.controls['address'].setValue(this.editData.address);
      this.proSellerForm.controls['commericalRegister'].setValue(this.editData.commericalRegister);
      this.proSellerForm.controls['taxCard'].setValue(this.editData.taxCard);
      this.proSellerForm.controls['transactionUserId'].setValue(this.transactionUserId);

      this.proSellerForm.addControl('id', new FormControl('', Validators.required));
      this.proSellerForm.controls['id'].setValue(this.editData.id);

    }
    else {
      this.getProSellerAutoCode();
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
    this.proSellerForm.patchValue({ cityStateId: cityState.id });

  }
  openAutoCityState() {
    this.cityStateCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.cityStateCtrl.updateValueAndValidity();
  }


  private _filterCity(value: string): City[] {
    const filterValue = value;
    console.log("filterValue222:", filterValue);

    return this.cityList.filter(
      (city) =>
        city.name ? city.name.toLowerCase().includes(filterValue) : '-'
    );
  }
  displayCityName(city: any): string {
    return city ? city.name && city.name != null ? city.name : '-' : '';
  }
  CitySelected(event: MatAutocompleteSelectedEvent): void {
    const city = event.option.value as City;
    console.log("city selected: ", city);
    this.selectedCity = city;
    this.proSellerForm.patchValue({ cityId: city.id });

  }
  openAutoCity() {
    this.cityCtrl.setValue(''); // Clear the input field value

    // Open the autocomplete dropdown by triggering the value change event
    this.cityCtrl.updateValueAndValidity();
  }

  async addProSeller() {
    if (!this.editData) {
      this.proSellerForm.removeControl('id')

      this.proSellerForm.controls['transactionUserId'].setValue(this.transactionUserId);
      this.proSellerForm.controls['phone'].setValue(String(this.proSellerForm.getRawValue().phone));

      console.log("form post value: ", this.proSellerForm.value)

      if (this.proSellerForm.valid) {

        this.api.postProSeller(this.proSellerForm.value)
          .subscribe({
            next: (res) => {
              this.toastrPostSuccess();
              this.proSellerForm.reset();

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
      this.updateProSeller()
    }
  }

  updateProSeller() {
    this.proSellerForm.controls['phone'].setValue(String(this.proSellerForm.getRawValue().phone));

    console.log("update form values: ", this.proSellerForm.value)
    this.api.putProSeller(this.proSellerForm.value)
      .subscribe({
        next: (res) => {
          this.toastrEditSuccess()

          this.proSellerForm.reset();
          this.dialogRef.close('تعديل');
        },
        error: () => {
          this.toastrEditWarning();
        }
      })
  }

  getProSellerAutoCode() {
    this.api.getProSellerAutoCode()
      .subscribe({
        next: (res) => {
          console.log("autoCode res: ", res);
          this.autoCode = res;
          this.proSellerForm.controls['code'].setValue(this.autoCode);
        },
        error: (err) => {
          console.log("fetch autoCode data err: ", err);
          this.toastrAutoCodeGenerateError();
        }
      })
  }

  getHrCity() {
    this.api.getHrCity()
      .subscribe({
        next: (res) => {
          console.log("city res: ", res);
          this.cityList = res;
        },
        error: (err) => {
          console.log("fetch city data err: ", err);
          // this.toastrAutoCodeGenerateError();
        }
      })
  }

  getHrCityState() {
    this.api.getHrCityState()
      .subscribe({
        next: (res) => {
          console.log("cityState res: ", res);
          this.cityStateList = res;
        },
        error: (err) => {
          console.log("fetch cityState data err: ", err);
          // this.toastrAutoCodeGenerateError();
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
