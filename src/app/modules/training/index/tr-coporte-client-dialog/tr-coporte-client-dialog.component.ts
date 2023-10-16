import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';

export class City {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-tr-coporte-client-dialog',
  templateUrl: './tr-coporte-client-dialog.component.html',
  styleUrls: ['./tr-coporte-client-dialog.component.css']
})
export class TrCoporteClientDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')

  getHrTrCoporteClientData: any;
  cityCtrl: FormControl;
  filteredCities: Observable<City[]>;
  cities: City[] = [];
  selectedCity: City | undefined;

  formcontrol = new FormControl('');  
  TrCoporteClientForm !:FormGroup;
  actionBtn : string = "حفظ"


  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private hotkeysService: HotkeysService,
    private readonly route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<TrCoporteClientDialogComponent>) {
      this.cityCtrl = new FormControl();
      this.filteredCities = this.cityCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCities(value))
      );
  }
  ngOnInit(): void {  
    this.TrCoporteClientForm = this.formBuilder.group({
      transactionUserId: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      cityId: ['', Validators.required],
      // id: ['', Validators.required],
    });

    this.api.getAllCitis().subscribe((city)=>{
      this.cities = city;
    });
   

    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      // Call the deleteGrade() function in the current component
      this.addTrCoporteClient();
      return false; // Prevent the default browser behavior
    }));
    if (this.editData) {
      console.log("edit data: ", this.editData)
      this.actionBtn = "تعديل";
      this.getHrTrCoporteClientData = this.editData;
      this.TrCoporteClientForm.controls['transactionUserId'].setValue(this.transactionUserId);
      this.TrCoporteClientForm.controls['name'].setValue(this.editData.name);
      this.TrCoporteClientForm.controls['code'].setValue(this.editData.code);
      this.TrCoporteClientForm.controls['phone'].setValue(this.editData.phone);
      this.TrCoporteClientForm.controls['email'].setValue(this.editData.email);
      this.TrCoporteClientForm.controls['address'].setValue(this.editData.address);
      this.TrCoporteClientForm.controls['cityId'].setValue(this.editData.cityId);
      // this.unitsForm.controls['id'].setValue(this.editData.id);
      this.TrCoporteClientForm.addControl('id', new FormControl('', Validators.required));
      this.TrCoporteClientForm.controls['id'].setValue(this.editData.id);
    }
  }

  addTrCoporteClient() {
    this.TrCoporteClientForm.controls['transactionUserId'].setValue(this.transactionUserId);


    if (!this.editData) {
      this.TrCoporteClientForm.removeControl('id')
      if (this.TrCoporteClientForm.valid) {
        this.api.postTrCoporteClient(this.TrCoporteClientForm.value)
          .subscribe({
            next: (res) => {
              // alert("تمت الاضافة بنجاح");
              this.toastrSuccess();
              this.TrCoporteClientForm.reset();
              this.dialogRef.close('save');
            },
            error: (err) => {
              alert("خطأ عند اضافة البيانات")
              console.log(err)
            }
          })
      }
    } else {
      this.updateTrCoporteClient()
    }
  }
  updateTrCoporteClient() {
    this.api.putTrCoporteClient(this.TrCoporteClientForm.value)
      .subscribe({
        next: (res) => {
          // alert("تم التحديث بنجاح");
          this.toastrEditSuccess();
          this.TrCoporteClientForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("خطأ عند تحديث البيانات");
        }
      })
  }


  displaycityName(city: any): string {
    return city && city.name ? city.name : '';
  }

  citySelected(event: MatAutocompleteSelectedEvent): void {
    const city = event.option.value as City;
    this.selectedCity = city;
    this.TrCoporteClientForm.patchValue({ cityId: city.id });
    this.TrCoporteClientForm.patchValue({ cityName: city.name });
  }

  private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city =>
      city.name.toLowerCase().includes(filterValue) 
    );
  }

  openAutoCity() {
    this.cityCtrl.setValue(''); // Clear the input field value
  
    // Open the autocomplete dropdown by triggering the value change event
    this.cityCtrl.updateValueAndValidity();
  }

  toastrSuccess(): void {
    this.toastr.success('تم الحفظ بنجاح');
  }

  toastrEditSuccess(): void {
    this.toastr.success('تم التعديل بنجاح');
  }
}
