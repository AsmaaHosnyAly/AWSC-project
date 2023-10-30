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
export class Functionn {
  constructor(public id: number, public name: string) {}
}

export class Source {
  constructor(public id: number, public name: string) {}
}

export class Region {
  constructor(public id: number, public name: string) {}
}

export class SubRegion {
  constructor(public id: number, public name: string) {}
}

export class Plant {
  constructor(public id: number, public name: string) {}
}

export class PlantComponent {
  constructor(public id: number, public name: string) {}
}

export class Activity {
  constructor(public id: number, public name: string) {}
}
@Component({
  selector: 'app-cc-cost-center-dailog',
  templateUrl: './cc-cost-center-dailog.component.html',
  styleUrls: ['./cc-cost-center-dailog.component.css']
})
export class CcCostCenterDailogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')

  functionnCtrl: FormControl;
  filteredFunctionnes: Observable<Functionn[]>;
  functionnes: Functionn[] = [];
  selectedFunctionn: Functionn | undefined;

  sourceCtrl: FormControl;
  filteredSources: Observable<Source[]>;
  sources: Source[] = [];
  selectedSource: Source | undefined;

  regionCtrl: FormControl;
  filteredRegiones: Observable<Region[]>;
  regiones: Region[] = [];
  selectedRegion: Region | undefined;

  subRegionCtrl: FormControl;
  filteredSubRegiones: Observable<SubRegion[]>;
  subRegiones: SubRegion[] = [];
  selectedSubRegion: SubRegion | undefined;

  plantCtrl: FormControl;
  filteredPlantes: Observable<Plant[]>;
  plantes: Plant[] = [];
  selectedPlant: Plant | undefined;

  plantComponentCtrl: FormControl;
  filteredPlantComponentes: Observable<PlantComponent[]>;
  plantComponentes: PlantComponent[] = [];
  selectedPlantComponent: PlantComponent | undefined;

  activityCtrl: FormControl;
  filteredActivityes: Observable<Activity[]>;
  activityes: Activity[] = [];
  selectedActivity: Activity | undefined;

  formcontrol = new FormControl('');  
  equipmentForm !:FormGroup;
  actionBtn : string = "حفظ"
  selectedOption:any;
  getModelData: any;
  Id:string  | undefined | null;
  subRegionDt:any={
  id:0,
}
commname:any;
dataSource!: MatTableDataSource<any>;
existingNames: string[] = [];
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
@ViewChild(MatAccordion)
accordion!: MatAccordion;
vendorlist:any;
storeList: any;
vendorName: any;
  constructor(private formBuilder : FormBuilder,
    private api : ApiService,
    private hotkeysService: HotkeysService,
    private readonly route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<CcCostCenterDailogComponent>,
    private toastr: ToastrService) {

      this.functionnCtrl = new FormControl();
      this.filteredFunctionnes = this.functionnCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterFunctionnes(value))
      );

      this.sourceCtrl = new FormControl();
      this.filteredSources = this.sourceCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterSources(value))
      );

      this.regionCtrl = new FormControl();
      this.filteredRegiones = this.regionCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterRegiones(value))
      );

      this.subRegionCtrl = new FormControl();
      this.filteredSubRegiones = this.subRegionCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterSubRegiones(value))
      );

      this.plantCtrl = new FormControl();
      this.filteredPlantes = this.plantCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterPlantes(value))
      );

      this.plantComponentCtrl = new FormControl();
      this.filteredPlantComponentes = this.plantComponentCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterPlantComponentes(value))
      );

      this.activityCtrl = new FormControl();
      this.filteredActivityes = this.activityCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterActivityes(value))
      );
    }
    ngOnInit(): void {
      // this.getExistingNames(); // Fetch existing names
      this.equipmentForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      
      name : ['',Validators.required],
      code : ['',Validators.required],
      functionId : ['',Validators.required],
      functionName : [''],
      sourceId : ['',Validators.required],
      sourceName : [''],
      regionId : ['',Validators.required],
      regionName : [''],
      subRegionId : ['',Validators.required],
      subRegionName : [''],
      plantId : ['',Validators.required],
      plantName : [''],
      plantComponentId : ['',Validators.required],
      plantComponentName : [''],
      activityId : ['',Validators.required],
      activityName : [''],
      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllFunctionnes().subscribe((functionnes)=>{
        this.functionnes = functionnes;
      });
      this.api.getAllSources().subscribe((sources)=>{
        this.sources = sources;
      });
      this.api.getAllRegiones().subscribe((regiones)=>{
        this.regiones = regiones;
      });
      this.api.getAllSubRegioness().subscribe((subRegiones)=>{
        this.subRegiones = subRegiones;
      });
      this.api.getAllPlantes().subscribe((plantes)=>{
        this.plantes = plantes;
      });
      this.api.getAllplantComponentes().subscribe((plantComponentes)=>{
        this.plantComponentes = plantComponentes;
      });
      this.api.getAllActivityes().subscribe((activityes)=>{
        this.activityes = activityes;
      });
      this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
        // Call the deleteGrade() function in the current component
        this.addPlant();
        return false; // Prevent the default browser behavior
      }));
  
      if(this.editData){
        this.actionBtn = "تعديل";
        console.log("")
      this.getModelData = this.editData;
      this.equipmentForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        
      this.equipmentForm.controls['name'].setValue(this.editData.name);
      this.equipmentForm.controls['code'].setValue(this.editData.code);

          this.equipmentForm.controls['functionId'].setValue(this.editData.functionId);
      this.equipmentForm.controls['functionName'].setValue(this.editData.functionName);

      this.equipmentForm.controls['sourceId'].setValue(this.editData.sourceId);
      this.equipmentForm.controls['sourceName'].setValue(this.editData.sourceName);

      this.equipmentForm.controls['regionId'].setValue(this.editData.regionId);
      this.equipmentForm.controls['regionName'].setValue(this.editData.regionName);

      this.equipmentForm.controls['subRegionId'].setValue(this.editData.subRegionId);
      this.equipmentForm.controls['subRegionName'].setValue(this.editData.subRegionName);

      this.equipmentForm.controls['plantId'].setValue(this.editData.plantId);
      this.equipmentForm.controls['plantName'].setValue(this.editData.plantName);


      this.equipmentForm.controls['plantComponentId'].setValue(this.editData.plantComponentId);
      this.equipmentForm.controls['plantComponentName'].setValue(this.editData.plantComponentName);

      this.equipmentForm.controls['activityId'].setValue(this.editData.activityId);
      this.equipmentForm.controls['activityName'].setValue(this.editData.activityName);

      // console.log("commodityId: ", this.modelForm.controls['commodityId'].value)
      this.equipmentForm.addControl('id', new FormControl('', Validators.required));
      this.equipmentForm.controls['id'].setValue(this.editData.id);
      }
    }

    displayFunctionnName(functionnes: any): string {
      return functionnes && functionnes.name ? functionnes.name : '';
    }

    functionnSelected(event: MatAutocompleteSelectedEvent): void {
      const functionn = event.option.value as Functionn;
      this.selectedFunctionn = functionn;
      this.equipmentForm.patchValue({ functionId: functionn.id });
      this.equipmentForm.patchValue({ functionName: functionn.name });
    }

    private _filterFunctionnes(value: string): Functionn[] {
      const filterValue = value.toLowerCase();
      return this.functionnes.filter(functionn =>
        functionn.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoFunctionn() {
      this.functionnCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.functionnCtrl.updateValueAndValidity();
    }


    displaySourceName(source: any): string {
      return source && source.name ? source.name : '';
    }

    sourceSelected(event: MatAutocompleteSelectedEvent): void {
      const source = event.option.value as Source;
      this.selectedSource = source;
      this.equipmentForm.patchValue({ sourceId: source.id });
      this.equipmentForm.patchValue({ sourceName: source.name });
    }

    private _filterSources(value: string): Source[] {
      const filterValue = value.toLowerCase();
      return this.sources.filter(source =>
        source.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoSource() {
      this.sourceCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.sourceCtrl.updateValueAndValidity();
    }

    displayRegionName(region: any): string {
      return region && region.name ? region.name : '';
    }

    regionSelected(event: MatAutocompleteSelectedEvent): void {
      const region = event.option.value as Region;
      this.selectedRegion = region;
      this.equipmentForm.patchValue({ regionId: region.id });
      this.equipmentForm.patchValue({ regionName: region.name });
    }

    private _filterRegiones(value: string): Region[] {
      const filterValue = value.toLowerCase();
      return this.regiones.filter(region =>
        region.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoRegion() {
      this.regionCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.regionCtrl.updateValueAndValidity();
    }

    displaySubRegionName(subRegion: any): string {
      return subRegion && subRegion.name ? subRegion.name : '';
    }

    subRegionSelected(event: MatAutocompleteSelectedEvent): void {
      const subRegion = event.option.value as SubRegion;
      this.selectedSubRegion = subRegion;
      this.equipmentForm.patchValue({ subRegionId: subRegion.id });
      this.equipmentForm.patchValue({ subRegionName: subRegion.name });
    }

    private _filterSubRegiones(value: string): SubRegion[] {
      const filterValue = value.toLowerCase();
      return this.subRegiones.filter(subRegion =>
        subRegion.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoSubRegion() {
      this.subRegionCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.subRegionCtrl.updateValueAndValidity();
    }


    displayPlantName(plant: any): string {
      return plant && plant.name ? plant.name : '';
    }

    plantSelected(event: MatAutocompleteSelectedEvent): void {
      const plant = event.option.value as Plant;
      this.selectedPlant = plant;
      this.equipmentForm.patchValue({ plantId: plant.id });
      this.equipmentForm.patchValue({ plantName: plant.name });
    }

    private _filterPlantes(value: string): Plant[] {
      const filterValue = value.toLowerCase();
      return this.plantes.filter(plant =>
        plant.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoPlant() {
      this.plantCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.plantCtrl.updateValueAndValidity();
    }

    displayPlantComponentName(plantComponent: any): string {
      return plantComponent && plantComponent.name ? plantComponent.name : '';
    }

    plantComponentSelected(event: MatAutocompleteSelectedEvent): void {
      const plantComponent = event.option.value as PlantComponent;
      this.selectedPlantComponent = plantComponent;
      this.equipmentForm.patchValue({ plantComponentId: plantComponent.id });
      this.equipmentForm.patchValue({ plantComponentName: plantComponent.name });
    }

    private _filterPlantComponentes(value: string):PlantComponent[] {
      const filterValue = value.toLowerCase();
      return this.plantComponentes.filter(plantComponent =>
        plantComponent.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoPlantComponent() {
      this.plantComponentCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.plantComponentCtrl.updateValueAndValidity();
    }


    displayActivityName(activity: any): string {
      return activity && activity.name ? activity.name : '';
    }

    activitySelected(event: MatAutocompleteSelectedEvent): void {
      const activity = event.option.value as Activity;
      this.selectedActivity = activity;
      this.equipmentForm.patchValue({ activityId: activity.id });
      this.equipmentForm.patchValue({ activityName: activity.name });
    }

    private _filterActivityes(value: string): Activity[] {
      const filterValue = value.toLowerCase();
      return this.activityes.filter(activity =>
        activity.name.toLowerCase().includes(filterValue) 
      );
    }

    openAutoActivity() {
      this.activityCtrl.setValue(''); // Clear the input field value
    
      // Open the autocomplete dropdown by triggering the value change event
      this.activityCtrl.updateValueAndValidity();
    }
    // getExistingNames() {
    //   this.api.getPlant().subscribe({
    //     next: (res) => {
    //       this.existingNames = res.map((item: any) => item.name);
    //     },
    //     error: (err) => {
    //       console.log('Error fetching existing names:', err);
    //     }
    //   });
    // }

    addPlant(){
    if(!this.editData){
    //   const enteredName = this.equipmentForm.get('name')?.value;

    // if (this.existingNames.includes(enteredName)) {
    //   alert('هذا الاسم موجود من قبل، قم بتغييره');
    //   return;
    // }
      this.equipmentForm.removeControl('id')
      // this.modelForm.controls['commodityId'].setValue(this.selectedOption.id);
   
      this.equipmentForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("add: ", this.equipmentForm.value);
      if(this.equipmentForm.valid){
        this.api.postCostCenter(this.equipmentForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.equipmentForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{ 
            this.toastrErrorSave();
          }
        })
      }
    }else{
      this.updatePlant()
    }
  }

  displayFunctionn (option:any):string {
    return option && option.name ? option.name:'';

  }
  displaySource (option:any):string {
    return option && option.name ? option.name:'';

  }
  displayRegion (option:any):string {
    return option && option.name ? option.name:'';

  }
  displaySubRegion (option:any):string {
    return option && option.name ? option.name:'';

  }
  displayPlant (option:any):string {
    return option && option.name ? option.name:'';

  }
  displayPlantComponent (option:any):string {
    return option && option.name ? option.name:'';

  }

  displayActivity (option:any):string {
    return option && option.name ? option.name:'';

  }
      updatePlant(){
        this.api.putCostCenter(this.equipmentForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEdit();
            this.equipmentForm.reset();
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
  




