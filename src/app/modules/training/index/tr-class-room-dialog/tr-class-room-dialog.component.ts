import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
import { HotkeysService } from 'angular2-hotkeys';
import { Hotkey } from 'angular2-hotkeys';
export class CityState {
  constructor(public id: number, public name: string) {}
}
export class TrainingCenter {
  constructor(public id: number, public name: string) {}
}
@Component({
  selector: 'app-tr-class-room-dialog',
  templateUrl: './tr-class-room-dialog.component.html',
  styleUrls: ['./tr-class-room-dialog.component.css']
})
export class TrClassRoomDialogComponent {


  transactionUserId=localStorage.getItem('transactionUserId')
  cityStateCtrl: FormControl;
  filteredCityStates: Observable<CityState[]>;
  cityStates: CityState[] = [];
  selectedCityState: CityState | undefined;
  trainingCenterCtrl: FormControl;
  filteredTrainingCenteres: Observable<TrainingCenter[]>;
  trainingCenteres:TrainingCenter[] = [];
  selectedTrainingCenter: TrainingCenter | undefined;
  formcontrol = new FormControl('');  
  modelForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getModelData: any;
  Id:string  | undefined | null;
   vendorDt:any={
  id:0,
}
commname:any;
dataSource!: MatTableDataSource<any>;
existingNames: string[] = [];
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
cityStatelist:any;
cityStateName: any;
trainingCenterList: any;
trainingCenterName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<TrClassRoomDialogComponent>,
    private toastr: ToastrService) {
      this.cityStateCtrl = new FormControl();
      this.filteredCityStates = this.cityStateCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterCityStates(value))
      );
      this.trainingCenterCtrl = new FormControl();
      this.filteredTrainingCenteres = this.trainingCenterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterTrainingCenteres(value))
      );
    }
    ngOnInit(): void {
      this.getExistingNames(); // Fetch existing names
      this.modelForm = this.formBuilder.group({
        //define the components of the form
     
      
      code : ['',Validators.required],
      name : ['',Validators.required],
      address : ['',Validators.required],
      type : ['',Validators.required],
      capacity : ['',Validators.required],
      isActive : ['',Validators.required],
      cityStateId : ['',Validators.required],
      cityStateName : [''],
      trainingCenterId : ['',Validators.required],
      trainingCenterName : [''],
      id : ['',Validators.required],
      transactionUserId : ['',Validators.required]
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllCityState().subscribe((cityStates)=>{
        this.cityStates = cityStates;
      });
      this.api.getAllTrainingCenter().subscribe((trainingCenteres)=>{
        this.trainingCenteres = trainingCenteres;
      });
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addClassRoom();
        return false; // Prevent the default browser behavior
      }));
  
      if(this.editData){
        this.actionBtn = "تعديل";
        console.log("")
      this.getModelData = this.editData;
      this.modelForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        
      this.modelForm.controls['code'].setValue(this.editData.code);
      this.modelForm.controls['name'].setValue(this.editData.name);
      this.modelForm.controls['address'].setValue(this.editData.address);
      this.modelForm.controls['type'].setValue(this.editData.type);
      this.modelForm.controls['capacity'].setValue(this.editData.capacity);
      this.modelForm.controls['isActive'].setValue(this.editData.isActive);
      this.modelForm.controls['cityStateId'].setValue(this.editData.cityStateId);
      this.modelForm.controls['cityStateName'].setValue(this.editData.cityStateName);
      this.modelForm.controls['trainingCenterId'].setValue(this.editData.trainingCenterId);
      this.modelForm.controls['trainingCenterName'].setValue(this.editData.trainingCenterName);
      // console.log("commodityId: ", this.modelForm.controls['commodityId'].value)
      this.modelForm.addControl('id', new FormControl('', Validators.required));
      this.modelForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayCityStateName(cityState: any): string {
      return cityState && cityState.name ? cityState.name : '';
    }

    cityStateSelected(event: MatAutocompleteSelectedEvent): void {
      const cityState = event.option.value as CityState;
      this.selectedCityState = cityState;
      this.modelForm.patchValue({ cityStateId: cityState.id });
      this.modelForm.patchValue({ cityStateName: cityState.name });
    }

    private _filterCityStates(value: string): CityState[] {
      const filterValue = value.toLowerCase();
      return this.cityStates.filter(cityState =>
        cityState.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoCityState() {
      this.cityStateCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.cityStateCtrl.updateValueAndValidity();
    }
    
    displayTrainingCenterName(trainingCenter: any): string {
      return trainingCenter && trainingCenter.name ? trainingCenter.name : '';
    }
    trainingCenterSelected(event: MatAutocompleteSelectedEvent): void {
      const trainingCenter = event.option.value as TrainingCenter;
      this.selectedTrainingCenter = trainingCenter;
      this.modelForm.patchValue({ trainingCenterId: trainingCenter.id });
      this.modelForm.patchValue({ trainingCenterName: trainingCenter.name });
    }

    private _filterTrainingCenteres(value: string): TrainingCenter[] {
      const filterValue = value.toLowerCase();
      return this.trainingCenteres.filter(trainingCenter =>
        trainingCenter.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoTrainingCenter() {
      this.trainingCenterCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.trainingCenterCtrl.updateValueAndValidity();
    }
    getExistingNames() {
      this.api.getClassRoom().subscribe({
        next: (res) => {
          this.existingNames = res.map((item: any) => item.name);
        },
        error: (err) => {
          console.log('Error fetching existing names:', err);
        }
      });
    }

  addClassRoom(){
    if(!this.editData){
      const enteredName = this.modelForm.get('name')?.value;

    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
      this.modelForm.removeControl('id')
      // this.modelForm.controls['commodityId'].setValue(this.selectedOption.id);
      this.modelForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("add: ", this.modelForm.value);
      if(this.modelForm.valid){
        this.api.postClassRoom(this.modelForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.modelForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            this.toastrErrorSave();
          }
        })
      }
    }else{
      this.updateClassRoom()
    }
  }

  displayVendor (option:any):string {
    return option && option.name ? option.name:'';

  }
      updateClassRoom(){
        this.api.putClassRoom(this.modelForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEdit();
            this.modelForm.reset();
            this.dialogRef.close('update');
          },
          error:()=>{
            this.toastrErrorEdit();
          }
        })
      }
      toastrSuccess(): void {
        this.toastr.success('تم الحفظ بنجاح');
      }
    
      toastrEdit(): void {
        this.toastr.success('تم التحديث بنجاح');
      }
    
      toastrErrorSave(): void {
        this.toastr.error('!خطأ عند حفظ البيانات');
      }
    
      toastrErrorEdit(): void {
        this.toastr.error('!خطأ عند تحديث البيانات');
      }
    
  }
  


