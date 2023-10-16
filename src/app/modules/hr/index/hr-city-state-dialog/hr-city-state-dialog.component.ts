import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
// import { publishFacade } from '@angular/compiler';
// import { STRGradeComponent } from '../str-grade/str-grade.component';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class City {
  constructor(public id: number, public name: string) {}
}

 
@Component({
  selector: 'app-hr-city-state-dialog',
  templateUrl: './hr-city-state-dialog.component.html',
  styleUrls: ['./hr-city-state-dialog.component.css']
})
export class HrCityStateDialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  cityCtrl: FormControl;
  filteredCities: Observable<City[]>;
  cities: City[] = [];
  selectedCity: City | undefined;
  formcontrol = new FormControl('');  
  cityStateForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getCityStateData: any;
  Id:string  | undefined | null;
   commidityDt:any={
  id:0,
}
commname:any;
dataSource!: MatTableDataSource<any>;

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
// citylist:any;
// storeList: any;
// cityName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private toastr: ToastrService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrCityStateDialogComponent>){
      this.cityCtrl = new FormControl();
      this.filteredCities = this.cityCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCities(value))
      );
    }
    ngOnInit(): void {
      this.cityStateForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      // code : ['',Validators.required],
      name : ['',Validators.required],
      cityId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllCitis().subscribe((city)=>{
        this.cities = city;
      });
      
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addCityState();
        return false; // Prevent the default browser behavior
      }));
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getCityStateData = this.editData;
      this.cityStateForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.cityStateForm.controls['code'].setValue(this.editData.code);
      this.cityStateForm.controls['name'].setValue(this.editData.name);
      
      this.cityStateForm.controls['cityId'].setValue(this.editData.cityId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.cityStateForm.addControl('id', new FormControl('', Validators.required));
      this.cityStateForm.controls['id'].setValue(this.editData.id);
      }
    }

    displaycityName(city: any): string {
      return city && city.name ? city.name : '';
    }

    citySelected(event: MatAutocompleteSelectedEvent): void {
      const city = event.option.value as City;
      this.selectedCity = city;
      this.cityStateForm.patchValue({ cityId: city.id });
      this.cityStateForm.patchValue({ cityName: city.name });
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

    

  addCityState(){
    if(!this.editData){
      
      this.cityStateForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.cityStateForm.value);
      this.cityStateForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.cityStateForm.valid){
        this.api.postHrCityState(this.cityStateForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.cityStateForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateCityState()
    }
  }


  updateCityState(){
        this.api.putHrCityState(this.cityStateForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEditSuccess();
            this.cityStateForm.reset();
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
