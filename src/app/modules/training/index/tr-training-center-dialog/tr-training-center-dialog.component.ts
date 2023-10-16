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

export class City {
  constructor(public id: number, public name: string) {}
}


@Component({
  selector: 'app-tr-training-center-dialog',
  templateUrl: './tr-training-center-dialog.component.html',
  styleUrls: ['./tr-training-center-dialog.component.css']
})
export class TrTrainingCenterDialogComponent implements OnInit {
  transactionUserId=localStorage.getItem('transactionUserId')

  cityCtrl: FormControl;
  filteredCities: Observable<City[]>;
  cities: City[] = [];
  selectedCity: City | undefined;

  
  getTrainingCenterForm: any;
  TrainingCenterForm!: FormGroup;
  actionBtn: string = 'حفظ';
  productIdToEdit: any;
  existingNames: string[] = [];

  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<TrTrainingCenterDialogComponent>){
      this.cityCtrl = new FormControl();
      this.filteredCities = this.cityCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCities(value))
      );

    }
    ngOnInit(): void {
      this.TrainingCenterForm = this.formBuilder.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        phone: ['', Validators.required],
        isActive: ['', Validators.required],
        email: ['', Validators.required],
        address: ['', Validators.required],
        cityId: ['', Validators.required],
        transactionUserId: ['',Validators.required],
      });
      
      this.api.getAllCities().subscribe((cities) => {
        this.cities = cities;
      });
  
  
  
      this.hotkeysService.add(
        new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
          // Call the deleteGrade() function in the current component
          this.addTrainingCenter();
          return false; // Prevent the default browser behavior
        })
      );
  
      if (this.editData) {
        this.actionBtn = 'تحديث';
        console.log("edit",this.editData);
        
        this.getTrainingCenterForm = this.editData;
        this.TrainingCenterForm.controls['name'].setValue(this.editData.name);
        this.TrainingCenterForm.controls['code'].setValue(this.editData.code);
        this.TrainingCenterForm.controls['phone'].setValue(this.editData.phone);
        this.TrainingCenterForm.controls['isActive'].setValue(this.editData.isActive);
        this.TrainingCenterForm.controls['email'].setValue(this.editData.email);
        this.TrainingCenterForm.controls['address'].setValue(this.editData.address);
        this.TrainingCenterForm.controls['cityId'].setValue(this.editData.cityId);
        this.TrainingCenterForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        this.TrainingCenterForm.addControl('id', new FormControl('', Validators.required));
        this.TrainingCenterForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayCityName(city: any): string {
      return city && city.name ? city.name : '';
    }
  
    citySelected(event: MatAutocompleteSelectedEvent): void {
      const city = event.option.value as City;
      this.selectedCity = city;
      this.TrainingCenterForm.patchValue({ cityId: city.id });
      this.TrainingCenterForm.patchValue({ cityName: city.name });
    }
  
    private _filterCities(value: string): City[] {
      const filterValue = value.toLowerCase();
      return this.cities.filter(
        (city) => city.name.toLowerCase().includes(filterValue)
        );
    }
  
    openAutoCity() {
      this.cityCtrl.setValue('');
      this.cityCtrl.updateValueAndValidity();
    }

    
    getExistingNames() {
      this.api.getTrainingCenter().subscribe({
        next: (res) => {
          this.existingNames = res.map((product: any) => product.name);
        },
        error: (err) => {
          console.log('Error fetching existing names:', err);
        },
      });
    }

    addTrainingCenter(){
    if(!this.editData){
      
      this.TrainingCenterForm.removeControl('id')
      console.log("add: ", this.TrainingCenterForm.value);
      this.TrainingCenterForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.TrainingCenterForm.valid){
        this.api.postTrainingCenter(this.TrainingCenterForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.TrainingCenterForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            console.log("datttaaa:",this.TrainingCenterForm.value);            
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateTrainingCenter()
    }
  }


  updateTrainingCenter(){
        this.api.putTrainingCenter(this.TrainingCenterForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.TrainingCenterForm.reset();
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

