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
export class SubRegion {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-cc-plant-dialog',
  templateUrl: './cc-plant-dialog.component.html',
  styleUrls: ['./cc-plant-dialog.component.css']
})
export class CcPlantDialogComponent {

  transactionUserId=localStorage.getItem('transactionUserId')
  subRegionCtrl: FormControl;
  filteredSubRegiones: Observable<SubRegion[]>;
  subRegiones: SubRegion[] = [];
  selectedVendor: SubRegion | undefined;
  formcontrol = new FormControl('');  
  PLantForm !:FormGroup;
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
    private dialogRef : MatDialogRef<CcPlantDialogComponent>,
    private toastr: ToastrService) {
      this.subRegionCtrl = new FormControl();
      this.filteredSubRegiones = this.subRegionCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterSubRegiones(value))
      );
    }
    ngOnInit(): void {
      // this.getExistingNames(); // Fetch existing names
      this.PLantForm = this.formBuilder.group({
        //define the components of the form
      transactionUserId : ['',Validators.required],
      
      name : ['',Validators.required],
      code : ['',Validators.required],
      subRegionId : ['',Validators.required],
      subRegionName : [''],

      id : ['',Validators.required],
      // matautocompleteFieldName : [''],
      });
  
      this.api.getAllSubRegiones().subscribe((subRegiones)=>{
        this.subRegiones = subRegiones;
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
      this.PLantForm.controls['transactionUserId'].setValue(this.editData.transactionUserId);
        
      this.PLantForm.controls['name'].setValue(this.editData.name);
      this.PLantForm.controls['code'].setValue(this.editData.code);
          this.PLantForm.controls['subRegionId'].setValue(this.editData.subRegionId);
      this.PLantForm.controls['subRegionName'].setValue(this.editData.subRegionName);

      // console.log("commodityId: ", this.modelForm.controls['commodityId'].value)
      this.PLantForm.addControl('id', new FormControl('', Validators.required));
      this.PLantForm.controls['id'].setValue(this.editData.id);
      }
    }

    displaySubRegionName(subRegion: any): string {
      return subRegion && subRegion.name ? subRegion.name : '';
    }

    subRegionSelected(event: MatAutocompleteSelectedEvent): void {
      const subRegion = event.option.value as SubRegion;
      this.selectedVendor = subRegion;
      this.PLantForm.patchValue({ subRegionId: subRegion.id });
      this.PLantForm.patchValue({ subRegionName: subRegion.name });
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

    getExistingNames() {
      this.api.getPlant().subscribe({
        next: (res) => {
          this.existingNames = res.map((item: any) => item.name);
        },
        error: (err) => {
          console.log('Error fetching existing names:', err);
        }
      });
    }

    addPlant(){
    if(!this.editData){
      const enteredName = this.PLantForm.get('name')?.value;

    if (this.existingNames.includes(enteredName)) {
      alert('هذا الاسم موجود من قبل، قم بتغييره');
      return;
    }
      this.PLantForm.removeControl('id')
      // this.modelForm.controls['commodityId'].setValue(this.selectedOption.id);
   
      this.PLantForm.controls['transactionUserId'].setValue(this.transactionUserId);
      console.log("add: ", this.PLantForm.value);
      if(this.PLantForm.valid){
        this.api.postPlant(this.PLantForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrSuccess();
            this.PLantForm.reset();
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

  displaySubRegion (option:any):string {
    return option && option.name ? option.name:'';

  }
      updatePlant(){
        this.api.putPlant(this.PLantForm.value)
        .subscribe({
          next:(res)=>{
            this.toastrEdit();
            this.PLantForm.reset();
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
  


