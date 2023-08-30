import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
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
export class CityState {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-hr-work-placedialog',
  templateUrl: './hr-work-placedialog.component.html',
  styleUrls: ['./hr-work-placedialog.component.css']
})
export class HrWorkPlacedialogComponent {
  transactionUserId=localStorage.getItem('transactionUserId')
  cityStateCtrl: FormControl;
  filteredCityState: Observable<CityState[]>;
  CityStates: CityState[] = [];
  selectedCitystate: CityState | undefined;
  formcontrol = new FormControl('');  
  WorkPlaceCtrlForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getWorkPlaceData: any;
  Id:string  | undefined | null;
   commidityDt:any={
  id:0,
}
// commname:any;
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
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<HrWorkPlacedialogComponent>){
      this.cityStateCtrl = new FormControl();
      this.filteredCityState = this.cityStateCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCitystate(value))
      );
    }
    ngOnInit(): void {
      this.WorkPlaceCtrlForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      // code : ['',Validators.required],
      name : ['',Validators.required],
      cityStateId : ['',Validators.required],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
     
      this.api.getAllCityState().subscribe((citystate) => {
        this.CityStates = citystate;
      });
  
      if(this.editData){
        this.actionBtn = "تعديل";
      this.getWorkPlaceData = this.editData;
      this.WorkPlaceCtrlForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        // this.cityStateForm.controls['code'].setValue(this.editData.code);
      this.WorkPlaceCtrlForm.controls['name'].setValue(this.editData.name);
      
      this.WorkPlaceCtrlForm.controls['cityStateId'].setValue(this.editData.cityStateId);
      // console.log("commodityId: ", this.gradeForm.controls['commodityId'].value)
      this.WorkPlaceCtrlForm.addControl('id', new FormControl('', Validators.required));
      this.WorkPlaceCtrlForm.controls['id'].setValue(this.editData.id);
      }
    }

    displaycityStateName(citystate: any): string {
      return citystate && citystate.name ? citystate.name : '';
    }

    cityStateSelected(event: MatAutocompleteSelectedEvent): void {
      const citystate = event.option.value as CityState;
      this.selectedCitystate = citystate;
      this.WorkPlaceCtrlForm.patchValue({ cityStateId: citystate.id });
      this.WorkPlaceCtrlForm.patchValue({ cityStateName: citystate.name });
    }

    private _filterCitystate(value: string): CityState[] {
      const filterValue = value.toLowerCase();
      return this.CityStates.filter(cityState =>
        cityState.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoCityState() {
      this.cityStateCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.cityStateCtrl.updateValueAndValidity();
    }

    

  addWorkPlace(){
    if(!this.editData){
      
      this.WorkPlaceCtrlForm.removeControl('id')
      // this.gradeForm.controls['commodityId'].setValue(this.selectedOption.id);
      console.log("add: ", this.WorkPlaceCtrlForm.value);
      this.WorkPlaceCtrlForm.controls['transactionUserId'].setValue(this.transactionUserId);
      if(this.WorkPlaceCtrlForm.valid){
        this.api.postHrWorkPlace(this.WorkPlaceCtrlForm.value)
        .subscribe({
          next:(res)=>{
            alert("تمت الاضافة بنجاح");
            this.WorkPlaceCtrlForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            alert("خطأ عند اضافة البيانات") 
          }
        })
      }
    }else{
      this.updateWorkPlace()
    }
  }


  updateWorkPlace(){
        this.api.putHrWorkPlace(this.WorkPlaceCtrlForm.value)
        .subscribe({
          next:(res)=>{
            alert("تم التحديث بنجاح");
            this.WorkPlaceCtrlForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            alert("خطأ عند تحديث البيانات");
          }
        })
      }

}
